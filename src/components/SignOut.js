import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import { Icon } from 'antd';

import { useResize } from '../hooks/customHooks';
import { withFirebase } from '../data/context';

import * as ROUTES from '../constants/routes';


const SignOutButton = ({ firebase }) => {
  const [innerWidth, ] = useResize(900);
  return (
    <Link to={ROUTES.SIGN_IN} onClick={firebase.doSignOut} style={{textDecoration: 'none', color: 'white', textAlign: 'right'}}>
      {innerWidth < 520 ? <Icon type="logout" /> : <div style={{ paddingRight: '10px', fontSize: '12px'}}> LogOut </div>}
    </Link>
  )
}


export default withFirebase(SignOutButton);

SignOutButton.propTypes = {
  firebase: PropTypes.object.isRequired,
};
