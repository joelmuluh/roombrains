export const getStream = async (video = true, audio = true) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
    },
  });
  return stream;
};

export const getDisplayMedia = async () => {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      cursor: true,
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
    },
  });
  return stream;
};
