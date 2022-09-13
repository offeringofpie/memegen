import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';
import fetch from 'isomorphic-fetch';
import PImage from 'pureimage';
import Fuse from 'fuse.js';
import { Bitmap } from 'pureimage/types/bitmap';
import { PassThrough } from 'stream';

const FONT_PATH = 'fonts/impact.ttf';
const FONT_NAME = 'Source Sans Pro';
const FONT_SIZE = '48pt';

const OUTPUT_FILE_TYPE: 'jpeg' | 'png' = 'jpeg';

/**
 * Function to output Bitmap to a buffer using stream.PassThrough. The default
 * examples of pureimage use writeFile to persist images on disk. In a serverless
 * function we want to keep it in memory.
 */
const imageToBuffer = (
  image: Bitmap,
  type: string = 'jpeg'
): Promise<Buffer> => {
  return new Promise((resolve) => {
    const stream = new PassThrough();
    const imageData: Uint8Array[] = [];

    stream.on('data', (chunk) => {
      imageData.push(chunk);
    });

    stream.on('end', () => {
      resolve(Buffer.concat(imageData));
    });

    // @ts-ignore No overlap error from TypeScript
    if (type === 'png') {
      PImage.encodePNGToStream(image, stream);
      return;
    }

    PImage.encodeJPEGToStream(image, stream);
  });
};

const loadFont = (fontPath: string, fontName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    let font;

    // 3rd, 4th and 5th parameters are required by TypeScript...
    try {
      font = PImage.registerFont(fontPath, fontName, 400, 'normal', 'normal');
      font.load(() => {
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
};

const getMemeList = async () => {
  try {
    const response = await fetch('https://memes.jlopes.eu/memes.json')
      .then((res) => res.json())
      .then((data) => {
        return data.data.memes;
      });
    return response;
  } catch (err) {
    return err;
  }
};

const handler: Handler = async (
  { queryStringParameters }: HandlerEvent,
  context: HandlerContext
) => {
  const { name, text0, text1, text2, text3, text4 } =
    queryStringParameters as any;
  const memeList = await getMemeList();

  const result = new Fuse(memeList, {
    includeScore: true,
    minMatchCharLength: 3,
    threshold: 0.2,
    // Search in `author` and in `tags` array
    keys: ['name'],
  }).search(name);

  if (result.length) {
    const meme = result[0].item as any;

    const image = PImage.make(meme.width, meme.height, {});
    const ctx = image.getContext('2d');
    const fileType = meme.url.split('.').pop();
    const logo = await fetch(meme.url)
      .then((res) => res.body)
      .then((stream) => {
        return fileType === 'png'
          ? PImage.decodePNGFromStream(stream)
          : PImage.decodeJPEGFromStream(stream);
      });
    ctx.drawImage(logo, 0, 0, meme.width, meme.height);

    const hasText = text0 !== undefined && typeof text0 === 'string';

    if (hasText) {
      try {
        if (meme.font) {
          if (meme.font.family.includes('Arial')) {
            await loadFont('./public/fonts/arial.ttf', 'Arial');
          } else if (meme.font.family.includes('Comic')) {
            await loadFont('./public/fonts/comic.ttf', 'Comic Sans');
          } else {
            await loadFont('./public/fonts/impact.ttf', 'Impact');
          }
        } else {
          await loadFont('./public/fonts/impact.ttf', 'Impact');
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '48px Impact';

        if (meme.boxes) {
          let texts = [text0, text1, text2, text3, text4];
          meme.boxes.forEach((box: any, i: number) => {
            ctx.fillStyle = meme.color || '#FFFFFF';
            ctx.strokeStyle = meme.stroke || '#000000';

            let text = texts[i];

            if (typeof box.size !== 'undefined') {
              ctx.font = `${box.size}px ${meme.font.family}`;
            } else {
              ctx.font = `${meme.font.size}px ${meme.font.family}`;
            }

            if (text) {
              let lines = text.split('\n');

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
                let text = meme.uppercase ? line.toUpperCase() : line;
                const metrics = ctx.measureText(text);
                const fontHeight =
                  metrics.emHeightAscent + metrics.emHeightDescent;
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
                ctx.lineWidth = 2;
                ctx.strokeText(text, 0, 0);
                ctx.fillText(text, 0, 0);
                ctx.restore();
              });
            }
          });
        }
      } catch (err) {
        //
      }
    }

    const buffer = await imageToBuffer(image);

    return {
      statusCode: 200,
      headers: {
        'Content-Type':
          OUTPUT_FILE_TYPE === 'jpeg' ? 'image/jpeg' : 'image/png',
        // 'Cache-Control': 'public, max-age=604800, immutable', // 7 days
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true,
    };
  }

  return {
    statusCode: 200,
    body: 'Hello world!',
  };
};

export { handler };
