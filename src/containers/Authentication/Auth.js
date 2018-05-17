import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Login from './Login';
import Register from './Register';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      Register: false
    };
  }

  handleLoginClick = () => {
    this.setState({
      login: true
    });
  };

  handleSignupClick = () => {
    this.setState({
      signup: true
    });
  };

  render() {
    if (this.state.login) {
      return (
        <Login
          handleAuth={this.props.handleAuth}
          // handleGoogleAuth={this.props.handleGoogleAuth}
        />
      );
    } else if (this.state.signup) {
      return <Register handleAuth={this.props.handleAuth} />;
    } else {
      return (
        <div className="auth">
          <a href="/#/auth/login">
            <button onClick={() => this.handleLoginClick()}>Login</button>
          </a>
          <a href="/#/auth/register">
            <button onClick={() => this.handleSignupClick()}>Sign up</button>
          </a>
        </div>
      );
    }
  }
}

export default Auth;
