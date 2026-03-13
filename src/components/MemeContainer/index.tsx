import { useEffect, useRef, useSyncExternalStore } from 'react';
import store from '../../store';
import style from './style.module.css';

const MemeContainer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useSyncExternalStore(store.subscribe, store.getState);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    store.setState({ canvas });

    const image = new Image();
    image.crossOrigin = 'anonymous';
    let currMemeId = '';
    let animationFrameId: number;

    const render = () => {
      const state = store.getState();

      if (!state.meme) {
        animationFrameId = window.requestAnimationFrame(render);
        return;
      }

      if (currMemeId !== state.meme.id) {
        image.src = state.meme.url;
        currMemeId = state.meme.id;

        image.onload = () => {
          ctx.canvas.width = state.meme.width;
          ctx.canvas.height = state.meme.height;
        };
      }

      if (image.complete && image.naturalHeight !== 0) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.imageSmoothingEnabled = true;

        ctx.drawImage(
          image,
          0,
          0,
          state.meme.width,
          state.meme.height,
          0,
          0,
          ctx.canvas.width,
          ctx.canvas.height,
        );

        if (state.meme.boxes) {
          state.meme.boxes.forEach((box: any, i: number) => {
            ctx.fillStyle = state.meme.color || '#FFFFFF';
            ctx.strokeStyle = state.meme.stroke || '#000000';

            let fontStr = state.meme.font
              ? `${state.meme.font.size}px ${state.meme.font.family}`
              : '48px Anton';

            if (box.size) {
              fontStr = fontStr.replace(
                fontStr.split('px')[0],
                box.size.toString(),
              );
            }
            ctx.font = fontStr;

            const textValue = state[`text${i}`] || '';
            const lines = textValue.split('\n');

            if (lines.length > 1) {
              let fontSize = parseInt(ctx.font.split('px')[0]);
              ctx.font = ctx.font.replace(
                fontSize.toString(),
                `${Math.max(fontSize / 2, (fontSize * 2) / lines.length)}`,
              );
            }

            lines.forEach((line: string, lineIndex: number) => {
              let text = state.meme.uppercase ? line.toUpperCase() : line;
              const metrics = ctx.measureText(text);
              const fontHeight =
                metrics.actualBoundingBoxAscent +
                metrics.actualBoundingBoxDescent;

              ctx.fillStyle = box.color || ctx.fillStyle;
              ctx.strokeStyle = box.stroke || ctx.strokeStyle;

              ctx.save();
              ctx.translate(
                box.pos[0],
                box.pos[1] + (10 + fontHeight) * lineIndex - fontHeight / 2,
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

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      className={`max-w-full lg:max-w-2xl my-4 ${style.canvas}`}
      ref={canvasRef}
    />
  );
};

export default MemeContainer;
