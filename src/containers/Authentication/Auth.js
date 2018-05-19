import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import { styles } from './styles.scss';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      register: false
    };
  }

  handleLoginClick = () => {
    this.setState({
      login: true,
      register: false
    });
  };

  handleSignupClick = () => {
    this.setState({
      login: false,
      register: true
    });
  };

  render() {
    if (this.state.login) {
      return (
        <Login
          handleAuth={this.props.handleAuth}
          handleSignupClick={this.handleSignupClick}
        />
      );
    } else if (this.state.register) {
      return (
        <Register
          handleAuth={this.props.handleAuth}
          handleLoginClick={this.handleLoginClick}
        />
      );
    } else {
      return (
        <form className="login-form">
          <br />
          <div className="spadey">
            <svg viewBox="0 0 800 600">
              <symbol id="s-text">
                <text
                  font="16em/1 Snell Roundhand"
                  cursive
                  text-anchor="middle"
                  x="50%"
                  y="35%"
                  className="text--line"
                >
                  Spadey
                </text>
              </symbol>

              <g className="g-ants">
                <use href="#s-text" className="text-copy" />
                <use href="#s-text" className="text-copy" />
                <use href="#s-text" className="text-copy" />
                <use href="#s-text" className="text-copy" />
                <use href="#s-text" className="text-copy" />
              </g>
            </svg>
          </div>
          <div>
            <a href="/#/auth/login">
              <button
                className="login-submit"
                onClick={() => this.handleLoginClick()}
              >
                Login
              </button>
            </a>
            <a href="/#/auth/register">
              <button
                className="login-submit"
                onClick={() => this.handleSignupClick()}
              >
                Sign up
              </button>
            </a>
          </div>
        </form>
      );
    }
  }
}

export default Auth;
