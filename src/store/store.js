import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { myRoomsReducer } from "./reducers/myRoomsReducer";
import { streamReducer } from "./reducers/streamsReducer";
import { userReducer } from "./reducers/userReducer";
import { meetingReducer } from "./reducers/meetingReducer";
const middleware = [thunk];
const rootReducer = combineReducers({
  user: userReducer,
  myRooms: myRoomsReducer,
  streams: streamReducer,
  meeting: meetingReducer,
});

export const store = createStore(
  rootReducer,
  {},
  applyMiddleware(...middleware)
);
