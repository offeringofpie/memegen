import { useState } from 'react';
import store from '../../store';

const Buttons = () => {
  const [copied, setCopied] = useState(false);

  const onDownload = () => {
    const state = store.getState();
    if (state.canvas && state.meme) {
      const url = state.canvas.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.download =
        state.meme.name
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9 -]/g, '')
          .toLowerCase() + '-meme.jpg';
      link.href = url;
      link.click();
    }
  };

  const onCopy = () => {
    const state = store.getState();
    if (!state.canvas) return;

    state.canvas.toBlob(async (blob) => {
      if (blob) {
        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);

          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (error) {}
      }
    }, 'image/png');
  };

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-10">
      <button
        onClick={onDownload}
        className="px-8 py-3 border rounded-xl font-bold uppercase tracking-widest text-sm bg-cyan text-slate-900 hover:bg-transparent hover:border-cyan hover:text-cyan transition-all cursor-pointer"
      >
        Download
      </button>

      <button
        onClick={onCopy}
        className={`px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all cursor-pointer border
          ${
            copied
              ? 'bg-coral text-slate-900 border-coral'
              : 'bg-surface-inset border-border text-border hover:text-coral hover:border-coral active:translate-y-px'
          }
        `}
      >
        {copied ? 'Copied!' : 'Copy Image'}
      </button>
    </div>
  );
};

export default Buttons;
