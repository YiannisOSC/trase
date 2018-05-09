import { SET_TOOLTIPS, SET_CONTEXTS, selectInitialContextById } from 'scripts/actions/app.actions';
import {
  GET_TOOLTIPS_URL,
  getURLFromParams,
  GET_CONTEXTS_URL
} from 'scripts/utils/getURLFromParams';
import { getDefaultContext } from 'scripts/reducers/helpers/contextHelper';

function loadTooltipsPromise(dispatch, getState) {
  const { app } = getState();
  // we use forceReload to force state rehydration
  if (app.tooltips !== null) {
    return Promise.resolve();
  }

  const tooltipsURL = getURLFromParams(GET_TOOLTIPS_URL);

  return new Promise(resolve =>
    fetch(tooltipsURL)
      .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then(data => {
        dispatch({
          type: SET_TOOLTIPS,
          payload: data
        });
      })
      .then(() => resolve())
  );
}

function loadContextsPromise(dispatch, getState) {
  const state = getState();

  // Contexts should only load once
  if (state.app.contexts.length > 0) {
    return Promise.resolve();
  }

  const sortContexts = (a, b) => {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  };

  const contextURL = getURLFromParams(GET_CONTEXTS_URL);

  return new Promise(resolve =>
    fetch(contextURL)
      .then(resp => resp.text())
      .then(data => {
        const contexts = JSON.parse(data).data.sort(sortContexts);

        dispatch({
          type: SET_CONTEXTS,
          payload: contexts
        });

        const defaultContext = getDefaultContext(getState());

        dispatch(selectInitialContextById(defaultContext.id));
      })
      .then(() => resolve())
  );
}

export const loadBaseAppData = (dispatch, getState) =>
  Promise.all([loadTooltipsPromise(dispatch, getState), loadContextsPromise(dispatch, getState)]);
