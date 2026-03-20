import { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import store, { Meme } from '../store';

interface ListProps {
  list: Meme[];
}

const fuzzySearch = (needle: string, haystack: string) => {
  const hlen = haystack.length;
  const nlen = needle.length;
  if (nlen > hlen) return false;
  if (nlen === 0) return true;

  const needleLower = needle.toLowerCase();
  const haystackLower = haystack.toLowerCase();
  let j = 0;

  for (let i = 0; i < nlen; i++) {
    j = haystackLower.indexOf(needleLower[i], j);
    if (j === -1) return false;
    j++;
  }
  return true;
};

const List = ({ list }: ListProps) => {
  const state = useSyncExternalStore(store.subscribe, store.getState);

  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const sortedList = [...list].sort((a, b) => a.name.localeCompare(b.name));

  const filteredList = sortedList.filter((meme) =>
    fuzzySearch(searchTerm, meme.name),
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

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm, isOpen]);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (meme: Meme) => {
    store.setState({ meme, meme_id: meme.id });
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setIsOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredList.length - 1 ? prev + 1 : prev,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredList[highlightedIndex]) {
          handleSelect(filteredList[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  return (
    <div className="relative w-full max-w-lg mb-6" ref={dropdownRef}>
      <input
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="meme-listbox"
        aria-activedescendant={
          highlightedIndex >= 0
            ? `meme-option-${filteredList[highlightedIndex]?.id}`
            : undefined
        }
        className="w-full bg-border border border-border rounded-xl px-5 py-3 text-cyan placeholder-coral focus:outline-none focus:ring-2 focus:bg-bg focus:ring-coral focus:text-coral focus:border-transparent shadow-sm transition-all pr-12 cursor-pointer"
        placeholder="Search a meme..."
        value={isOpen ? searchTerm : state.meme?.name || ''}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          if (!isOpen) setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-coral' : 'text-cyan'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>

      {isOpen && (
        <ul
          id="meme-listbox"
          role="listbox"
          ref={listRef}
          className="absolute z-50 w-full mt-2 bg-border border border-bg rounded-xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden"
        >
          {filteredList.length > 0 ? (
            filteredList.map((meme, index) => (
              <li
                key={meme.id}
                id={`meme-option-${meme.id}`}
                role="option"
                aria-selected={
                  state.meme?.id === meme.id || highlightedIndex === index
                }
                className={`w-full text-left px-5 py-3 transition-colors cursor-pointer ${
                  state.meme?.id === meme.id
                    ? 'bg-cyan text-bg'
                    : highlightedIndex === index
                      ? 'bg-slate-600 text-bg'
                      : 'hover:bg-bg text-coral'
                }`}
                onClick={() => handleSelect(meme)}
              >
                {meme.name}
              </li>
            ))
          ) : (
            <li
              className="px-5 py-3 text-sm text-slate-500 pointer-events-none"
              role="option"
              aria-selected="false"
            >
              No memes found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default List;
