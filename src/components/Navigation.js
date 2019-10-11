import React, { useContext } from 'react';
import { Link } from "@reach/router"
import { Icon } from 'antd';
import SignOutButton from './SignOut';
import { AuthUserContext } from '../containers/Authentication';
import { useResize } from '../hooks/customHooks';
import * as ROUTES from '../constants/routes';

const Navigation = () => {
  const authUser = useContext(AuthUserContext);
  return (
    authUser ? <NavigationAuth /> : null
  )
}

const NavigationAuth = () => {
  const [innerWidth, ] = useResize(900);

  return (
    <div style={{display: 'flex', justifyContent: 'space-around'}}>
      {/* <Link to={ROUTES.ACCOUNT} style={{textDecoration: 'none', color: 'white', textAlign: 'right'}}>
        {innerWidth < 520 ? <Icon type="user" />: <div style={{ paddingRight: '10px', fontSize: '12px' }}> Compte </div>}
      </Link> */}
      <SignOutButton />
    </div>
  )
};

export default Navigation;