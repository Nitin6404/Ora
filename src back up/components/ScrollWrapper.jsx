import React, { useRef } from "react";

const ScrollWrapper = ({ children }) => {
  const scrollRef = useRef(null);
  let isDown = false;
  let startX;
  let scrollLeft;

  const handleMouseDown = (e) => {
    isDown = true;
    startX = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft = scrollRef.current.scrollLeft;
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
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
   <div
  className="rounded-3xl overflow-hidden bg-transparent"
  style={{ maxWidth: '100%' }}
>
  <div
    ref={scrollRef}
    onMouseDown={handleMouseDown}
    onMouseLeave={handleMouseLeave}
    onMouseUp={handleMouseUp}
    onMouseMove={handleMouseMove}
    className="cursor-grab active:cursor-grabbing overflow-x-auto no-scrollbar"
    style={{
      WebkitOverflowScrolling: "touch",
      userSelect: "none",
      touchAction: "pan-x",
    }}
  >
    <div className="flex space-x-4 ">{children}</div>
  </div>
</div>

  );
};

export default ScrollWrapper;
