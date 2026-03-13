import { useSyncExternalStore } from 'react';
import store from './store';
import memeList from './memes.json';

import MemeContainer from './components/MemeContainer';
import List from './components/List';
import TextBoxes from './components/TextBoxes';
import Buttons from './components/Buttons';

function App() {
  const state = useSyncExternalStore(store.subscribe, store.getState);
  const boxCount = state.meme?.box_count || 0;
  const boxes = Array.from({ length: boxCount });

  return (
    <div className="min-h-screen bg-bg flex flex-col lg:flex-row font-sans text-cyan">
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden">
        <h1 className="sr-only">Meme Generator</h1>
        <MemeContainer />
      </main>

      <aside className="w-full lg:w-100 xl:w-120 bg-surface border-t lg:border-t-0 lg:border-l border-border p-6 sm:p-8 overflow-y-auto flex flex-col gap-8 shadow-2xl">
        <header>
          <h2 className="text-xl text-coral font-bold mb-1">MEME EDITOR</h2>
          <p className="text-sm text-cyan">
            Search for a meme and add your text!
          </p>
        </header>

        <section aria-label="Template selection">
          <List list={memeList.data.memes} />
        </section>

        <section aria-label="Text inputs">
          <TextBoxes boxes={boxes} />
        </section>

        <div className="mt-auto pt-4">
          <Buttons />
        </div>
      </aside>
    </div>
  );
}

export default App;
