import React from "react";
import store from "../../store";

const Buttons = (props: any) => {
  const state = store.getState();
  const onDownload = (event: any) => {
    if (state.canvas) {
      const url = state.canvas.toDataURL("image/jpeg", 0.7);
      const link = document.createElement("a");
      link.download = state.meme.name
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9 -]/g, "")
        .toLowerCase();
      link.href = url;
      link.click();
    }
  };
  const onUpload = (event: any) => {
    if (state.canvas) {
      const url = state.canvas.toDataURL("image/jpeg", 0.7);
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Client-ID ${import.meta.env.VITE_CLIENT_ID}`
      );

      const formdata = new FormData();
      formdata.append("image", url);

      const requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      fetch("https://api.imgur.com/3/image", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    }
  };
  return (
    <div className="btn-group">
      <button onClick={onDownload} className="btn btn-outline btn-primary">
        Download
      </button>
      <button onClick={onUpload} className="btn btn-outline btn-secondary">
        Upload to Imgur
      </button>
    </div>
  );
};

export default Buttons;
