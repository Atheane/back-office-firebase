import React from 'react';
import { navigate } from '@reach/router';
import { compose } from 'recompose';
import { Modal } from 'antd';

// import PropTypes from 'prop-types';
import { withFirebase } from '../data/context';
import { AuthUserContext } from './Authentication';
import * as ROUTES from '../constants/routes';


const warningModal = () => {
  Modal.warning({
    title: "Accès non authorisé",
    content: "Veuillez vous authentifier avec vos accès administrateurs.",
  });
}


const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {

    componentDidMount() {
      const { firebase } = this.props;
      this.listener = firebase.onAuthUserListener(
        authUser => {
          if (!condition(authUser)) {
            warningModal();
            navigate(ROUTES.SIGN_IN);
          }
        },
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return compose(
    withFirebase,
  )(WithAuthorization);
};

export default withAuthorization;