import React from 'react';
// import { Router } from '@reach/router';
import { compose } from 'recompose';

// import { withAuthorization, withEmailVerification } from '../Session';
import withAuthorization from '../containers/Authorization';
import UserList from '../components/UserList';
import * as ROLES from '../constants/roles';

const AdminPage = () => (
  <div style={{ height: '81vh' }}>
    <UserList />
  </div>
);

const condition = authUser => {
  return authUser && authUser.roles === ROLES.ADMIN;
}
  
export default compose(
  // withEmailVerification,
  withAuthorization(condition),
)(AdminPage);