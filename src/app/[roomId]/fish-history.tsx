import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FishIcon } from "@/components/fish-icon";
import { FishOffIcon } from "@/components/fish-off-icon";
import { db } from "@/firebase";
import {
  AdjustmentsHorizontalIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

export default function FishHistory({ historyOpen }: { historyOpen: boolean }) {
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

  const animationVariants = {
    open: {
      clipPath: "circle(1500px at 48px 94%)",
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    },
    closed: {
      opacity: 1,
      clipPath: "circle(0px at 48px 94%)",
      transition: {
        clipPath: {
          delay: 0.4,
          type: "spring",
          stiffness: 300,
          damping: 60,
        },
      },
    },
  };

  const staggerVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { y: { stiffness: 1000, velocity: -100 } },
    },
    closed: { y: 50, opacity: 0, transition: { y: { stiffness: 1000 } } },
  };

  const [filter, setFilter] = useState(false);
  const [filterSetting, setFilterSetting] = useState("all");

  const handleFilter: any = () => {
    setFilter((prev) => !prev);
  };

  return (
    <motion.div
      initial={false}
      animate={historyOpen ? "open" : "closed"}
      className={`${historyOpen ? "pointer-events-auto" : "pointer-events-none"} fixed inset-0 z-40 flex items-center justify-center`}
    >
      <motion.div
        className="flex h-full w-full flex-col items-center rounded-lg bg-sky-950 p-8 text-lg sm:flex sm:max-w-96 sm:justify-self-center"
        variants={animationVariants}
      >
        <motion.ul
          className="w-full"
          variants={staggerVariants}
        >
          <motion.p
            className="mb-4 text-center text-2xl"
            variants={itemVariants}
          >
            History
          </motion.p>
          <motion.div
            className="flex min-h-8 w-full flex-row place-items-center justify-end gap-6"
            variants={itemVariants}
          >
            {filter && (
              <>
                <motion.p
                  className={`${filterSetting == "all" && "underline underline-offset-4"}`}
                  onClick={() => setFilterSetting("all")}
                >
                  All
                </motion.p>
                <motion.p
                  className={`${filterSetting == "caught" && "underline underline-offset-4"}`}
                  onClick={() => setFilterSetting("caught")}
                >
                  Caught
                </motion.p>
                <motion.p
                  className={`${filterSetting == "seen" && "underline underline-offset-4"}`}
                  onClick={() => setFilterSetting("seen")}
                >
                  Seen
                </motion.p>
              </>
            )}
            <motion.button
              className="justify-self-end"
              onClick={() => handleFilter()}
            >
              <AdjustmentsHorizontalIcon className="h-6" />
            </motion.button>
          </motion.div>
          {logs
            .filter(
              (log: any) =>
                log.status === filterSetting || filterSetting === "all"
            )
            .map((log, idx) => (
              <motion.li
                className="flex w-full flex-row items-center justify-between border-b border-gray-400 py-6"
                key={idx}
                variants={itemVariants}
              >
                <p>{log.name.charAt(0).toUpperCase() + log.name.slice(1)}</p>
                <p className="text-gray-400">
                  {format(log.date, "M/d/yy HH:mm")}
                </p>
                {log.status === "caught" ? <FishIcon /> : <FishOffIcon />}
                <Link href={`${pathname}/${log.name}`}>
                  <ChevronRightIcon className="h-6" />
                </Link>
              </motion.li>
            ))}
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}
