"use client";

import { useParams } from "next/navigation";
import { IMAGE_URLS } from "@/lib/fish-data";

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

export default function Home() {
  const params = useParams();
  let fishName: string;
  if (typeof params.fish !== "string") {
    fishName = decodeURIComponent(params.fish![0]);
  } else {
    fishName = decodeURIComponent(params.fish);
  }

  return (
    <main className="flex flex-col items-center gap-8 p-8">
      <h1>{fishName}</h1>
      <img
        className="max-h-52"
        src={getImageUrl(fishName)}
      ></img>
      <p>{getFishDesc(fishName)}</p>
    </main>
  );
}
