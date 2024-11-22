"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IMAGE_URLS } from "@/lib/fish-data";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

const getImageUrl = (text: string) => {
  const image = IMAGE_URLS?.find((item) => item.text === text);
  return image
    ? image.value
    : "https://media.istockphoto.com/id/1417947367/vector/3d-yellow-sad-crying-emoticon-isolated.jpg?s=1024x1024&w=is&k=20&c=kyUYgu5YakWMRF8jU2l900wcggelZS45jSiKk7hol8I=";
};

const getFishDesc = (text: string) => {
  const image = IMAGE_URLS?.find((item) => item.text === text);
  return image ? image.desc : "Unable to find a description for that fish.";
};

const getFishTips = (text: string) => {
  const image = IMAGE_URLS?.find((item) => item.text === text);
  return image ? image.tips : ["Unable to find tips for that fish."];
};

export default function Home() {
  const params = useParams();
  const roomId = params.roomId;
  let fishName: string;
  if (typeof params.fish !== "string") {
    fishName = decodeURIComponent(params.fish![0]);
  } else {
    fishName = decodeURIComponent(params.fish);
  }
  fishName = fishName.charAt(0).toUpperCase() + fishName.slice(1);

  return (
    <main className="flex flex-col items-center gap-8 overflow-y-scroll p-8">
      <div className="flex w-full items-center">
        <Link href={`/${roomId}`}>
          <ChevronLeftIcon className="h-6 justify-self-start" />
        </Link>
        <h1 className="w-full pr-4 text-center text-2xl">{fishName}</h1>
      </div>
      <img
        className="max-h-52"
        src={getImageUrl(fishName)}
      ></img>
      <p>{getFishDesc(fishName)}</p>
      <div>
        <p className="pb-1 text-lg"> Fishing Tips: </p>
        {getFishTips(fishName).map((tip, idx) => (
          <p key={idx}>{`${idx + 1}. ${tip}`}</p>
        ))}
      </div>
    </main>
  );
}
