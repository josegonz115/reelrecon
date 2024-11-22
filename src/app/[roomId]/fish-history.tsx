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
import { collection, getDocs, orderBy, query } from "firebase/firestore";
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
  const [filter, setFilter] = useState(false);
  const [filterSetting, setFilterSetting] = useState("all");
  const [caughtCount, setCaughtCount] = useState(0);
  const [seenCount, setSeenCount] = useState(0);

  useEffect(() => {
    const fetchLogs = async () => {
      await getDocs(
        query(collection(db, "log"), orderBy("timestamp", "desc"))
      ).then((querySnapshot) => {
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
        setCaughtCount(newData.filter((log) => log.status === "caught").length);
        setSeenCount(newData.filter((log) => log.status === "seen").length);
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

  const footerItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { y: { stiffness: 1000, velocity: -100 } },
    },
    closed: { y: 0, opacity: 25, transition: { y: { stiffness: 1000 } } },
  };

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
        className="flex h-full w-full flex-col items-center overflow-y-scroll rounded-lg bg-sky-950 p-8 text-lg sm:flex sm:max-w-96 sm:justify-self-center"
        variants={animationVariants}
      >
        <motion.ul
          className="w-full pb-20"
          variants={staggerVariants}
        >
          <motion.p
            className="mb-4 text-center text-2xl"
            variants={itemVariants}
          >
            History
          </motion.p>
          <motion.div
            className={`flex min-h-8 w-full flex-row place-items-center ${filter ? "justify-between" : "justify-end"}`}
            variants={itemVariants}
          >
            {filter && (
              <span className="flex flex-row gap-8 justify-self-start">
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
              </span>
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
        <motion.div
          className="text-md fixed bottom-0 flex h-20 w-full items-end justify-end gap-4 bg-sky-950 p-8"
          variants={footerItemVariants}
        >
          <motion.div className="flex flex-row items-center gap-1">
            <motion.p>{caughtCount}</motion.p>
            <FishIcon className="h-6" />
          </motion.div>
          <motion.div className="flex flex-row items-center gap-1">
            <motion.p>{seenCount}</motion.p>
            <FishOffIcon className="h-6" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
