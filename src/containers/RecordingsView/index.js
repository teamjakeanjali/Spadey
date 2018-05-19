import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EmptyState from 'components/EmptyState';
import RecordedItem from 'components/RecordedItem';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import ReportsView from 'containers/ReportsView';

import { styles } from './styles.scss';

/* actions */
import * as uiActionCreators from 'core/actions/actions-ui';
import * as audioActionCreators from 'core/actions/actions-audio';

class RecordingsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sentiment: '',
      message: ''
    };
  }

  componentDidMount() {
    const { match, actions } = this.props;

    if (match.path === '/recording/:id') {
      actions.ui.openRightNav();
    } else if (match.path === 'reports/:id') {
      actions.ui.openTopNav();
    }
  }

  goToRecording = recordingId => {
    const { history, actions } = this.props;
    history.push(`/recording/${recordingId}`);
    actions.ui.openRightNav();
  };

  goToReports = recordingId => {
    console.log(this.props);
    const { history, actions, userId } = this.props;
    history.push(`/reports/${recordingId}`);
    actions.ui.openTopNav();
    console.log('LEFT OPEN!');
    this.getAudioInfo(userId, recordingId);
  };

  getAudioInfo = (userId, recordingId) => {
    console.log('user', userId);
    axios
      .post('/messageinfo', {
        userId: userId,
        recordingId: recordingId
      })
      .then(res => {
        this.props.actions.audio.getAudioTranscription(res.data);
        // this.setState({
        //   sentiment: res.data.Sentiment,
        //   message: res.data.Transcription
        // });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getRecordings() {
    const { list } = this.props.audio;

    const recordings = list.map((recordedItem, index) => {
      return (
        <li key={`recording-${index}`}>
          <RecordedItem
            item={recordedItem}
            goToRecording={this.goToRecording.bind(null, recordedItem.id)}
            goToReports={this.goToReports.bind(null, recordedItem.id)}
            transcription={this.state.transcription}
            sentiment={this.state.sentiment}
          />
        </li>
      );
    });
    return recordings;
  }

  displayRecordings() {
    const { list } = this.props.audio;

    if (list && list.length) {
      const audioItems = this.getRecordings();
      return <ul>{audioItems}</ul>;
    } else {
      return <EmptyState message="You don't have any recordings." />;
    }
  }

  render() {
    const recordings = this.displayRecordings();
    return <div className={styles}>{recordings}</div>;
  }
}

function mapStateToProps(state) {
  return {
    audio: state.audio
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      ui: bindActionCreators(uiActionCreators, dispatch),
      audio: bindActionCreators(audioActionCreators, dispatch)
    }
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RecordingsView)
);
