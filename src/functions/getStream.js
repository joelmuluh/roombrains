const getConnectedDevices = async (type) => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === type);
};
export const getStream = async () => {
  let stream;

  const cameras = getConnectedDevices("videoinput");
  if (cameras && cameras.length > 0) {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: cameras[0].deviceId,
        width: {
          min: "100%",
        },
        height: {
          min: "100%",
        },
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
  } else {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: {
          min: "100%",
        },
        height: {
          min: "100%",
        },
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
  }

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
