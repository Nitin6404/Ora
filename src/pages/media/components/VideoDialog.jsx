import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../../../components/ui/dialog";
import { X } from "lucide-react";

const VideoDialog = ({
  open,
  onClose,
  videoUrl,
  title = "Video Preview",
  aspectRatio = "aspect-video",
  autoPlay = true,
  controls = true,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-2xl backdrop-blur-sm">
        <DialogHeader className="absolute top-8 left-8 text-white z-10">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogClose
          onClick={onClose}
          className="absolute top-8 right-8 z-10 text-white hover:text-red-500"
        >
          <X className="w-6 h-6" />
        </DialogClose>
        <div
          className={`w-full ${aspectRatio} bg-black rounded-xl overflow-hidden`}
        >
          {videoUrl === "" ? (
            <div className="w-full h-full flex items-center justify-center">
              <p>No video found</p>
            </div>
          ) : (
            <video
              className="w-full h-full object-contain"
              src={videoUrl}
              autoPlay={autoPlay}
              controls={controls}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDialog;
