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
        <div className="flex h-full w-full flex-col items-center rounded-lg bg-gray-900 text-lg">
          {logs.map((log, idx) => (
            <div
              className="flex flex-row"
              key={idx}
            >
              <p>{`${log.name} ${format(log.date, "M/d/yy HH:mm")}`}</p>
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
        className="fixed bottom-0 left-0 z-50 m-4 rounded-full bg-blue-500 p-12"
      >
        <XMarkIcon className="h-6" />
      </Button>
    </Dialog>
  );
}
