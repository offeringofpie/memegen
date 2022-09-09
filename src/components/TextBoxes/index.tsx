import React, { useState } from 'react';
import store from '../../store';

const TextBoxes = (props: any) => {
  const storeState = store.getState();
  const [state, setState] = useState(storeState);
  store.addListener((storeState: any) => {
    setState(storeState);
  });

  const onChange = (ev: any) => {
    store.setState({
      [ev.target.id]: ev.target.value.replace(/\n/g, '\n'),
    });
  };

  return (
    <div>
      {state.meme.boxes.map((k: any, i: number) => (
        <textarea
          name="first"
          key={i}
          id={`text${i}`}
          cols={20}
          rows={3}
          defaultValue={state[`text${i}`]}
          onChange={onChange}
        ></textarea>
      ))}
    </div>
  );
};

export default TextBoxes;
