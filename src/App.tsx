import { useSyncExternalStore } from 'react';
import store from './store';
import memeList from './memes.json';

import MemeContainer from './components/MemeContainer';
import List from './components/List';
import TextBoxes from './components/TextBoxes';
import Buttons from './components/Buttons';

import './App.css';

function App() {
  const state = useSyncExternalStore(store.subscribe, store.getState);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans text-slate-300">
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 relative">
        <List list={memeList.data.memes} />
        <MemeContainer />
        <Buttons />
      </main>

      <aside className="w-full lg:w-96 bg-surface p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-border z-10 flex flex-col relative overflow-hidden">
        <h2 className="text-xs font-bold tracking-[0.25em] uppercase mb-6 text-cyan border-b border-border pb-4 drop-shadow-[0_0_5px_rgba(66,168,179,0.4)]">
          Edit text
        </h2>

        <TextBoxes boxes={state.meme?.boxes} />
      </aside>
    </div>
  );
}

export default App;
