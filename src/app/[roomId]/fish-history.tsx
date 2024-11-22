import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FishIcon } from "@/components/fish-icon";
import { FishOffIcon } from "@/components/fish-off-icon";
import { db } from "@/firebase";
import {
  AdjustmentsHorizontalIcon,
  ChevronRightIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { format } from "date-fns";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { motion, useAnimate } from "framer-motion";

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
  const [scope, animate] = useAnimate();

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

  const deleteLog = async (id: string, caught: boolean) => {
    try {
      await deleteDoc(doc(db, "log", id)).then(() => {
        console.log("Document successfully deleted!");
        setLogs(logs.filter((log) => log.id !== id));
        if (caught) {
          setCaughtCount((cnt) => cnt - 1);
        } else {
          setSeenCount((cnt) => cnt - 1);
        }
      });
    } catch (e) {
      console.error("Error deleting log: ", e);
    }
  };

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

  const trashVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { y: { stiffness: 1000, velocity: -100 }, delay: 2 },
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.1 },
    },
  };

  const handleFilter: any = () => {
    setFilter((prev) => !prev);
  };

  function handleDragEnd(
    id: string,
    caught: boolean,
    event: MouseEvent | TouchEvent | PointerEvent,
    info: {
      offset: { x: number; y: number };
      velocity: { x: number; y: number };
    }
  ) {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset >= 275 && velocity >= 0) {
      scope.current &&
        animate(scope.current, { x: "-100%" }, { duration: 0.2 });
      setTimeout(() => {
        deleteLog(id, caught);
      }, 200);
    } else {
      scope.current &&
        animate(scope.current, { x: 0, opacity: 1 }, { duration: 0.2 });
    }
    setTimeout(() => {
      document
        .querySelector("#deletebg" + id)
        ?.classList.remove("bg-gradient-to-r", "from-red-600", "to-sky-950");
    }, 500);
  }

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
              <motion.div
                className="relative w-full"
                key={idx}
              >
                <motion.div
                  className="transform cursor-grab overflow-y-hidden overflow-x-visible [-ms-overflow-style:none] [scrollbar-width:none] focus:border-0 [&::-webkit-scrollbar]:hidden"
                  whileTap={{ cursor: "grabbing" }}
                  layout
                  transition={{ type: "spring", stiffness: 600, damping: 30 }}
                >
                  <motion.li
                    className="flex w-full flex-row items-center justify-between border-b border-gray-400 bg-sky-950 py-6"
                    variants={itemVariants}
                    drag="x"
                    dragDirectionLock
                    onDragEnd={(event, info) =>
                      handleDragEnd(log.id, log.status == "caught", event, info)
                    }
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={{ left: 0, right: 0.2, top: 0, bottom: 0 }}
                    onDrag={(event, info) => {
                      if (info.offset.x >= 0) {
                        document
                          .querySelector("#deletebg" + log.id)
                          ?.classList.add(
                            "bg-gradient-to-r",
                            "from-red-600",
                            "to-sky-950"
                          );
                      }
                    }}
                  >
                    <p className="pl-1">
                      {log.name.charAt(0).toUpperCase() + log.name.slice(1)}
                    </p>
                    <div className="flex flex-row items-center gap-4">
                      <p className="text-gray-400">
                        {format(log.date, "M/d/yy HH:mm")}
                      </p>
                      {log.status === "caught" ? <FishIcon /> : <FishOffIcon />}
                      <Link href={`${pathname}/${log.name}`}>
                        <ChevronRightIcon className="h-6" />
                      </Link>
                    </div>
                  </motion.li>
                </motion.div>
                <motion.div
                  id={"deletebg" + log.id}
                  className="absolute inset-0 -z-10 ml-[1px] mt-[1px] flex w-full flex-row place-items-center justify-self-start pr-4"
                  variants={trashVariants}
                >
                  <TrashIcon className="h-6 pl-4" />
                </motion.div>
              </motion.div>
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
