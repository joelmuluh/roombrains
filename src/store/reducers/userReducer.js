let user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState =
  user !== null
    ? user
    : { _id: null, username: null, email: null, token: null, image: null };

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_LOGIN":
      const { _id, username, token, email, image } = action.payload;
      return {
        ...state,
        _id,
        username,
        token,
        email,
        image,
      };
    case "USER_LOGOUT":
      localStorage.removeItem("user");
      return {};
    case "UPDATE_DETAIL":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
