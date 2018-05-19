import types from 'core/types';

const initialState = {
  recording: null,
  list: [],
  count: 0,
  transcription: '',
  sentiment: ''
};

export function audioReducer(state = initialState, action) {
  switch (action.type) {
  case types.SAVE_RECORDING: {
    const newList = state.list.slice();
    newList.splice(0, 0, action.recording);

    return Object.assign({}, state, {
      recording: action.recording,
      list: newList,
      count: state.count + 1
    });
  }

  case types.GET_ALL_RECORDINGS: {
    return Object.assign({}, state, {
      list: action.list
    });
  }

  case types.GET_AUDIO_INFO: {
    return Object.assign({}, state, {
      transcription: action.analysis.transcription,
      sentiment: action.analysis.sentiment
    });
  }

  default:
    return state;
  }
}
