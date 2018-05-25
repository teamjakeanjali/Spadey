import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { IconButton, Drawer } from 'material-ui';
import Button from 'components/Button';
import NavigationBack from 'material-ui/svg-icons/navigation/arrow-forward';
import ReactChartkick, { BarChart } from 'react-chartkick';
import Chart from 'chart.js';

ReactChartkick.addAdapter(Chart);

/* actions */
import * as uiActionCreators from 'core/actions/actions-ui';
import * as audioActionCreators from 'core/actions/actions-audio';

/* component styles */
import { styles } from './styles.scss';

class ReportsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      audioBlob: null,
      isPlaying: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { list } = nextProps.audio;
    const { pathname } = nextProps.location;
    const audioId = this.getCurrentId(pathname);
    this.findRecordId(list, audioId);
  }

  findRecordId = (list, audioId) => {
    if (list && list.length) {
      const audioBlob = list.find(item => {
        return item.id === audioId;
      });
      this.setState({
        audioBlob: audioBlob
      });
    } else {
      this.setState({
        audioBlob: undefined
      });
    }
  };

  getCurrentId(pathname) {
    return pathname.split('/')[2];
  }

  closeNav = () => {
    const { actions, history } = this.props;
    actions.ui.closeTopNav();
    history.push('/recordings');
  };

  getContent() {
    const { audioBlob } = this.state;
    let body, text, sentimentTones, sentenceTones;
    let dataObj = {};
    let data = [];

    if (audioBlob) {
      if (this.props.audio.sentiment.document_tone) {
        sentimentTones = this.props.audio.sentiment.document_tone.tones;
        sentenceTones = this.props.audio.sentiment.sentences_tone;

        for (let tone of sentimentTones) {
          dataObj[tone.tone_name] = 100 * tone.score;
        }

        if (sentenceTones) {
          for (let sentenceTone of sentenceTones) {
            if (sentenceTone.tones.length > 0) {
              for (let tone in sentenceTone.tones) {
                if (!Object.keys(dataObj).includes(tone.tone_name)) {
                  if (tone.tone_name) {
                    dataObj[tone.tone_name] = 100 * tone.score;
                  }
                }
              }
            }
          }
        }
      }

      //Convert object back to array
      for (let key in dataObj) {
        data.push([key, dataObj[key]]);
      }

      text = <text>{this.props.audio.transcription}</text>;
      body = (
        <div>
          <br />
          <BarChart
            data={data}
            xtitle="Percentage"
            ytitle="Emotion"
            suffix="%"
            colors={['#7ae266']}
          />
        </div>
      );
    } else if (!this.props.audio.sentiment) {
      body = <div>No sentiment found in recording.</div>;
    } else {
      body = <div>No recording was found</div>;
    }

    return (
      <div>
        <header>
          <h1>Daily Sentiment Analysis</h1>
          <IconButton className="btn close" onTouchTap={this.closeNav}>
            <NavigationBack />
          </IconButton>
        </header>
        <div className="text">{text}</div>
        <div className="details-view-body">{body}</div>
      </div>
    );
  }

  render() {
    const { ui } = this.props;
    const content = this.getContent();

    return (
      <div className={styles}>
        <Drawer
          docked={false}
          width={1000}
          open={ui.topNavOpen || this.state.open}
          containerClassName="right-drawer"
          onRequestChange={this.closeNav}
          swipeAreaWidth={10}
        >
          {content}
        </Drawer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ui: state.ui,
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
  connect(mapStateToProps, mapDispatchToProps)(ReportsView)
);
