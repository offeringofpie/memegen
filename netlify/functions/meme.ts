import { Handler } from "@netlify/functions";
import fetch from "isomorphic-fetch";

let imgUrl = "https://cdn.jlopes.eu/memes/21tqf4.jpg";

const handler: Handler = async (event, context) => {
  const { fileURL } = event.queryStringParameters;

  let image;
  try {
    const result = await fetch(imgUrl, {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
    });
    image = await result.buffer();
  } catch (error) {
    console.log("error", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-type": "image/jpeg",
    },
    body: image.toString("base64"),
    isBase64Encoded: true,
  };
};

export { handler };
