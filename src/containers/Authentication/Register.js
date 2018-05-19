// react
import React, { Component } from 'react';
// modules
import axios from 'axios';
import { styles } from './styles.scss';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: ''
    };
  }

  handleChangeEmail = e => {
    this.setState({ email: e.target.value });
  };

  handleChangeUsername = e => {
    this.setState({ username: e.target.value });
  };

  handleChangePassword = e => {
    this.setState({ password: e.target.value });
  };

  handleSubmit = event => {
    const self = this;
    const { username, email, password } = self.state;
    console.log(self.state);
    axios
      .post('/auth/register', {
        username: self.state.username,
        email: self.state.email,
        password: self.state.password
      })
      .then(res => {
        this.props.handleAuth(res.config.data);
      })
      .catch(err => console.log(err));

    this.setState({ username: '', email: '', password: '' });
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
          name="username"
          value={this.state.username}
          onChange={this.handleChangeUsername}
        />
        <input
          type="email"
          className="login-username"
          autofocus="true"
          required="true"
          placeholder="Email"
          name="email"
          value={this.state.email}
          onChange={this.handleChangeEmail}
        />
        <input
          type="password"
          className="login-password"
          required="true"
          placeholder="Password"
          name="password"
          value={this.state.password}
          onChange={this.handleChangePassword}
        />
        <div className="submit-button">
          <a
            className="subtle-link"
            content="Submit"
            onClick={this.handleSubmit}
            href="/#/record"
          >
            Register
          </a>
          <a
            className="subtle-link"
            onClick={() => this.props.handleLoginClick()}
          >
            Already have account...? Login
          </a>
        </div>
      </form>
    );
  }
}

export default Register;
