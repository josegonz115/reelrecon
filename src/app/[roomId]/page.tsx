"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Notification from "@/components/notification";
import { IMAGE_URLS } from "@/lib/fish-data";
import { Button } from "@headlessui/react";
import {
  ClipboardDocumentListIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

import FishHistory from "./fish-history";
import FishSummary from "./fish-summary";
import Tips from "./tips";
import VideoFeed from "./video-feed";

export default function Home() {
  const params = useParams();
  const roomId = params.roomId;

  const [fishName, setFishName] = useState("Clownfish");
  const [fishCaught, setFishCaught] = useState(true);
  // const [fishingTips, setFishingTips] = useState([
  //   "Use the right bait or lure",
  //   "Fish during the early morning or late evening",
  //   "Stay quiet and minimize movement",
  // ]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleFishNotifResponse = (caught: boolean) => {
    setNotificationOpen(false);
    setFishCaught(caught);
  };

  const handleFishHistoryToggle = () => {
    setHistoryOpen((prev) => !prev);
  };

  const getFishTips = (text: string) => {
    const image = IMAGE_URLS?.find((item) => item.text === text);
    return image ? image.tips : [];
  };

  return (
    <main className="flex flex-col items-center gap-8 p-8">
      <Notification
        fishName={fishName}
        handleFishNotifResponse={handleFishNotifResponse}
        notificationOpen={notificationOpen}
      />
      <Button
        onClick={() => handleFishHistoryToggle()}
        className="pointer-events-auto fixed bottom-0 left-0 z-50 m-4 rounded-full bg-sky-950 p-4"
      >
        <motion.div
          animate={historyOpen ? { rotate: 180 } : { rotate: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {historyOpen ? (
            <XMarkIcon className="h-8" />
          ) : (
            <ClipboardDocumentListIcon className="h-8" />
          )}
        </motion.div>
      </Button>
      <FishHistory historyOpen={historyOpen} />
      <div className="justify-self-start">
        <VideoFeed roomId={roomId} />
        <h1 className="pt-2 text-center">Video Feed</h1>
      </div>
      <FishSummary
        name={fishName}
        caught={fishCaught}
      />
      <Tips fishingTips={getFishTips(fishName)} />
    </main>
  );
}
