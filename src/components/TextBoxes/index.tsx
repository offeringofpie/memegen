import { useSyncExternalStore } from 'react';
import store from '../../store';

const TextBoxes = ({ boxes }: { boxes?: any[] }) => {
  const state = useSyncExternalStore(store.subscribe, store.getState);

  const onChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    store.setState({ [ev.target.id]: ev.target.value });
  };

  if (!boxes) return null;

  return (
    <div className="flex flex-col gap-4">
      {boxes.map((_, i) => (
        <div key={i} className="flex flex-col">
          <label
            htmlFor={`text${i}`}
            className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2"
          >
            Text Block {i + 1}
          </label>
          <textarea
            id={`text${i}`}
            cols={20}
            rows={3}
            value={state[`text${i}`] || ''}
            placeholder={`Type here...`}
            className="w-full bg-surface-inset border-slate-800 rounded-lg px-4 py-3 text-border placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-coral focus:text-coral focus:border-transparent resize-none transition-all shadow-inner"
            onChange={onChange}
          ></textarea>
        </div>
      ))}
    </div>
  );
};

export default TextBoxes;
