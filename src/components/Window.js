import React, { useState } from "react";
import { Rnd } from "react-rnd";

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0"
};

export default function Window() {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleDragStop = (e, d) => {
    setX(d.x);
    setY(d.y);
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    setWidth(ref.style.width);
    setHeight(ref.style.height);
    setX(position.x);
    setY(position.y);
  };

  return (
    <Rnd
      style={style}
      size={{ width, height }}
      position={{ x, y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
    >
      TEST
    </Rnd>
  );
}