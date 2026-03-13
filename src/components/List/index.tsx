import { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import store, { Meme } from '../../store';

interface ListProps {
  list: Meme[];
}

const List = ({ list }: ListProps) => {
  const state = useSyncExternalStore(store.subscribe, store.getState);

  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortedList = [...list].sort((a, b) => a.name.localeCompare(b.name));

  const filteredList = sortedList.filter((meme) =>
    meme.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (meme: Meme) => {
    store.setState({ meme, meme_id: meme.id });
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-lg mb-6" ref={dropdownRef}>
      <input
        type="text"
        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
        placeholder="Search a meme..."
        value={isOpen ? searchTerm : state.meme?.name || ''}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          if (!isOpen) setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && (
        <ul className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden">
          {filteredList.length > 0 ? (
            filteredList.map((meme) => (
              <li key={meme.id}>
                <button
                  type="button"
                  className={`w-full text-left px-5 py-3 transition-colors ${
                    state.meme?.id === meme.id
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                      : 'hover:bg-slate-700 text-slate-300'
                  }`}
                  onClick={() => handleSelect(meme)}
                >
                  {meme.name}
                </button>
              </li>
            ))
          ) : (
            <li className="px-5 py-3 text-sm text-slate-500 pointer-events-none">
              No memes found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default List;
