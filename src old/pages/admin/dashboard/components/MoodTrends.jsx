const MoodTrends = () => {
  const moodData = [
    { label: "Improved", count: 13, emoji: "😊", color: "text-green-600" },
    { label: "No change", count: 2, emoji: "😐", color: "text-yellow-600" },
    { label: "Declined", count: 1, emoji: "😟", color: "text-red-600" },
  ];

  return (
    <div className="rounded-3xl px-5 py-4 bg-[#ebeafd]/40">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Trends</h3>

      <div className="space-y-5">
        {moodData.map((mood, index) => (
          <div
            key={index}
            className="flex items-center bg-white justify-between  !px-3 !py-2 rounded-3xl hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-sm text-gray-700">{mood.label}</span>
            </div>
            <div className={`text-2xl font-bold text-black`}>
              {mood.count.toString().padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodTrends;