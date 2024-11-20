"use client";

import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { io } from "socket.io-client";

const VideoFeed = ({ roomId }) => {
  const videoGridRef = useRef(null);
  const [imageData, setImageData] = useState(null);

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
    });
  };

  // Add video stream to grid
  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    if (videoGridRef.current) {
      videoGridRef.current.append(video);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const video = document.querySelector("video");

      if (video) {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas
          .getContext("2d")
          .drawImage(video, 0, 0, canvas.width, canvas.height);
        setImageData(canvas.toDataURL("image/png"));
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [roomId]);

  return (
    <div
      id="video-grid"
      ref={videoGridRef}
      style={{ display: "grid", gap: "10px" }}
    ></div>
  );
};

export default VideoFeed;
