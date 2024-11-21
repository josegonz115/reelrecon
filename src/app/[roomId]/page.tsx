"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Notification from "@/components/notification";
import { db } from "@/firebase";
import { Button } from "@headlessui/react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
import { addDoc, collection } from "firebase/firestore";

import FishHistory from "./fish-history";
import FishSummary from "./fish-summary";
import Tips from "./tips";
import VideoFeed from "./video-feed";

export default function Home() {
  const params = useParams();
  const roomId = params.roomId;

  const [fishName, setFishName] = useState("Clownfish");
  const [fishCaught, setFishCaught] = useState(true);
  const [fishingTips, setFishingTips] = useState([
    "Use the right bait or lure",
    "Fish during the early morning or late evening",
    "Stay quiet and minimize movement",
  ]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true);

  const handleFishNotifResponse = (caught: boolean) => {
    setNotificationOpen(false);
    setFishCaught(caught);
  };

  const addFish = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "log"), {
        name: "mudfish",
        timestamp: new Date().getTime(),
        status: "caught",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleFishHistoryClose = () => {
    console.log("toggle");
    setHistoryOpen((prev) => !prev);
  };

  return (
    <main className="flex flex-col items-center gap-8 p-8">
      <Notification
        fishName={fishName}
        handleFishNotifResponse={handleFishNotifResponse}
        notificationOpen={notificationOpen}
      />
      <Button
        onClick={() => handleFishHistoryClose()}
        className="fixed bottom-0 left-0 m-4 rounded-full bg-blue-500 p-6"
      >
        <ClipboardDocumentListIcon className="h-6" />
      </Button>
      <FishHistory
        handleFishHistoryClose={handleFishHistoryClose}
        historyOpen={historyOpen}
      />
      <div className="justify-self-start">
        <VideoFeed roomId={roomId} />
        <h1 className="pt-2 text-center">Video Feed</h1>
      </div>
      <FishSummary
        name={fishName}
        caught={fishCaught}
      />
      <Tips fishingTips={fishingTips} />

      <button
        className="bg-blue-500 p-4"
        onClick={(e) => {
          addFish(e);
        }}
      >
        ADD FISH
      </button>
    </main>
  );
}
