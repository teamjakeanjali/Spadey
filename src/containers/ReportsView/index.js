import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import {
  IconButton,
  Drawer,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui';
import Button from 'components/Button';
import NavigationBack from 'material-ui/svg-icons/navigation/arrow-forward';
import PlayButton from 'material-ui/svg-icons/av/play-arrow';
import PauseButton from 'material-ui/svg-icons/av/pause';

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
      isPlaying: false,
      sentiment: '',
      message: ''
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
    const { audioBlob, isPlaying } = this.state;
    let body, text;

    if (audioBlob) {
      text = <text>{this.state.message}</text>;
      body = (
        <div>
          <br />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>ID</TableHeaderColumn>
                <TableHeaderColumn>Status</TableHeaderColumn>
                <TableHeaderColumn>Data</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableRowColumn>1</TableRowColumn>
                <TableRowColumn>John Smith</TableRowColumn>
                <TableRowColumn>Employed</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>2</TableRowColumn>
                <TableRowColumn>Randal White</TableRowColumn>
                <TableRowColumn>Unemployed</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>3</TableRowColumn>
                <TableRowColumn>Stephanie Sanders</TableRowColumn>
                <TableRowColumn>Employed</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>4</TableRowColumn>
                <TableRowColumn>Steve Brown</TableRowColumn>
                <TableRowColumn>Employed</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>5</TableRowColumn>
                <TableRowColumn>Christopher Nolan</TableRowColumn>
                <TableRowColumn>Unemployed</TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      );
    } else {
      body = <div>No recording was found</div>;
    }

    return (
      <div>
        <header>
          <h1>Spadey Analysis Report</h1>
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
