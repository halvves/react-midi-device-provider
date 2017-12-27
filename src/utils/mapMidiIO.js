// @flow
export function mapDevices(io: Object): Array<Object> {
  const devices = [];
  io.forEach(i => {
    devices.push(i);
  });
  return devices;
}

export function mapMidiIO(access: Object): Object {
  return {
    inputs: mapDevices(access.inputs),
    outputs: mapDevices(access.outputs),
  };
}

export default mapMidiIO;
