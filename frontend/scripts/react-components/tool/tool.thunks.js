import { displayStoryModal, loadDisclaimer, resize } from 'actions/app.actions';
import { GET_COLUMNS, loadMapVectorData, loadNodes, loadLinks } from 'scripts/actions/tool.actions';
import {
  GET_COLUMNS_URL,
  GET_ALL_NODES_URL,
  getURLFromParams
} from 'scripts/utils/getURLFromParams';

// TODO: custom container prevents from optimizing this
// currently we need to load initial data every time we enter the page
// the implementation of the vanilla redux container doesn't pass existing props to the sankey
// passes callbacks that after execution assign values to local variables

export const loadDisclaimerTool = dispatch => dispatch(loadDisclaimer());

export const resizeSankeyTool = dispatch => dispatch(resize());

export const loadStoryModalTool = (dispatch, getState) => {
  const { query = {} } = getState().location;
  return query.story && dispatch(displayStoryModal(query.story));
};

export const loadToolInitialData = (dispatch, getState) => {
  const state = getState();

  if (!state.app.selectedContextId) {
    return;
  }

  const params = {
    context_id: state.app.selectedContextId
  };
  const allNodesURL = getURLFromParams(GET_ALL_NODES_URL, params);
  const columnsURL = getURLFromParams(GET_COLUMNS_URL, params);
  const promises = [allNodesURL, columnsURL].map(url => fetch(url).then(resp => resp.text()));

  Promise.all(promises).then(payload => {
    // TODO do not wait for end of all promises/use another .all call
    dispatch({
      type: GET_COLUMNS,
      payload: payload.slice(0, 2)
    });

    dispatch(loadLinks());
    dispatch(loadNodes());
    dispatch(loadMapVectorData());
  });
};
