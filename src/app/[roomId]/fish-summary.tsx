import { ChevronRightIcon } from "@heroicons/react/24/solid";

import { FishIcon } from "../components/fish-icon";
import { FishOffIcon } from "../components/fish-off-icon";

export default function FishSummary({
  name,
  caught,
}: {
  name: string;
  caught: boolean;
}) {
  return (
    <div className="flex min-w-full items-center justify-between">
      <div className="flex flex-row items-center gap-4">
        <p className="text-xl font-bold">{name}</p>
        {caught ? (
          <FishIcon className="h-8 text-white" />
        ) : (
          <FishOffIcon className="h-8 text-white" />
        )}
      </div>
      <ChevronRightIcon className="h-6" />
    </div>
  );
}
