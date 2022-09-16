import React from "react";
import useCanvas from "./useCanvas";
import store from "../../store";

import style from "./style.module.css";

const state = store.getState();
const image = new Image();
let currMeme = state.meme;

const draw = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.imageSmoothingEnabled = true;
  image.crossOrigin = "anonymous";

  if (state) {
    if (!image.src) {
      image.src = state.meme.url;
    }
    if (state.meme !== currMeme) {
      image.src = state.meme.url;
      currMeme = state.meme;
    }

    image.onload = () => {
      ctx.canvas.width = state.meme.width;
      ctx.canvas.height = state.meme.height;
    };
    ctx.drawImage(
      image,
      0,
      0,
      state.meme.width,
      state.meme.height,
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
    if (state.meme.boxes) {
      state.meme.boxes.forEach((box: any, i: number) => {
        ctx.fillStyle = state.meme.color || "#FFFFFF";
        ctx.strokeStyle = state.meme.stroke || "#000000";
        ctx.font = state.meme.font
          ? `${state.meme.font.size}px ${state.meme.font.family}`
          : "48px Anton";
        if (box.size) {
          ctx.font = ctx.font.replace(ctx.font.split("px")[0], box.size);
        }
        let lines = state[`text${i}`].split("\n");
        if (lines.length > 1) {
          let fontSize = ctx.font.split("px")[0];
          ctx.font = ctx.font.replace(
            fontSize,
            `${Math.max(
              parseInt(fontSize) / 2,
              (parseInt(fontSize) * 2) / lines.length
            )}`
          );
        }
        lines.forEach((line: string, i: number) => {
          let text = state.meme.uppercase ? line.toUpperCase() : line;
          const metrics = ctx.measureText(text);
          const fontHeight =
            metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
          ctx.fillStyle = box.color || ctx.fillStyle;
          ctx.strokeStyle = box.stroke || ctx.strokeStyle;
          ctx.save();
          ctx.translate(
            box.pos[0],
            box.pos[1] + (10 + fontHeight) * i - fontHeight / 2
          );
          if (box.angle) {
            ctx.rotate((box.angle * Math.PI) / 180);
          }

          ctx.shadowColor = ctx.strokeStyle as string;
          ctx.shadowBlur = 5;
          ctx.lineWidth = 2;
          ctx.strokeText(text, 0, 0);
          ctx.shadowBlur = 0;
          ctx.fillText(text, 0, 0);
          ctx.restore();
        });
      });
    }
  }
};

const Canvas = (props: any) => {
  const { ...rest } = props;
  const canvasRef = useCanvas(draw);

  return (
    <canvas
      className={`max-w-full lg:max-w-max-w-2xl my-4 ${style.canvas}`}
      ref={canvasRef}
      {...rest}
    />
  );
};

export default Canvas;
