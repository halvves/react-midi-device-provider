// @flow
import React, { Component } from 'react';
import type { ComponentType } from 'react';
import hoistStatics from 'hoist-non-react-statics';

import { CHANNEL, CONTEXT_CHANNEL_SHAPE } from '../MidiDeviceProvider';

type State = {
  midi: ?{
    inputs: ?Array<Object>,
    outputs: ?Array<Object>,
    selectedInput: ?Object,
    selectedOutput: ?Object,
  },
};

const wrapWithMidi = (Base: ComponentType<any>) => {
  const componentName = Base.displayName || Base.name || 'Component';

  class WithMidi extends Component<any, State> {
    static contextTypes = {
      [CHANNEL]: CONTEXT_CHANNEL_SHAPE,
    };

    static displayName = `WithMidi(${componentName})`;

    constructor() {
      super();
      this.setMidiInput = this.setMidiInput.bind(this);
      this.setMidiOutput = this.setMidiOutput.bind(this);
    }

    state: { midi?: ?Object } = {};

    componentWillMount() {
      const midiContext = this.context[CHANNEL];

      if (!midiContext) {
        console.warn(
          '[withMidi] - Unable to get midi context. It seems you are not using a MidiDeviceProvider.'
        );
        return;
      }

      this.unsubscribe = midiContext.subscribe(midi => {
        this.setState({ midi });
      });
    }

    componentWillUnmount() {
      if (typeof this.unsubscribe === 'function') {
        this.unsubscribe();
      }
    }

    setMidiInput: (id: string) => void;
    setMidiInput(id: string): void {
      const midiContext = this.context[CHANNEL];

      if (!midiContext) {
        console.warn(
          '[withMidi] - Unable to get midi context. It seems you are not using a MidiDeviceProvider.'
        );
        return;
      }

      if (this.state.midi && Array.isArray(this.state.midi.inputs)) {
        midiContext.setMidiInput(
          this.state.midi.inputs.filter(i => i.id === id)[0]
        );
      }
    }

    setMidiOutput: (id: string) => void;
    setMidiOutput(id: string) {
      const midiContext = this.context[CHANNEL];

      if (!midiContext) {
        console.warn(
          '[withMidi] - Unable to get midi context. It seems you are not using a MidiDeviceProvider.'
        );
        return;
      }

      if (this.state.midi && Array.isArray(this.state.midi.outputs)) {
        midiContext.setMidiOutput(
          this.state.midi.outputs.filter(i => i.id === id)[0]
        );
      }
    }

    unsubscribe: () => void;

    render() {
      return (
        <Base
          {...this.props}
          midi={this.state.midi}
          setMidiInput={this.setMidiInput}
          setMidiOutput={this.setMidiOutput}
        />
      );
    }
  }

  return hoistStatics(WithMidi, Base);
};

export default wrapWithMidi;
