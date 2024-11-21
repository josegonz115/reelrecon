"use client";

import { useParams } from "next/navigation";

import FishSummary from "./fish-summary";
import Tips from "./tips";
import VideoFeed from "./video-feed";

export default function Home() {
  const params = useParams();
  const roomId = params.roomId;

  const fishingTips = [
    "Use the right bait or lure",
    "Fish during the early morning or late evening",
    "Stay quiet and minimize movement",
  ];

  return (
    <main className="flex flex-col items-center gap-8 p-8">
      <div className="justify-self-start">
        <VideoFeed roomId={roomId} />
        <h1 className="pt-2 text-center">Video Feed</h1>
      </div>
      <FishSummary
        name={"Clownfish"}
        caught={true}
      />
      <Tips fishingTips={fishingTips} />
    </main>
  );
}
