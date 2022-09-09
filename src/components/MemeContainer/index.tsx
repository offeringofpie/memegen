import React from "react";
import useCanvas from "./useCanvas";
import style from "./style.module.css";

const Canvas = (props: any) => {
  const { draw, ...rest } = props;
  const canvasRef = useCanvas(draw);

  return <canvas ref={canvasRef} {...rest} />;
};

export default Canvas;
