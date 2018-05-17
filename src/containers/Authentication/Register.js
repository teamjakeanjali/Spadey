// react
import React, { Component } from 'react';
// modules
import axios from 'axios';

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
      <form className="login" onSubmit={this.handleSubmit}>
        <div className="row uniform">
          <div className="6u">
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={this.state.username}
              onChange={this.handleChangeUsername}
            />
          </div>
          <div className="6u signup-email">
            <input
              type="email"
              placeholder="Email@email.com"
              name="email"
              value={this.state.email}
              onChange={this.handleChangeEmail}
            />
          </div>
          <div className="6u signup-pw">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={this.state.password}
              onChange={this.handleChangePassword}
            />
          </div>
          <div className="submit-button">
            <a
              className="big button special"
              content="Submit"
              onClick={this.handleSubmit}
              href="/#/record"
            >
              Sign Up
            </a>
            <div>
              <a className="subtle-link">Login instead</a>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default Register;
