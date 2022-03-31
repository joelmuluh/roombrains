const initialState = {
  peer: null,
};

export const meetingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_PEER":
      return { ...state, peer: action.payload };
    default:
      return state;
  }
};
