// React
import React, { Component } from 'react';
// modules
// import { Form } from 'semantic-ui-react';
import axios from 'axios';
import { styles } from './styles.scss';

// components

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  handleChangeUsername = e => {
    this.setState({ username: e.target.value });
  };

  handleChangePassword = e => {
    this.setState({ password: e.target.value });
  };

  handleSubmit = event => {
    const self = this;
    const { username, password } = self.state;
    axios
      .post('/auth/login', {
        username: self.state.username,
        password: self.state.password
      })
      .then(res => {
        this.props.handleAuth(res.config.data);
      })
      .catch(err => console.log(err));

    this.setState({ username: '', password: '' });
  };

  render() {
    return (
      <form className="login-form">
        <p className="login-text">
          <span className="fa-stack fa-lg">
            <i className="fa fa-circle fa-stack-2x" />
            <i className="fa fa-lock fa-stack-1x" />
          </span>
        </p>
        <input
          className="login-username"
          autofocus="true"
          required="true"
          type="text"
          placeholder="Username"
          value={this.state.username}
          onChange={this.handleChangeUsername}
        />
        <input
          type="password"
          className="login-password"
          required="true"
          placeholder="Password"
          value={this.state.password}
          onChange={this.handleChangePassword}
        />
        <div>
          <a
            className="subtle-link"
            content="Submit"
            onClick={this.handleSubmit}
            href="/#/record"
          >
            Login
          </a>
          <a className="subtle-link">Sign up</a>
        </div>
        <div>
          <a className="google-btn" href="/auth/google">
            Google+
          </a>
        </div>
      </form>
    );
  }
}

export default Login;
