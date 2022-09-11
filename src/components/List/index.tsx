import React from "react";
import store from "../../store";

const Canvas = (props: any) => {
  const { list, onChange, ...rest } = props;
  const state = store.getState();

  return (
    <div>
      <select
        onChange={onChange}
        defaultValue={state.meme.id}
        className="select select-primary w-full max-w-xs">
        <optgroup label="select a meme">
          {[...list]
            .sort((a: any, b: any) => {
              return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
            })
            .map((meme) => (
              <option key={meme.id} value={meme.id}>
                {meme.name}
              </option>
            ))}
        </optgroup>
      </select>
    </div>
  );
};

export default Canvas;
