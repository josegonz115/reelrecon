export default function Tips({ fishingTips }: { fishingTips: string[] }) {
  return (
    <div className="flex min-w-full flex-col gap-4 self-start text-lg text-gray-200">
      <p>Fishing Tips:</p>
      <hr className="border-gray-600" />
      {fishingTips.map((tip, idx) => (
        <div
          key={idx}
          className="flex flex-col gap-4"
        >
          <p>{`${idx + 1}. ${tip}`}</p>
          <hr className="border-gray-600" />
        </div>
      ))}
    </div>
  );
}
