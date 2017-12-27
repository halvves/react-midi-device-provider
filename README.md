# MidiDeviceProvider

[![Latest NPM release][npm-badge]][npm-badge-url]
[![Build Status][travis-badge]][travis-badge-url]

## Installation

`yarn add react-midi-device-provider` or `npm i -P react-midi-device-provider`

## Usage

Wrap all/part of your application in `<MidiDeviceProvider />`.

```javascript
import React from 'react'
import { render } from 'react-dom';
import { MidiDeviceProvider } from 'react-midi-device-provider';

const appElement = document.getElementById('app');
render(
  <MidiDeviceProvider sysex>
    <App />
  </MidiDeviceProvider>,
  appElement
);
```

Then... expose `midi`, `setMidiInput`, and `setMidiOutput` to your components using `withMidi(Component)`;

### Examples:

#### MidiDeviceSwitcher
```javascript
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withMidi } from 'react-midi-device-provider';

class MidiDeviceSwitcher extends PureComponent {
  constructor() {
    super();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOutputChange = this.handleOutputChange.bind(this);
  }

  static propTypes = {
    midi: PropTypes.object,
    setMidiInput: PropTypes.func,
    setMidiOutput: PropTypes.func
  }

  handleInputChange(e) {
    const { setMidiInput } = this.props;
    setMidiInput(e.target.value);
  }

  handleOutputChange(e) {
    const { setMidiOutput } = this.props;
    setMidiOutput(e.target.value);
  }

  render() {
    const {
      inputs,
      outputs,
      selectedInput,
      selectedOutput
    } = this.props.midi;
    return (
      <div>
        <div>
          <h3>Inputs</h3>
          <select onChange={this.handleInputChange}>
            {inputs.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <span>{selectedInput && ` - ${selectedInput.name}`}</span>
        </div>
        <div>
          <h3>Outputs</h3>
          <select onChange={this.handleOutputChange}>
            {outputs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          <span>{selectedOutput && ` - ${selectedOutput.name}`}</span>
        </div>
      </div>
    );
  }
}

export default withMidi(MidiDeviceSwitcher);
```

#### MidiParamSlider
```javascript
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withMidi } from 'react-midi-device-provider';

class MidiParamSlider extends PureComponent {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
  }

  static propTypes = {
    channel: PropTypes.number,
    max: PropTypes.number,
    min: PropTypes.number,
    midi: PropTypes.object.isRequired
  }

  static defaultProps = {
    channel: 0x10,
    max: 127,
    min: 0
  }

  handleChange(e) {
    const { channel, midi } = this.props;
    const { selectedOutput } = midi;
    if (selectedOutput && typeof selectedOutput.send === 'function') {
      selectedOutput.send([0xb0, channel, Math.floor(e.target.value)]);
    }
  }

  render() {
    const { max, min } = this.props;
    return (
      <div>
        <input
          type="range"
          max={max}
          min={min}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default withMidi(MidiParamSlider);
```

[npm-badge]: https://img.shields.io/npm/v/react-midi-device-provider.svg
[npm-badge-url]: https://www.npmjs.com/package/react-midi-device-provider
[travis-badge]: https://travis-ci.org/halvves/react-midi-device-provider.svg?branch=master
[travis-badge-url]: https://travis-ci.org/halvves/react-midi-device-provider
