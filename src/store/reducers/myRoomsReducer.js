const initialState = {
  myRooms: null,
  blockedUsers: [],
  blocked_users_id: [],
};

export const myRoomsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FILL_ROOMS":
      return { ...state, myRooms: action.payload };
    case "ADD_ROOM":
      return { ...state, myRooms: [action.payload, ...state.myRooms] };
    case "DELETE_ROOM":
      const newRooms = state.myRooms.filter(
        (room) => room._id !== action.payload
      );
      return { ...state, myRooms: newRooms };
    case "DELETE_ALL_ROOMS":
      return { ...state, myRooms: null };
    case "BLOCKED_USERS_ID":
      return { ...state, blocked_users_id: action.payload };
    case "FILL_BLOCK":
      return { ...state, blockedUsers: action.payload };
    case "BLOCK_USER":
      const user = state.blockedUsers.find(
        (user) =>
          user._id === action.payload._id &&
          user.conversationId === action.payload.conversationId
      );
      if (!user) {
        return {
          ...state,
          blockedUsers: [action.payload, ...state.blockedUsers],
        };
      } else return state;

    case "UNBLOCK_USER":
      const newList = state.blockedUsers.filter(
        (user) =>
          user._id !== action.payload._id &&
          user.conversationId === action.payload.conversationId
      );
      return { ...state, blockedUsers: newList };
    default:
      return state;
  }
};
