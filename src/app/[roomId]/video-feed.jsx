"use client";

import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import resemble from "resemblejs";
import { io } from "socket.io-client";
import ObjectDetector from "@/components/ObjectDetector";

const VideoFeed = ({ roomId, setFishName }) => {
  const videoGridRef = useRef(null);
  const [existingVideo, setExistingVideo] = useState(false);
  const [imageData, setImageData] = useState(null);
  const prevImageDataRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io();

    // Initialize PeerJS
    const peerInstance = new Peer();

    // Access user's media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Listen for incoming calls
        peerInstance.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        // Handle new user connection
        socketInstance.on("user-connected", (userId) => {
          console.log("User connected: ", userId);
          connectToNewUser(userId, stream, peerInstance);
        });
      });

    // When peer is open, join room
    peerInstance.on("open", (id) => {
      socketInstance.emit("join-room", roomId, id);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
      peerInstance.destroy();
    };
  }, [roomId]);

  // Connect to new user
  const connectToNewUser = (userId, stream, peerInstance) => {
    const call = peerInstance.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
      video.remove();
      setExistingVideo(false);
    });
  };

  // Add video stream to grid
  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    video.style.borderRadius = "12px";
    if (videoGridRef.current) {
      videoGridRef.current.append(video);
      setExistingVideo(true);
    }
  };

  useEffect(() => {
    const options = {
      output: {
        errorColor: {
          red: 255,
          green: 0,
          blue: 255,
        },
        errorType: "movement",
        transparency: 0.3,
        largeImageThreshold: 1200,
        useCrossOrigin: false,
        outputDiff: true,
      },
      scaleToSameSize: true,
      ignore: "antialiasing",
    };
    resemble.outputSettings(options);

    const intervalId = setInterval(() => {
      const video = document.querySelector("video");

      if (video) {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas
          .getContext("2d")
          .drawImage(video, 0, 0, canvas.width, canvas.height);

        const currImageData = canvas.toDataURL("image/jpeg", 1.0);

        // Only update imageData if frame is different enough from previous frame
        if (prevImageDataRef.current) {
          resemble(currImageData)
            .compareTo(prevImageDataRef.current)
            .onComplete((data) => {
              if (data.misMatchPercentage > 50) {
                setImageData(currImageData);
              }
            });
        } else {
          // First frame
          setImageData(currImageData);
        }

        prevImageDataRef.current = currImageData;
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [roomId]);

  useEffect(() => {
    if (imageData) {
      fetch("/api/process-frame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frame: imageData }),
      });
    }
  }, [imageData]);

  return (
    <div className="rounded-[12px] bg-gray-500 w-full h-fit-content">
      {/* <div
        id="video-grid"
        ref={videoGridRef}
        style={{ display: "grid", gap: "10px" }}
      ></div> */}
      <ObjectDetector setFishName={setFishName} />
      {/* {!existingVideo && (
        <div className="h-72 w-80 rounded-[12px] bg-gray-500"></div>
      )} */}
    </div>
  );
};

export default VideoFeed;
