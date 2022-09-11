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

const store = new Store({
  meme: memeList.data.memes[
    Math.floor(Math.random() * memeList.data.memes.length)
  ],
  text0: "text 0",
  text1: "text 1",
  text2: "text 2",
  text3: "text 3",
  text4: "text 4",
});
export default store;
