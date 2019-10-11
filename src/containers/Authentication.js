import React, { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../data/context';
import { StoreContext } from '../data/store';

export const AuthUserContext = React.createContext(null);

export default ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const firebase = useContext(FirebaseContext);
  const { data: { rememberMe } } = useContext(StoreContext);
  useEffect(() => {
    if (!localStorage.getItem('themakery-user')) {
      firebase.onAuthUserListener(
        user => {
          console.log('store.rememberMe', rememberMe);
          if (rememberMe) localStorage.setItem('themakery-user', JSON.stringify(user));
          setAuthUser(user);
        },
        () => {
          localStorage.removeItem('themakery-user');
          setAuthUser(null);
        }
      )
    } else {
      setAuthUser(JSON.parse(localStorage.getItem('themakery-user')));
      // if non-admin is redirected to sign-in
      firebase.onAuthUserListener(
        user => {
          if (rememberMe) localStorage.setItem('themakery-user', JSON.stringify(user));
          setAuthUser(user);
        },
        () => {
          localStorage.removeItem('themakery-user');
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
