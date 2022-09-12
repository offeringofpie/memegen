import { Handler } from "@netlify/functions";
import fetch from "isomorphic-fetch";
import Fuse from "fuse.js";
import { createCanvas, loadImage, registerFont } from "canvas";
registerFont("./fonts/impact.ttf", { family: "Impact" });

const getMemeList = async () => {
  try {
    const response = await fetch("https://memes.jlopes.eu/memes.json")
      .then((res) => res.json())
      .then((data) => {
        return data.data.memes;
      });
    return response;
  } catch (err) {
    return err;
  }
};

const handler: Handler = async (event, context) => {
  const { name, text0, text1, text2, text3, text4 } =
    event.queryStringParameters as any;

  const memeList = await getMemeList();

  const result = new Fuse(memeList, {
    includeScore: true,
    minMatchCharLength: 3,
    threshold: 0.2,
    // Search in `author` and in `tags` array
    keys: ["name"],
  }).search(name);

  if (result.length) {
    const meme = result[0].item;
    const canvas = createCanvas(meme.width, meme.height);
    const ctx = canvas.getContext("2d");

    await loadImage(meme.url).then((image) => {
      ctx.drawImage(image, 0, 0, meme.width, meme.height);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (meme.boxes) {
        meme.boxes.forEach((box: any, i: number) => {
          ctx.fillStyle = meme.color || "#FFFFFF";
          ctx.strokeStyle = meme.stroke || "#000000";
          ctx.font = meme.font
            ? `${meme.font.size}px ${meme.font.family}`
            : "48px Impact";
          if (box.size) {
            ctx.font = ctx.font.replace(ctx.font.split("px")[0], box.size);
          }

          let text;
          switch (i) {
            case 1:
              text = text1;
              break;
            case 2:
              text = text2;
              break;
            case 3:
              text = text3;
              break;
            case 4:
              text = text4;
              break;
            default:
              text = text0;
              break;
          }

          if (text) {
            let lines = text.split("\n");

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
              let text = meme.uppercase ? line.toUpperCase() : line;
              const metrics = ctx.measureText(text);
              const fontHeight =
                metrics.actualBoundingBoxAscent +
                metrics.actualBoundingBoxDescent;
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
          }
        });
      }
    });

    return {
      statusCode: 200,
      body: `<img src="${canvas.toDataURL()}" />`,
    };
  }

  // let image;
  // try {
  //   const result = await fetch(imgUrl, {
  //     headers: {
  //       Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
  //     },
  //   });
  //   image = await result.buffer();
  // } catch (error) {
  //   console.log("error", error);
  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify({
  //       error: error.message,
  //     }),
  //   };
  // }

  // return {
  //   statusCode: 200,
  //   headers: {
  //     "Content-type": "image/jpeg",
  //   },
  //   body: image.toString("base64"),
  //   isBase64Encoded: true,
  // };
};

export { handler };
