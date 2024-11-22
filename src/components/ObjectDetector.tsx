import { useEffect, useRef } from 'react';
import { io, Socket} from 'socket.io-client';

/**
calculations from backend
avg fps: 12.456194878305585
Camera resolution: 640.0x480.0
*/ 



export default function Home() {
    const socketRef = useRef<Socket | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const processedImgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
    // socketRef.current = io('http://0.0.0.0:1947');
    socketRef.current = io('http://192.168.4.52:1947'); // ip address
    // socketRef.current = io('http://172.23.89.169:1947'); // ip address

    socketRef.current.on('connect', () => {
        console.log('Connected to Python backend');
    });

    // handle python processed frames
    // handling the base64 version
    // socketRef.current.on('processed_frame', (data) => {
    //     if(!processedImgRef.current){
    //         console.error('in sockerref current, processimgref has no current');
    //         return;
    //     }
    //     processedImgRef.current.src = `data:image/jpeg;base64,${data}`;
    // });
    // handle python processed frames
    // end of base64 version
    socketRef.current.on('processed_frame', (data) => {
        if(!processedImgRef.current){
            console.error('in sockerref current, processimgref has no current');
            return;
        }
        const blob = new Blob([data], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        processedImgRef.current.src = url;
    });

    // testing on my webcam   ------------------------------------------------------------------------------
    const startVideo = async() => {
        if(!videoRef.current){
            console.error('no videoRef was setup');
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
        } catch (error) {
            console.error("erro: no webcam: ", error);
        }
    };

    // // Convert Blob to ArrayBuffer and send as binary data
    // function sendFrame(blob) {
    //     const reader = new FileReader();
    //     reader.onload = function() {
    //     const arrayBuffer = this.result;
    //     socket.emit('frame', arrayBuffer);
    //     };
    //     reader.readAsArrayBuffer(blob);
    // }
    
    /**
     * Caputres the current frame from the video element, draws it onto the hidden canvas,
     * converts the canvas content to base64 string, and emits it to the backend using the socket.
     * @returns {Promise<void>}
     */
    const captureFrameAndSendToBackend = async() => {
        if (!videoRef.current || !canvasRef.current || !socketRef.current) {
            console.error('videoRef, canvasRef, or socketRef is not set up');
            return;
        }
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');
        if(!context){
            console.error('context not setup right in captureFrameAndSendToBackend');
            return;
        }
        // CROPPING STARTS
        const cropWidth = 640;
        const cropHeight = 640;
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        // calc cropping box
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        const cropX = (videoWidth - cropWidth) / 2;
        const cropY = (videoHeight - cropHeight) / 2;
        context.drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        // CROPPING ENDS
        
        // normal draw canvas
        // canvas.width = video.videoWidth;
        // canvas.height = video.videoHeight;
        // context.drawImage(video, 0, 0, canvas.width, canvas.height);
        // end 

        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const arrayBuffer = reader.result;
                if(!socketRef.current) {
                    console.error('array buffer not good');
                    return;
                }
                socketRef.current.emit('frame_binary', arrayBuffer);
            // sending base66 starts here
            //   const base64data = reader.result?.toString().split(',')[1]; // Remove data:image/jpeg;base64,
            //   if (base64data) {
            //     if(!socketRef.current){
            //         console.error('socketRef not init inside canvas to blob!!');
            //         return;
            //     }
            //     socketRef.current.emit('frame', base64data);
            //   }
            // sending base66 ends here
            };
            reader.readAsArrayBuffer(blob);
          }
        }, 'image/jpeg');
    };
    startVideo();
    // (one --> 1000) second performed well
    const intervalId = setInterval(captureFrameAndSendToBackend, 83);
    // done testing my webcam ------------------------------------------------------------------------------

    // // Connect to ESP32 camera via WebSocket
    // const esp32Socket = new WebSocket('ws://<ESP32_CAMERA_IP>:81/');

    // esp32Socket.binaryType = 'arraybuffer';

    // esp32Socket.onmessage = (event) => {
    //   // Convert received data to a Blob
    //   const imgBlob = new Blob([event.data], { type: 'image/jpeg' });
    //   const imgURL = URL.createObjectURL(imgBlob);

    //   // Display the original video frame
    //   videoRef.current.src = imgURL;

    //   // Read the Blob as base64 to send to the backend
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     const base64data = reader.result.split(',')[1]; // Remove data:image/jpeg;base64,
    //     // Send the frame to the Python backend
    //     socketRef.current.emit('frame', base64data);
    //   };
    //   reader.readAsDataURL(imgBlob);
    // };

    return () => {
        if(!socketRef.current){
            console.error('socketref.current did not have to close');
            return;
        }
        socketRef.current.disconnect();
        clearInterval(intervalId);
    //   esp32Socket.close();
    };
  }, []);

  return (
    <div>
      <h1>ESP32 Camera Stream with YOLO Processing</h1>
      <div style={{ display: 'flex' }}>
        <div>
          <h2>Original Stream</h2>
          {/* <img ref={videoRef} alt="Original Video Stream" />   Originally  */}
          <video ref={videoRef} className="w-[640px] h-[640px]" playsInline muted></video>
          <canvas ref={canvasRef} className="w-[640px] h-[640px] absolute hidden"></canvas>
        </div>
        <div>
          <h2>Processed Stream</h2>
          {/* <img ref={processedImgRef} alt="Processed Video Stream" /> */}
          <img ref={processedImgRef} alt="Processed Video Stream" />
        </div>
      </div>
    </div>
  );
}