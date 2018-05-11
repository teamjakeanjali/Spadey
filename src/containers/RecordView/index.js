import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from 'components/Button';
import MicrophoneIcon from 'material-ui/svg-icons/av/mic';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import SaveIcon from 'material-ui/svg-icons/content/save';
import ReactSimpleTimer from 'react-simple-timer';
import Microphone from 'components/Microphone';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { styles } from './styles.scss';
import FormData from 'form-data';

/* actions */
import * as audioActionCreators from 'core/actions/actions-audio';

class RecordView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      saveRecording: false,
      transcription: '',
      overallTone: '',
      audio: ''
    };
  }

  sendAudio(recording) {
    // let formData = new FormData();
    // //add recording if needed
    // formData.append('recording', recording.blob);
    // fetch('/message/audio', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json, application/xml, text/plain, text/html, *.*',
    //     'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    //   },
    //   body: formData
    // });
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/message/audio', true);
    xhr.send(recording.blob);
  }

  startRecording = () => {
    this.setState({
      recording: true
    });
  };

  deleteRecording = () => {
    this.setState({
      recording: false
    });
  };

  saveRecording = () => {
    this.setState({
      recording: false,
      saveRecording: true
    });
    // this.sendAudio();
  };

  onStop = recording => {
    const { saveRecording } = this.state;
    const { actions, history } = this.props;

    if (saveRecording) {
      history.push('/recordings');
      actions.audio.saveRecording(recording);
      this.sendAudio(recording);
    }
  };

  render() {
    let buttons;
    const { recording } = this.state;

    if (recording) {
      buttons = (
        <div className="buttons">
          <Button
            className="secondary save"
            iconOnly={true}
            onTouchTap={this.saveRecording}
            icon={<SaveIcon />}
          />
          <Button
            secondary={true}
            raised={true}
            floating={true}
            disabled={true}
            icon={<MicrophoneIcon />}
          />
          <Button
            className="secondary delete"
            iconOnly={true}
            onTouchTap={this.deleteRecording}
            icon={<DeleteIcon />}
          />
        </div>
      );
    } else {
      buttons = (
        <Button
          className="btn"
          secondary={true}
          raised={true}
          floating={true}
          onTouchTap={this.startRecording}
          icon={<MicrophoneIcon />}
        />
      );
    }

    return (
      <div className={styles}>
        <Microphone record={recording} onStop={this.onStop} />
        <div id="controls">
          <ReactSimpleTimer play={recording} />
          {buttons}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      audio: bindActionCreators(audioActionCreators, dispatch)
    }
  };
}

export default withRouter(connect(null, mapDispatchToProps)(RecordView));
