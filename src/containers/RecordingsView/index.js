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
      messages: [],
      isRefresh: false
    };
  }

  componentDidMount() {
    const { match, actions } = this.props;

    if (match.path === '/recording/:id') {
      actions.ui.openRightNav();
    } else if (match.path === 'reports/:id') {
      actions.ui.openTopNav();
    }
    this.getAllMessages();
  }

  componentDidUpdate() {
    if (!this.state.isRefresh) {
      this.getAllMessages();
      this.setState({
        isRefresh: true
      });
    }
  }

  goToRecording = recordingId => {
    const { history, actions } = this.props;
    history.push(`/recording/${recordingId}`);
    actions.ui.openRightNav();
  };

  goToReports = recordingId => {
    const { history, actions, userId } = this.props;
    history.push(`/reports/${recordingId}`);
    actions.ui.openTopNav();
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
      })
      .catch(err => {
        console.log(err);
      });
  };

  getAllMessages = () => {
    axios
      .get('/messages')
      .then(res => {
        this.setState({
          messages: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getRecordings() {
    console.log(this.state.messages);
    const recordings = this.state.messages.map((recordedItem, index) => {
      return (
        <li key={`recording-${index}`}>
          <RecordedItem
            item={recordedItem}
            goToRecording={this.goToRecording.bind(
              null,
              recordedItem.recordingId
            )}
            goToReports={this.goToReports.bind(null, recordedItem.recordingId)}
          />
        </li>
      );
    });
    return recordings;
  }

  displayRecordings() {
    const { list } = this.props.audio;

    if (this.state.messages && this.state.messages.length) {
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
