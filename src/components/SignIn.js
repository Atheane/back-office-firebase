import React, { Component } from 'react';
import { Link, navigate } from '@reach/router';
import { compose } from 'recompose';
import {
  Modal, Form, Icon, Input, Button, Checkbox,
} from 'antd';

import { withFirebase } from '../data/context';
import * as ROUTES from '../constants/routes';
import { PasswordForgetLink } from './PasswordForget';
import { StoreContext } from '../data/store';

const errorModal = (message) => {
  Modal.error({
    title: 'Error',
    content: message,
  });
}

const INITIAL_STATE = {
  email: '',
  password: '',
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;
    const { firebase } = this.props;

    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        navigate(ROUTES.DISCIPLINES);
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
    const { getFieldDecorator } = this.props.form;  

    return (
      <StoreContext.Consumer>
        {store => (
          <Form
            onSubmit={this.onSubmit}
            style={{width: '300px'}}
          >
            <Form.Item>
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
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  name='password'
                  onChange={this.onChange}
                  type="password"
                  placeholder="Password" />
              )}
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                  <Checkbox onChange={(e) => store.handleChange({ rememberMe: e.target.checked })}>Remember me</Checkbox>
                )}
                {/* <PasswordForgetLink>Forgot password</PasswordForgetLink> */}
              </div>

              <Button
                type="primary"
                htmlType="submit"
                style={{width: '100%'}}
              >
                Log in
              </Button>
              <span> Or </span> 
              <Link to={ROUTES.SIGN_UP}> Register now!</Link>
            </Form.Item>

          </Form>
        )}
      </StoreContext.Consumer>
    );
  }
}

const SignInForm = compose(
  Form.create({ name: 'normal_login' }),
  withFirebase,
)(SignInFormBase);

export { SignInForm };
