'use client';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import SimplePeer, { Instance } from 'simple-peer';

export default function WebRtc() {
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Instance | null> (null);
  const videoRef = useRef<HTMLVideoElement | null>(null); 
  const processedVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    socketRef.current = io('http://0.0.0.0:1947');
    socketRef.current.on('connect', () => {
      console.log('Connected to signaling server');
    });
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        // Create a new SimplePeer instance
        const peer = new SimplePeer({
          initiator: true,
          trickle: false, 
          stream: stream,
        });

        // handle generated signals or (offer)
        peer.on('signal', (data) => {
            if(!socketRef.current){
                console.error('socketref not generated');
                return;
            }
          socketRef.current.emit('signal', data);
        });
        if(!socketRef.current){
            console.error('socketref not generated (2)');
            return;
        }
        // handle signals from backend
        socketRef.current.on('signal', (data) => {
          peer.signal(data);
        });

        // receive processed video stream from backend
        peer.on('stream', (stream) => {
            if (processedVideoRef.current) {
                processedVideoRef.current.srcObject = stream;
                processedVideoRef.current.play();
            }
        });

        peer.on('error', (err) => {
            console.error('Peer error:', err);
        });

        peerRef.current = peer;
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error);
      });

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div>
      <h1>WebRTC Object Detection</h1>
      <div className='flex'>
        <div>
          <h2>Original Stream</h2>
          <video
          className='w-[320px] h-[320px] hidden'
            ref={videoRef}
            autoPlay
            muted
            // height: 240
          ></video>
        </div>
        <div>
          <h2>Processed Stream</h2>
          <video
            ref={processedVideoRef}
            className='w-[320px] h-[320px]'
            autoPlay
            muted
            style={{ width: '320px', height: '320px' }}
          ></video>
        </div>
      </div>
    </div>
  );
}