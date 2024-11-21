import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FishIcon } from "@/components/fish-icon";
import { FishOffIcon } from "@/components/fish-off-icon";
import { db } from "@/firebase";
import { Dialog, DialogBackdrop } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
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
      onClose={() => handleFishHistoryClose()}
      className="p-8"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center rounded-lg bg-gray-700 text-lg">
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
    </Dialog>
  );
}
