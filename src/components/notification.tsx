export default function Notification({
  fishName,
  handleFishNotifResponse,
}: {
  fishName: string;
  handleFishNotifResponse: (caught: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-gray-700 text-lg">
      <div className="flex flex-col items-center gap-1 px-12 pb-3 pt-4">
        <p>Fish Detected!</p>
        <p>{`Catch the ${fishName}`}</p>
      </div>
      <hr className="w-full min-w-72 border-gray-400" />
      <div className="flex w-full justify-around text-white">
        <button
          onClick={() => handleFishNotifResponse(false)}
          className="h-full w-full border-r border-gray-400 py-3"
        >
          Missed
        </button>
        <button
          onClick={() => handleFishNotifResponse(true)}
          className="w-full py-3"
        >
          Caught
        </button>
      </div>
    </div>
  );
}
