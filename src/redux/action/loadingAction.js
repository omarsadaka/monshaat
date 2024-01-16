export function commonLoader(value) {
  return dispatch => {
    dispatch({ type: 'COMMON_LOADER', value: value });
  };
}
export function standadLoader(value) {
  return dispatch => {
    dispatch({ type: 'STAND_LOADER', value: value });
  };
}
