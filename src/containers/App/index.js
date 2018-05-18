import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

// global styles for entire app
import './styles/app.scss';

//actions
import * as audioActionCreators from 'core/actions/actions-audio';

/* application containers */
import Header from 'containers/Header';
import LeftNavBar from 'containers/LeftNavBar';
import RecordView from 'containers/RecordView';
import RecordingsView from 'containers/RecordingsView';
import DetailsView from 'containers/DetailsView';
import ReportsView from 'containers/ReportsView';
import Auth from '../Authentication/Auth';
import Register from '../Authentication/Register';
import Login from '../Authentication/Login';

injectTapEventPlugin();
OfflinePluginRuntime.install();

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      username: '',
      email: '',
      userId: ''
    };
  }

  componentDidMount() {
    axios
      .get('/session')
      .then(res => {
        //THIS IS THE ENTIRE USER
        console.log(res.data);
        if (res.data.id) {
          this.setState({
            isLoggedIn: true,
            userId: res.data.id
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    const { actions } = this.props;
    actions.audio.getAllRecordings();
  }

  handleAuth = data => {
    data = JSON.parse(data);
    console.log(data);
    if (data.username || data.email) {
      this.setState({
        isLoggedIn: true,
        username: data.username,
        email: data.email
      });
    }
  };

  render() {
    if (this.state.isLoggedIn) {
      return (
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div>
            <HashRouter>
              <div>
                <Header />
                <div className="container">
                  <Switch>
                    <Route path="/auth/login" component={Login} />
                    <Route path="/auth/register" component={Register} />
                    <Route path="/record" component={RecordView} />
                    <Route
                      path="/recordings"
                      render={() => (
                        <RecordingsView userId={this.state.userId} />
                      )}
                    />
                    <Route path="/recording/:id" component={RecordingsView} />
                    <Route path="/reports/:id" component={RecordingsView} />
                    <Redirect from="/" to="/record" />
                  </Switch>
                </div>
                <ReportsView userId={this.state.userId} />
                <DetailsView />
                <LeftNavBar />
              </div>
            </HashRouter>
          </div>
        </MuiThemeProvider>
      );
    } else {
      return (
        <div>
          <Auth handleAuth={this.handleAuth} />
        </div>
      );
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      audio: bindActionCreators(audioActionCreators, dispatch)
    }
  };
}

export default connect(null, mapDispatchToProps)(App);
