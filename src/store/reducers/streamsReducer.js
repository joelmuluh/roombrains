import { io } from "socket.io-client";

const initialState = {
  streaming: false,
  streams: [],
  streamers: [],
  callHandlers: [],
  screenStream: {
    screening: false,
    stream: null,
  },
  socket: io(`${process.env.REACT_APP_API}`, {
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
  }),
};

export const streamReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_LOGOUT":
      return {
        ...state,
        streams: [],
        streamers: [],
        callHandlers: [],
        streaming: false,
      };

    case "START_STREAMING":
      return { ...state, streaming: true };
    case "STOP_STREAMING":
      return { ...state, streaming: false };
    case "ADD_STREAM":
      const streamExists = state.streams.some(
        (stream) => stream._id === action.payload._id
      );
      if (streamExists) return state;
      return {
        ...state,
        streams: [...state.streams, action.payload],
      };
    case "REMOVE_STREAM":
      const myStream = state.streams.find(
        (stream) => stream._id === action.payload._id
      );
      if (myStream) {
        myStream?.stream?.getTracks().forEach((track) => {
          track.stop();
        });

        const newStreams = state.streams.filter(
          (stream) => stream._id !== action.payload._id
        );
        return { ...state, streams: newStreams };
      } else {
        return state;
      }

    case "ADD_STREAMER":
      const streamer1 = state.streamers.includes(action.payload._id);
      if (!streamer1) {
        return {
          ...state,
          streamers: [...state.streamers, action.payload._id],
        };
      } else return state;
    case "REMOVE_STREAMER":
      const streamer2 = state.streamers.includes(action.payload._id);
      if (streamer2) {
        const newStreamers = state.streamers.filter(
          (streamer) => streamer !== action.payload._id
        );
        return {
          ...state,
          streamers: newStreamers,
        };
      } else return state;
    case "ADD_CALL_HANDLER":
      return {
        ...state,
        callHandlers: [...state.callHandlers, action.payload],
      };
    case "REMOVE_CALL_HANDLER":
      const newHandlers = state.callHandlers.filter(
        (handler) => handler._id !== action.payload._id
      );
      return { ...state, callHandlers: newHandlers };
    case "START_SCREEN_STREAM":
      if (!state.screenStream.screening) {
        return {
          ...state,
          screenStream: { screening: true, stream: action.payload },
        };
      } else return state;
    case "STOP_SCREEN_STREAM":
      if (state.screenStream.screening) {
        state?.screenStream?.stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      return {
        ...state,
        screenStream: { screening: false, stream: null },
      };

    case "MUTE_USER":
      const userStream1 = state.streams.find(
        (stream) => stream._id === action.payload._id
      );
      userStream1.stream.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.enabled = false;
        }
      });

      return state;
    case "UNMUTE_USER":
      const userStream2 = state.streams.find(
        (stream) => stream._id === action.payload._id
      );
      userStream2.stream.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.enabled = true;
        }
      });

      return state;
    case "ENABLE_VIDEO":
      const VideostreamOne = state.streams.find(
        (stream) => stream._id === action.payload._id
      );
      VideostreamOne.stream.getTracks().forEach((track) => {
        if (track.kind === "video") {
          track.enabled = true;
        }
      });
      return state;
    case "DISABLE_VIDEO":
      const VideostreamTwo = state.streams.find(
        (stream) => stream._id === action.payload._id
      );
      VideostreamTwo.stream.getTracks().forEach((track) => {
        if (track.kind === "video") {
          track.enabled = false;
        }
      });
      return state;
    case "RESET_STATE":
      const streamReset = state.streams;
      if (streamReset.length > 0) {
        streamReset.forEach((stream) => {
          stream?.stream?.getTracks().forEach((track) => {
            track.stop();
          });
        });
      }
      if (state.screenStream.screening) {
        state?.screenStream?.stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      return {
        ...state,
        streams: [],
        streamers: [],
        streaming: false,
        callHandlers: [],
        screenStream: {
          screening: false,
          stream: null,
        },
      };
    default:
      return state;
  }
};
