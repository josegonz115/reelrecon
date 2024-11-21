import Link from "next/link";
import { usePathname } from "next/navigation";
import { FishIcon } from "@/components/fish-icon";
import { FishOffIcon } from "@/components/fish-off-icon";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export default function FishSummary({
  name,
  caught,
}: {
  name: string;
  caught: boolean;
}) {
  const pathname = usePathname();

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
      <Link href={`${pathname}/${name}`}>
        <ChevronRightIcon className="h-6" />
      </Link>
    </div>
  );
}
