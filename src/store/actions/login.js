export const login = (_id, username, email, token, image) => (dispatch) => {
  localStorage.setItem(
    "user",
    JSON.stringify({ _id, username, email, token, image })
  );
  dispatch({
    type: "USER_LOGIN",
    payload: {
      _id,
      username,
      email,
      token,
      image,
    },
  });
};
