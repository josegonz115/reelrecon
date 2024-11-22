'use client'
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

/**
calculations from backend
avg fps: 12.456194878305585
Camera resolution: 640.0x480.0
*/

// detections.append({
//     'bbox': [x1, y1, x2, y2],
//     'confidence': confidence,
//     'class_id': cls,
//     'class_name': class_name
// })
type boundaryBoxesType = {
    bbox: [number, number, number, number],
    confidence: number,
    class_id: number,
    class_name: string,
};

export default function ObjectDetector() {
  const socketRef = useRef<Socket | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasOverlayRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    socketRef.current = io('http://0.0.0.0:1947');

    socketRef.current.on('connect', () => {
      console.log('Connected to Python backend');
    });

    socketRef.current.on('processed_frame', (boundary_boxes: boundaryBoxesType[]) => {
    //   if (!processedImgRef.current) {
    //     console.error('in socketRef current, processedImgRef has no current');
    //     return;
    //   }
    //   const blob = new Blob([data], { type: 'image/jpeg' });
    //   const url = URL.createObjectURL(blob);
    //   processedImgRef.current.src = url;

    const drawDetectionsOnVideo = (detections: boundaryBoxesType[]) => {
        if (!canvasOverlayRef.current || !videoRef.current) return;
        const canvas = canvasOverlayRef.current;
        const ctx = canvas.getContext('2d');
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        if(!ctx){
            console.error('clear drawing failed!');
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        detections.forEach((detection) => {
          const [x1, y1, x2, y2] = detection.bbox;
          // bounding box
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 2;
          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
          // label
          ctx.font = '18px Arial';
          ctx.fillStyle = 'red';
          ctx.fillText(detection.class_name, x1, y1 - 10);
        });
    };
    drawDetectionsOnVideo(boundary_boxes);
    });

    const startVideo = async () => {
      if (!videoRef.current) {
        console.error('no videoRef was setup');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 640 }, // or 320, 320
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (error) {
        console.error('error: no webcam: ', error);
      }
    };

    const captureFrameAndSendToBackend = async () => {
      if (!videoRef.current || !canvasRef.current || !socketRef.current) {
        console.error('videoRef, canvasRef, or socketRef is not set up');
        return;
      }
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      if (!context) {
        console.error('context not setup right in captureFrameAndSendToBackend');
        return;
      }
      const cropWidth = 640;
      const cropHeight = 640;
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const cropX = (videoWidth - cropWidth) / 2;
      const cropY = (videoHeight - cropHeight) / 2;
      context.drawImage(
        video,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const arrayBuffer = reader.result;
              if (!socketRef.current) {
                console.error('array buffer not good');
                return;
              }
              socketRef.current.emit('frame_binary', arrayBuffer);
            };
            reader.readAsArrayBuffer(blob);
          }
        },
        'image/jpeg'
      );
    };
    startVideo();

    const intervalId = setInterval(captureFrameAndSendToBackend, 166);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      clearInterval(intervalId);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div>
      <h1>ESP32 Camera Stream with YOLO Processing</h1>
      <div style={{ display: 'flex' }}>
        <div>
          <h2>Stream with Overlaid Processing</h2>
          <div
            style={{
              position: 'relative',
              width: '640px',
              height: '640px',
            }}
          >
            <video
              ref={videoRef}
              className='w-[100%] h-[100%] hidden'
              playsInline
              muted
            ></video>
            <canvas ref={canvasRef} className="w-[640px] h-[640px] absolute hidden"></canvas>
            <canvas
              ref={canvasOverlayRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}