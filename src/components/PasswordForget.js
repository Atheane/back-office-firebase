import React, { Component } from 'react';
import { Link, navigate } from "@reach/router"

import { compose } from 'recompose';
import {
  Modal, Form, Icon, Input, Button,
} from 'antd';

import { FirebaseContext } from '../data/context';
import * as ROUTES from '../constants/routes';
import { emailRegexp } from '../constants/regexp';

const successModal = () => {
  Modal.success({
    title: 'An Email has been sent',
    content: 'Click on the Email link to reset your password',
  });
}

const errorModal = (message) => {
  Modal.error({
    title: 'Error',
    content: message,
  });
}

const INITIAL_STATE = {
  email: '',
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;
    const { firebase } = this.props;

    firebase
      .doPasswordReset(email)
      .then(() => {
        successModal();
        this.setState({ ...INITIAL_STATE });
        navigate(ROUTES.LANDING);
      })
      .catch(error => {
        error && errorModal(error.message);
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email } = this.state;
    const { getFieldDecorator } = this.props.form;  

    const isEmailValid = (email && email.match(emailRegexp) && email.match(emailRegexp).length > 0);

    return (
      <Form
        onSubmit={this.onSubmit}
        style={{width: '300px'}}
      >
        <Form.Item
          validateStatus={ isEmailValid ? "success" : "error"}
          hasFeedback
          help={isEmailValid ? '' : "Email badly formated"}
        >
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input 
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              name='email'
              onChange={this.onChange}
              type="text"
              placeholder="your@email.com"
            />
          )}
        </Form.Item>
        <br />

        <Button
          type="primary"
          htmlType="submit"
          style={{width: '100%'}}
          disabled={!isEmailValid}
        >
          Reset Password
        </Button>
      </Form>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

const PasswordForgetForm = compose(
  Form.create({ name: 'passwordForget' }),
)(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };