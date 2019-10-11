import React, { Fragment, useEffect, useState, useContext } from 'react';
import { Redirect } from '@reach/router';
import { Spin } from 'antd';
import { AuthUserContext } from '../containers/Authentication';
import * as ROUTES from '../constants/routes';

export default () => {
  const authUser = useContext(AuthUserContext);
  const [showLoading, setShowLoading] = useState(true);
  useEffect(
    () => {
      const timer = setTimeout(() => setShowLoading(false), 2500);

      // this will clear Timeout when component unmont like in willComponentUnmount
      return () => {
        clearTimeout(timer)
      }
    },
    [] // useEffect will run only one time
  );
  return (
    <Fragment>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        height: '100vh',
        paddingTop: '25vh'
      }}>
        {showLoading && <Spin size='large' />}
      </div>
      {!showLoading && !authUser && <Redirect noThrow to={ROUTES.SIGN_IN} />}
      {!showLoading && authUser && <Redirect noThrow to={ROUTES.DISCIPLINES} />}
    </Fragment>
  )
};