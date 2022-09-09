import { useState } from 'react';
import store from './store';
import memeList from './memes.json';

import MemeContainer from './components/MemeContainer';
import List from './components/List';
import TextBoxes from './components/TextBoxes';

import './App.css';

const draw = (ctx: CanvasRenderingContext2D) => {
  let image = new Image();
  const state = store.getState();

  if (state) {
    image.src = state.meme.url;

    image.onload = () => {
      ctx.canvas.width = state.meme.width;
      ctx.canvas.height = state.meme.height;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (state.meme.boxes) {
        state.meme.boxes.forEach((box: any, i: number) => {
          ctx.fillStyle = state.meme.color || '#FFFFFF';
          ctx.strokeStyle = state.meme.stroke || '#000000';
          ctx.font = state.meme.font
            ? `${state.meme.font.size}px ${state.meme.font.family}`
            : '48px Anton';
          if (box.size) {
            ctx.font = ctx.font.replace(ctx.font.split('px')[0], box.size);
          }
          let lines = state[`text${i}`].split('\n');
          if (lines.length > 1) {
            let fontSize = ctx.font.split('px')[0];
            ctx.font = ctx.font.replace(
              fontSize,
              `${Math.max(
                parseInt(fontSize) / 2,
                (parseInt(fontSize) * 2) / lines.length
              )}`
            );
          }
          lines.forEach((line: string, i: number) => {
            const metrics = ctx.measureText(line);
            const fontHeight =
              metrics.actualBoundingBoxAscent +
              metrics.actualBoundingBoxDescent;
            ctx.save();
            ctx.translate(
              box.pos[0],
              box.pos[1] + (10 + fontHeight) * i - fontHeight / 2
            );
            if (box.angle) {
              ctx.rotate((box.angle * Math.PI) / 180);
            }
            ctx.fillText(line, 0, 0);
            ctx.strokeText(line, 0, 0);
            ctx.restore();
          });
        });
      }
    };
  }
};

function App() {
  const [state, setState] = useState(store.getState());

  store.addListener((state: any) => {
    setState(state);
  });

  const onChange = (ev: any) => {
    const selectedMeme = memeList.data.memes.find((meme) => {
      if (ev.target?.value) {
        return meme.id == ev.target.value;
      }
    });
    store.setState({ meme: selectedMeme });
    setState(selectedMeme);
  };

  return (
    <>
      <List list={memeList.data.memes} onChange={onChange} />
      <TextBoxes boxes={state.meme?.boxes} />
      <MemeContainer draw={draw} />
    </>
  );
}

export default App;
