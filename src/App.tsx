import { useState } from "react";
import store from "./store";
import memeList from "./memes.json";

import MemeContainer from "./components/MemeContainer";
import List from "./components/List";
import TextBoxes from "./components/TextBoxes";
import Buttons from "./components/Buttons";

import "./App.css";

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
    store.setState({ meme: selectedMeme, meme_id: ev.target.value });
    setState(selectedMeme);
  };

  return (
    <>
      <div className="drawer drawer-mobile">
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          <label
            htmlFor="drawer"
            className="btn btn-circle btn-ghost drawer-button text-xl lg:hidden absolute top-2 left-2 z-40">
            &#9778;
          </label>
          <List list={memeList.data.memes} onChange={onChange} />
          <MemeContainer />
          <Buttons />
        </div>
        <div className="drawer-side">
          <label htmlFor="drawer" className="drawer-overlay"></label>
          <div className="menu p-4 overflow-y-auto w-80 bg-neutral-focus text-base-content relative">
            <label
              htmlFor="drawer"
              className="btn btn-circle btn-ghost drawer-button lg:hidden text-lg absolute top-2 right-2 z-40">
              &times;
            </label>
            <TextBoxes boxes={state.meme?.boxes} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
