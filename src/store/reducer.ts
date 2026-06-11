import { produce } from 'immer';
import type { State, Action } from './types';

export const initialState: State = {
  listings: [],
  filter: '',
  loading: false,
  saved: [],
};

export function reducer(state: State, action: Action): State {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'SET_LISTINGS':
        draft.listings = action.payload;
        break;
      case 'SET_FILTER':
        draft.filter = action.payload;
        break;
      case 'SET_LOADING':
        draft.loading = action.payload;
        break;
      case 'TOGGLE_SAVED': {
        const id = action.payload;
        const index = draft.saved.indexOf(id);
        if (index === -1) draft.saved.push(id);
        else draft.saved.splice(index, 1);
        break;
      }
    }
  });
}