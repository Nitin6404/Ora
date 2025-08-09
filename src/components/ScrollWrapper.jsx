import React, { useRef } from "react";

const ScrollWrapper = ({
  children,
  direction = "horizontal",
  className = "",
}) => {
  const scrollRef = useRef(null);
  const isHorizontal = direction !== "vertical";

  let isDown = false;
  let startPos;
  let scrollStart;

  const handleMouseDown = (e) => {
    isDown = true;
    startPos = isHorizontal
      ? e.pageX - scrollRef.current.offsetLeft
      : e.pageY - scrollRef.current.offsetTop;

    scrollStart = isHorizontal
      ? scrollRef.current.scrollLeft
      : scrollRef.current.scrollTop;
  };

  const handleMouseLeave = () => {
    isDown = false;
  };

  const handleMouseUp = () => {
    isDown = false;
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const pos = isHorizontal
      ? e.pageX - scrollRef.current.offsetLeft
      : e.pageY - scrollRef.current.offsetTop;

    const walk = (pos - startPos) * 1.5;
    if (isHorizontal) {
      scrollRef.current.scrollLeft = scrollStart - walk;
    } else {
      scrollRef.current.scrollTop = scrollStart - walk;
    }
  };

  return (
    <div className={`rounded-3xl overflow-hidden bg-transparent ${className}`}>
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`cursor-grab active:cursor-grabbing no-scrollbar ${
          isHorizontal ? "overflow-x-auto" : "overflow-y-auto"
        }`}
        style={{
          WebkitOverflowScrolling: "touch",
          userSelect: "none",
          touchAction: isHorizontal ? "pan-x" : "pan-y",
          maxHeight: isHorizontal ? undefined : "100%",
          maxWidth: isHorizontal ? "100%" : undefined,
        }}
      >
        <div
          className={`${
            isHorizontal ? "flex space-x-4 p-2" : "flex flex-col space-y-4"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScrollWrapper;
