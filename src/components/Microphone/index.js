/**
 * Microphone
 */

import React, { Component } from 'react';
import { ReactMic } from 'react-mic';

/* component styles */
import { styles } from './styles.scss';

export default class Microphone extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { record, onStop } = this.props;

    return (
      <div className={styles}>
        <div className="microphone-icon" />
        <ReactMic
          record={record}
          onStop={onStop}
          className="recording-line"
          strokeColor="#3366ff"
          backgroundColor="black"
        />
      </div>
    );
  }
}
