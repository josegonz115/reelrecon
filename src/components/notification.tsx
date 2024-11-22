import { db } from "@/firebase";
import { Dialog, DialogBackdrop } from "@headlessui/react";
import { addDoc, collection } from "firebase/firestore";

export default function Notification({
  fishName,
  handleFishNotifResponse,
  notificationOpen,
}: {
  fishName: string;
  handleFishNotifResponse: (caught: boolean) => void;
  notificationOpen: boolean;
}) {
  const addFish = async (
    e: React.MouseEvent<HTMLButtonElement>,
    caught: boolean
  ) => {
    e.preventDefault();

    const fishStatus = caught ? "caught" : "seen";
    try {
      const docRef = await addDoc(collection(db, "log"), {
        name: fishName,
        timestamp: new Date().getTime(),
        status: fishStatus,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <Dialog
      open={notificationOpen}
      onClose={() => handleFishNotifResponse(false)}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <div className="flex flex-col items-center rounded-lg bg-gray-700 text-lg">
          <div className="flex flex-col items-center gap-1 px-12 pb-3 pt-4">
            <p>Fish Detected!</p>
            <p>{`Catch the ${fishName}`}</p>
          </div>
          <hr className="w-full min-w-72 border-gray-400" />
          <div className="flex w-full justify-around text-white">
            <button
              onClick={(e) => {
                addFish(e, false);
                handleFishNotifResponse(false);
              }}
              className="h-full w-full border-r border-gray-400 py-3"
            >
              Missed
            </button>
            <button
              onClick={(e) => {
                addFish(e, true);
                handleFishNotifResponse(true);
              }}
              className="w-full py-3"
            >
              Caught
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
