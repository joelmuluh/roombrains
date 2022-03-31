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
  participation: [
    {
      conversationId: null,
      participants: [],
    },
  ],
  socket: io(`${process.env.REACT_APP_API}`),
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

    case "ADD_STREAMER":
      const allStreamers = state.streamers.find(
        (stream) => stream.conversationId === action.payload.conversationId
      );
      if (allStreamers) {
        if (
          allStreamers?.myStreamers.length < 5 &&
          !allStreamers?.myStreamers.includes(action.payload._id)
        ) {
          return {
            ...state,
            streamers: [
              ...state.streamers,
              {
                conversationId: action.payload.conversationId,
                myStreamers: [...allStreamers?.myStreamers, action.payload._id],
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
      const newStreamers = theStreamers.myStreamers.filter(
        (streamer) => streamer !== action.payload._id
      );

      return {
        ...state,
        streamers: [
          ...state.streamers,
          {
            conversationId: action.payload.conversationId,
            myStreamers: newStreamers,
          },
        ],
      };

    case "ADD_PARTICIPANT":
      const participation = state.participation.find(
        (participant) =>
          participant.conversationId === action.payload.conversationId
      );
      if (participation) {
        return {
          ...state,
          participation: [
            ...state.participation,
            {
              conversationId: action.payload.conversationId,
              participants: [
                ...participation?.participants,
                action.payload._id,
              ],
            },
          ],
        };
      } else {
        return {
          ...state,
          participation: [
            ...state.participation,
            {
              conversationId: action.payload.conversationId,
              participants: [action.payload._id],
            },
          ],
        };
      }
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
    default:
      return state;
  }
};
