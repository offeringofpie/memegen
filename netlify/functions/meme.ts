import { Handler } from "@netlify/functions";
import fetch from "isomorphic-fetch";

let imgUrl = "https://cdn.jlopes.eu/memes/21tqf4.jpg";

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
  const { name } = event.queryStringParameters;

  const memeList = await getMemeList();

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
