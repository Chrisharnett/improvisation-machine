// reducers.js
export const initialState = {
  gameState: null,
  isLoading: true,
  prompt: null,
  disableButtons: false,
  showJoinModal: false,
  showCreateModal: false,
  showPerformanceCodeRejectionModal: false,
  token: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case "SET_GAME_STATE":
      return { ...state, gameState: action.payload };
    case "SET_PROMPT":
      return { ...state, prompt: action.payload };
    case "SET_DISABLE_BUTTONS":
      return { ...state, disableButtons: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SHOW_JOIN_MODAL":
      return { ...state, showJoinModal: action.payload };
    case "SHOW_CREATE_MODAL":
      return { ...state, showCreateModal: action.payload };
    case "SHOW_PERFORMANCE_CODE_REJECTION_MODAL":
      return { ...state, showPerformanceCodeRejectionModal: action.payload };
    case "SET_TOKEN":
      return { ...state, token: action.payload };
    default:
      return state;
  }
}
