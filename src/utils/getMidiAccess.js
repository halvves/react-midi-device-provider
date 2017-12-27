// @flow
export function getMidiAccess(sysex?: boolean = false): Promise<any> {
  return typeof window !== 'undefined' &&
    window.navigator &&
    typeof window.navigator.requestMIDIAccess === 'function'
    ? window.navigator.requestMIDIAccess({ sysex }).then(access => access)
    : new Promise((resolve, reject) => reject(new Error('MIDI Not Available')));
}

export default getMidiAccess;
