import memeList from './memes.json';

export interface Meme {
  id: string | number;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
  uppercase?: boolean;
  color?: string;
  stroke?: string;
  font?: { size: number; family: string };
  boxes?: {
    pos: number[];
    size?: number;
    angle?: number | string;
    color?: string;
    stroke?: string;
  }[];
}

export interface AppState {
  meme_id: string | number;
  meme: Meme;
  canvas?: HTMLCanvasElement;
  [key: string]: any;
}

class Store {
  private state: AppState;
  private listeners: Set<() => void> = new Set();

  constructor(initialState: AppState) {
    this.state = initialState;
  }

  setState = (newState: Partial<AppState>) => {
    this.state = { ...this.state, ...newState };

    for (const key in newState) {
      if (key.startsWith('text') || key === 'meme_id') {
        localStorage.setItem(key, String(newState[key]));
      }
    }
    this.notify();
  };

  getState = () => this.state;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

const findMeme = (id: string | number | null) =>
  memeList.data.memes.find((m) => String(m.id) === String(id));

const defaultId =
  localStorage.getItem('meme_id') ||
  memeList.data.memes[Math.floor(Math.random() * memeList.data.memes.length)]
    .id;
const defaultMeme = findMeme(defaultId) || memeList.data.memes[0];

const store = new Store({
  meme_id: defaultId,
  meme: defaultMeme as Meme,
  text0: localStorage.getItem('text0') || 'text 0',
  text1: localStorage.getItem('text1') || 'text 1',
  text2: localStorage.getItem('text2') || 'text 2',
  text3: localStorage.getItem('text3') || 'text 3',
  text4: localStorage.getItem('text4') || 'text 4',
});

export default store;
