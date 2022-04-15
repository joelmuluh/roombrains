import { io } from "socket.io-client";

const initialState = {
  streaming: [
    {
      conversationId: null,
      value: false,
    },
  ],
  streams: [],
  streamers: [],
  socket: io(`${process.env.REACT_APP_API}`, {
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
  }),
  callHandlers: [],
};

export const streamReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_STREAM":
      const streamExists = state.streams.some(
        (stream) => stream._id === action.payload._id
      );
      if (streamExists) return state;
      return {
        ...state,
        streams: [...state.streams, action.payload],
      };
    case "ADD_CALL_HANDLER":
      return {
        ...state,
        callHandlers: [
          ...state.callHandlers,
          {
            conversationId: action.payload.conversationId,
            call: action.payload.call,
          },
        ],
      };
    case "REMOVE_CALL_HANDLER":
      const newHandlers = state.callHandlers.filter(
        (x) =>
          x._id !== action.payload.id &&
          x.conversationId === action.payload.conversationId
      );
      return { ...state, callHandlers: newHandlers };

    case "REMOVE_STREAM":
      const myStream = state.streams.find(
        (stream) =>
          stream._id === action.payload._id &&
          stream.conversationId === action.payload.conversationId
      );
      if (myStream) {
        myStream?.stream?.getTracks().forEach((track) => {
          track.stop();
        });

        const newStreams = state.streams.filter(
          (stream) =>
            stream._id !== action.payload._id &&
            stream.conversationId === action.payload.conversationId
        );
        return { ...state, streams: newStreams };
      } else {
        return state;
      }
    case "USER_LOGOUT":
      return {
        ...state,
        streams: [],
        streamers: [],
        callHandlers: [],
        streaming: [
          {
            conversationId: null,
            value: false,
          },
        ],
      };

    case "ADD_STREAMER":
      const streamers = state.streamers.find(
        (stream) => stream.conversationId === action.payload.conversationId
      );
      if (streamers) {
        if (
          streamers?.myStreamers.length <= 3 &&
          !streamers?.myStreamers.includes(action.payload._id)
        ) {
          const myStreamers = streamers.myStreamers;
          const newStreamerArray = state.streamers.filter(
            (streamer) =>
              streamer.conversationId !== action.payload.conversationId
          );
          return {
            ...state,
            streamers: [
              newStreamerArray,
              {
                conversationId: action.payload.conversationId,
                myStreamers: [...myStreamers, action.payload._id],
              },
            ],
          };
        } else return state;
      } else {
        return {
          ...state,
          streamers: [
            ...state.streamers,
            {
              conversationId: action.payload.conversationId,
              myStreamers: [action.payload._id],
            },
          ],
        };
      }

    case "REMOVE_STREAMER":
      const theStreamers = state.streamers.find(
        (streamer) => streamer.conversationId === action.payload.conversationId
      );
      if (theStreamers) {
        const newStreamers = theStreamers.myStreamers.filter(
          (streamer) => streamer !== action.payload._id
        );
        const newStreamerArray = state.streamers.filter(
          (streamer) =>
            streamer.conversationId !== action.payload.conversationId
        );

        return {
          ...state,
          streamers: [
            newStreamerArray,
            {
              conversationId: action.payload.conversationId,
              myStreamers: newStreamers,
            },
          ],
        };
      } else return state;

    case "INITIAL_STREAMERS":
      return {
        ...state,
        streamers: [
          ...state.streamers,
          { conversationId: action.payload, myStreamers: [] },
        ],
      };

    case "INITIAL_STREAMING_STATE":
      return {
        ...state,
        streaming: [
          ...state.streaming,
          { conversationId: action.payload, value: false },
        ],
      };
    case "START_STREAMING":
      const newStateStart = state.streaming.filter(
        (x) => x.conversationId !== action.payload
      );
      return {
        ...state,
        streaming: [
          ...newStateStart,
          { conversationId: action.payload, value: true },
        ],
      };
    case "STOP_STREAMING":
      const newState = state.streaming.filter(
        (x) => x.conversationId !== action.payload
      );
      return {
        ...state,
        streaming: [
          ...newState,
          { conversationId: action.payload, value: false },
        ],
      };
    case "MUTE_USER":
      const userStream = state.streams.find(
        (stream) =>
          stream.conversationId === action.payload.conversationId &&
          stream._id === action.payload._id
      );
      userStream.stream.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.enabled = false;
        }
      });

      return state;
    case "UNMUTE_USER":
      const stream = state.streams.find(
        (stream) =>
          stream.conversationId === action.payload.conversationId &&
          stream._id === action.payload._id
      );
      stream.stream.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.enabled = true;
        }
      });
      return state;
    case "ENABLE_VIDEO":
      const VideostreamOne = state.streams.find(
        (stream) =>
          stream.conversationId === action.payload.conversationId &&
          stream._id === action.payload._id
      );
      VideostreamOne.stream.getTracks().forEach((track) => {
        if (track.kind === "video") {
          track.enabled = true;
        }
      });
      return state;
    case "DISABLE_VIDEO":
      const VideostreamTwo = state.streams.find(
        (stream) =>
          stream.conversationId === action.payload.conversationId &&
          stream._id === action.payload._id
      );
      VideostreamTwo.stream.getTracks().forEach((track) => {
        if (track.kind === "video") {
          track.enabled = false;
        }
      });
      return state;

    default:
      return state;
  }
};
