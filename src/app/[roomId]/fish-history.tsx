import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FishIcon } from "@/components/fish-icon";
import { FishOffIcon } from "@/components/fish-off-icon";
import { db } from "@/firebase";
import { Button, Dialog } from "@headlessui/react";
import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { collection, getDocs } from "firebase/firestore";

export default function FishHistory({
  handleFishHistoryClose,
  historyOpen,
}: {
  handleFishHistoryClose: () => void;
  historyOpen: boolean;
}) {
  const pathname = usePathname();
  const [logs, setLogs] = useState<
    Array<{
      id: string;
      name: string;
      status: string;
      date: Date;
    }>
  >([]);

  useEffect(() => {
    const fetchLogs = async () => {
      await getDocs(collection(db, "log")).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            status: data.status,
            date: new Date(data.timestamp),
          };
        });
        setLogs(newData);
      });
    };

    fetchLogs();
  }, []);

  return (
    <Dialog
      open={historyOpen}
      onClose={() => console.log("close")}
      className="z-40"
    >
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="flex h-full w-full flex-col items-center rounded-lg bg-gray-900 p-8 text-lg">
          <p className="text-2xl">History</p>
          {logs.map((log, idx) => (
            <div
              className="flex w-full flex-row items-center justify-between border-b border-gray-400 py-6"
              key={idx}
            >
              <p>{log.name.charAt(0).toUpperCase() + log.name.slice(1)}</p>
              <p className="text-gray-400">
                {format(log.date, "M/d/yy HH:mm")}
              </p>
              {log.status === "caught" ? <FishIcon /> : <FishOffIcon />}
              <Link href={`${pathname}/${log.name}`}>
                <ChevronRightIcon className="h-6" />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Button
        onClick={() => handleFishHistoryClose()}
        className="fixed bottom-0 left-0 m-4 rounded-full bg-blue-500 p-6"
      >
        <XMarkIcon className="h-6" />
      </Button>
    </Dialog>
  );
}
