export const getStream = async (video = true, audio = true) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: video,
    audio: audio,
  });
  return stream;
};
