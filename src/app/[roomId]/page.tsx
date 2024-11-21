"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Notification from "@/components/notification";
import { Dialog, DialogBackdrop, Transition } from "@headlessui/react";

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
  let [notificationOpen, setNotificationOpen] = useState(true);

  const handleFishNotifResponse = (caught: boolean) => {
    setNotificationOpen(false);
    setFishCaught(caught);
  };

  return (
    <main className="flex flex-col items-center gap-8 p-8">
      <Dialog
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        className="p-8"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <Notification
            fishName={fishName}
            handleFishNotifResponse={handleFishNotifResponse}
          />
        </div>
      </Dialog>
      <div className="justify-self-start">
        <VideoFeed roomId={roomId} />
        <h1 className="pt-2 text-center">Video Feed</h1>
      </div>
      <FishSummary
        name={fishName}
        caught={fishCaught}
      />
      <Tips fishingTips={fishingTips} />
    </main>
  );
}
