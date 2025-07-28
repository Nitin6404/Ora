import { Play, Pause } from "lucide-react";

const PlayPauseIcon = ({ isPlaying, onClick }) => {
  return (
    <button onClick={onClick}>
      {isPlaying ? (
        <Pause className="w-5 h-5 text-blue-600 hover:cursor-pointer" />
      ) : (
        <Play className="w-5 h-5 text-green-600 hover:cursor-pointer" />
      )}
    </button>
  );
};

export default PlayPauseIcon;
