import types from 'core/types';

/**
 * saveRecording - Save an audio file
 */
export function saveRecording(recording) {
  return (dispatch, getState) => {
    const { count } = getState().audio;

    recording.title = `My recording #${count + 1}`;

    dispatch(
      (() => {
        return {
          type: type.SAVE.RECORDING,
          recording: recording
        };
      })()
    );
  };
}
