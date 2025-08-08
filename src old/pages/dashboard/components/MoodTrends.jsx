import { Loader2 } from "lucide-react";

const emojiMap = {
  mood_improved: {
    emoji: "😊",
    name: "Improved",
  },
  mood_no_change: {
    emoji: "😑",
    name: "No Change",
  },
  mood_declined: {
    emoji: "😟",
    name: "Declined",
  },
};

const findEmoji = (key) => emojiMap[key] || "";

const MoodTrends = ({ moodTrends, isLoading }) => {
  return (
    <div className="rounded-3xl px-5 py-4 bg-[#ebeafd]/40">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Mood Trends</h3>

      <div className="space-y-5">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center  min-h-48 h-full uppercase font-bold rounded-xl">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          Object.keys(moodTrends)?.length > 0 &&
          Object.entries(moodTrends)?.map(([key, value], index) => (
            <div
              key={index}
              className="flex items-center bg-white justify-between  !px-3 !py-2 rounded-3xl hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {findEmoji(key).emoji + " " + findEmoji(key).name}
                </span>
              </div>
              <div className={`text-2xl font-bold text-black`}>
                {value.toString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MoodTrends;

const snakeCaseToTitleCase = (str) => {
  return str.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};
