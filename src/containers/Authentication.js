import React, { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../data/context';
import { StoreContext } from '../data/store';

export const AuthUserContext = React.createContext(null);

export default ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const firebase = useContext(FirebaseContext);
  const { data: { rememberMe } } = useContext(StoreContext);
  useEffect(() => {
    if (!localStorage.getItem('mulmug-user')) {
      firebase.onAuthUserListener(
        user => {
          console.log('store.rememberMe', rememberMe);
          if (rememberMe) localStorage.setItem('mulmug-user', JSON.stringify(user));
          setAuthUser(user);
        },
        () => {
          localStorage.removeItem('mulmug-user');
          setAuthUser(null);
        }
      )
    } else {
      setAuthUser(JSON.parse(localStorage.getItem('mulmug-user')));
      // if non-admin is redirected to sign-in
      firebase.onAuthUserListener(
        user => {
          if (rememberMe) localStorage.setItem('mulmug-user', JSON.stringify(user));
          setAuthUser(user);
        },
        () => {
          localStorage.removeItem('mulmug-user');
          setAuthUser(null);
        }
      )
    }
  }, [])

  return (
    <AuthUserContext.Provider value={authUser}>
      {children}
    </AuthUserContext.Provider>
  );
}
