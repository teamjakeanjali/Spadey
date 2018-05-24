import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from 'components/Button';
import MicrophoneIcon from 'material-ui/svg-icons/av/mic';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import SaveIcon from 'material-ui/svg-icons/content/save';
import CircularProgress from 'material-ui/CircularProgress';
import ReactSimpleTimer from 'react-simple-timer';
import Microphone from 'components/Microphone';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { styles } from './styles.scss';
import io from 'socket.io-client';
import ss from 'socket.io-stream';

/* actions */
import * as audioActionCreators from 'core/actions/actions-audio';

class RecordView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      saveRecording: false,
      audio: '',
      user_id: '',
      inserted: false,
      uploaded: false
    };
  }

  componentDidMount() {
    axios
      .get('/session')
      .then(res => {
        if (res.data.id) {
          this.setState({
            user_id: res.data.id
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  sendAudio(recording, title) {
    let socket = io({ transports: ['websocket'] });
    let file = recording.blob;
    let stream = ss.createStream();

    ss(socket).emit('send-audio', stream, {
      mimetype: file.mimetype,
      size: file.size,
      recordingId: recording.id,
      recordingTitle: title,
      recordingStartTime: recording.startTime,
      recordingStopTime: recording.stopTime
    });
    ss.createBlobReadStream(file).pipe(stream);

    socket.on('inserted', data => {
      if (data === true) {
        this.setState({
          inserted: true
        });
        console.log(data);
      }
    });
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
  };

  onStop = recording => {
    const { saveRecording } = this.state;
    const { actions, history } = this.props;

    if (saveRecording) {
      let title = prompt('Please enter a recording title:');
      actions.audio.saveRecording(recording);
      this.sendAudio(recording, title);
    }

    if (this.state.inserted === true) {
      history.push('/recordings');
    }
  };

  render() {
    let buttons;
    let body;

    const { inserted, recording, saveRecording } = this.state;
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

    if (saveRecording === true && inserted === false) {
      body = (
        <div>
          <CircularProgress size={80} thickness={7} color="blue" />
        </div>
      );
    } else {
      body = <div />;
    }

    return (
      <div className={styles}>
        <div>{body}</div>
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
