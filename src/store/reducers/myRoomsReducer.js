const initialState = {
  myRooms: null,
};

export const myRoomsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FILL_ROOMS":
      return { myRooms: action.payload };
    case "ADD_ROOM":
      return { myRooms: [action.payload, ...state.myRooms] };
    case "DELETE_ROOM":
      const newRooms = state.myRooms.filter(
        (room) => room._id !== action.payload
      );
      return { myRooms: newRooms };
    case "DELETE_ALL_ROOMS":
      return { myRooms: null };
      return state;
    default:
      return state;
  }
};
