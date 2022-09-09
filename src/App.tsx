import { useState } from "react";

import MemeContainer from "./components/MemeContainer";
import reactLogo from "./assets/react.svg";
import distracted from "./public/distracted-boyfriend.jpg";
import "./App.css";

const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
  let image = new Image();
  image.src = distracted;

  image.onload = () => {
    let ratio = image.width / image.height;
    ctx.canvas.width = 1200;
    ctx.canvas.height = (image.height * 1200) / image.width;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#000000";
    ctx.font = "48px serif";
    ctx.fillText("Hello World", ctx.canvas.width / 2, 48);
    ctx.strokeText("Hello World", ctx.canvas.width / 2, 48);
    // ctx.beginPath();
    // ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 ** Math.PI);
    // ctx.fill();
  };
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MemeContainer draw={draw} />
    </>
  );
}

export default App;
