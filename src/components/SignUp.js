import React, { Component } from 'react';
import { navigate } from '@reach/router';
import { compose } from 'recompose';
import {
  Modal, Form, Icon, Input, Button, Checkbox,
} from 'antd';

import { withFirebase } from '../data/context';
import * as ROUTES from '../constants/routes';
import * as ROLES from '../constants/roles';

import { emailRegexp, passwordRegexp } from '../constants/regexp';


const errorModal = (message) => {
  Modal.error({
    title: 'Error',
    content: message,
  });
}

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpForm extends Component {

  // constructor(props) {
  //   super(props);
    // const storage = new LocalStorageManager(); to-do
    // const username = storage.get('username');  to-do
    // const email = storage.get('email');        to-do
  // }

  state = INITIAL_STATE;

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;
    const { firebase } = this.props;

    const roles = [];

    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser =>
        firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
            roles,
          }, {
            merge: true
          })
      )
      // .then(() => firebase.doSendEmailVerification()) // error firebase.doSendEmailVerification is not a function
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        navigate(ROUTES.APP);
      })
      .catch(error => {
        error && errorModal(error.message);
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      email,
      passwordOne,
      passwordTwo,
    } = this.state;

    const { getFieldDecorator } = this.props.form;  
    const isEmailValid = (email && email.match(emailRegexp) && email.match(emailRegexp).length > 0);
    const isPasswordOneValid = (passwordOne && passwordOne.match(passwordRegexp) && passwordOne.match(passwordRegexp).length > 0); 
    const isPasswordTwoValid = !(passwordOne === passwordTwo && passwordTwo!==''); 
    
    return (
      <Form
        onSubmit={this.onSubmit}
        style={{width: '300px'}}
      >
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input 
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              name='username'
              onChange={this.onChange}
              type="text"
              placeholder="Full Name"
            />
          )}
        </Form.Item>
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
        <Form.Item
          validateStatus={ isPasswordOneValid ? "success" : "error"}
          hasFeedback
          help={isPasswordOneValid ? '' : "Min 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character"}
        >
          {getFieldDecorator('passwordOne', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              name='passwordOne'
              onChange={this.onChange}
              type="password"
              placeholder="Password" />
          )}
        </Form.Item>
        <Form.Item
          validateStatus={ !isPasswordTwoValid ? "success" : "error"}
          hasFeedback
          help={!isPasswordTwoValid ? '' : "Invalid password"}
        >
          {getFieldDecorator('passwordTwo', {
            rules: [{ required: true, message: 'Please confirm Password' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              name='passwordTwo'
              onChange={this.onChange}
              type="password"
              placeholder="Confirm Password" />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={isEmailValid && isPasswordOneValid && isPasswordTwoValid}
            style={{width: '100%'}}
          >
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  }
};

export default compose(
  Form.create({ name: 'signup' }),
  withFirebase,
)(SignUpForm);