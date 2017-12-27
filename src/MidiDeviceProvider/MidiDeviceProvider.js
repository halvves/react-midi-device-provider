// @flow
import React, { Component } from 'react';
import type { Node } from 'react';
import PropTypes from 'prop-types';

import { createBroadcast, getMidiAccess, mapMidiIO } from '../utils';
import type { Broadcast } from '../utils';

export const CHANNEL = '__midi-device-provider__';
export const CONTEXT_CHANNEL_SHAPE = PropTypes.shape({
  setMidiInput: PropTypes.func,
  setMidiOutput: PropTypes.func,
  subscribe: PropTypes.func,
});

type Props = {
  children?: Node,
  sysex?: boolean,
};

class MidiDeviceProvider extends Component<Props, void> {
  static defaultProps = {
    children: null,
    sysex: false,
  };

  constructor() {
    super();

    this.setMidiInput = this.setMidiInput.bind(this);
    this.setMidiOutput = this.setMidiOutput.bind(this);
  }

  getChildContext() {
    return {
      ...this.context,
      [CHANNEL]: {
        subscribe: this.broadcast.subscribe,
        setMidiInput: this.setMidiInput,
        setMidiOutput: this.setMidiOutput,
      },
    };
  }

  componentWillMount() {
    const duplicateContext = this.context[CHANNEL];
    if (duplicateContext !== undefined) {
      console.warn(
        `[MidiDeviceProvider] - It looks like you are trying to nest multiple providers. This probably won't have the outcome you expect. Any nested MidiDeviceProviders will be disabled.`
      );
      return;
    }

    getMidiAccess(this.props.sysex)
      .then(access => {
        this.broadcast.publish(mapMidiIO(access));
        // eslint-disable-next-line no-param-reassign
        access.onstatechange = () => {
          this.broadcast.publish(mapMidiIO(access));
        };
      })
      .catch(err => {
        console.warn(`[MidiDeviceProvider] - ${err}`);
      });
  }

  setMidiInput: (input: Object) => void;
  setMidiInput(input: Object) {
    this.broadcast.publish({ selectedInput: input });
  }

  setMidiOutput: (output: Object) => void;
  setMidiOutput(output: Object) {
    this.broadcast.publish({ selectedOutput: output });
  }

  broadcast: Broadcast = createBroadcast({
    inputs: [],
    outputs: [],
    selectedInput: null,
    selectedOutput: null,
  });

  props: Props;

  render() {
    return !this.props.children
      ? null
      : React.Children.only(this.props.children);
  }
}

MidiDeviceProvider.childContextTypes = {
  [CHANNEL]: CONTEXT_CHANNEL_SHAPE,
};

MidiDeviceProvider.contextTypes = {
  [CHANNEL]: CONTEXT_CHANNEL_SHAPE,
};

export default MidiDeviceProvider;
