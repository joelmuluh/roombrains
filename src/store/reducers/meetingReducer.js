const initialState = {
  peer: null,
  intended_room: null,
  blocked_info: null,
};

export const meetingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_PEER":
      return { ...state, peer: action.payload };
    case "SAVE_INTENTED_ROOM":
      return { ...state, intended_room: action.payload };
    case "REMOVE_INTENTED_ROOM":
      return { ...state, intended_room: null };
    case "SET_BLOCKED_INFO":
      return { ...state, blocked_info: action.payload };
    case "CLEAR_BLOCKED_INFO":
      return { ...state, blocked_info: null };

    default:
      return state;
  }
};
