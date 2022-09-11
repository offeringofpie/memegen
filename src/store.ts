import memeList from "./memes.json";

class Store {
  state: any;
  listeners: any[];

  constructor(initialState: any) {
    this.state = initialState;

    this.listeners = [];
  }

  setState(state: any) {
    for (let key in state) {
      this.state[key] = state[key];
      localStorage.setItem(key, state[key]);
    }

    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  getState() {
    return this.state;
  }

  addListener(listener: any) {
    this.listeners.push(listener);
  }
}

const findMeme = (id: any) => {
  return memeList.data.memes.find((meme) => {
    return meme.id === id;
  });
};

const store = new Store({});

store.setState({
  meme_id: localStorage.getItem("meme_id")
    ? localStorage.getItem("meme_id")
    : Math.floor(Math.random() * memeList.data.memes.length),
  meme: findMeme(localStorage.getItem("meme_id"))
    ? findMeme(localStorage.getItem("meme_id"))
    : memeList.data.memes[
        Math.floor(Math.random() * memeList.data.memes.length)
      ],
  text0: localStorage.getItem("text0")
    ? localStorage.getItem("text0")
    : "text 0",
  text1: localStorage.getItem("text1")
    ? localStorage.getItem("text1")
    : "text 1",
  text2: localStorage.getItem("text2")
    ? localStorage.getItem("text2")
    : "text 2",
  text3: localStorage.getItem("text3")
    ? localStorage.getItem("text3")
    : "text 3",
  text4: localStorage.getItem("text4")
    ? localStorage.getItem("text4")
    : "text 4",
});
export default store;
