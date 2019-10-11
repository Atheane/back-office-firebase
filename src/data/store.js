import React, { useState } from 'react';

export const StoreContext = React.createContext(null);

const initStore = {
  rememberMe: false
};

export default ({ children }) => {
  const [data, handleChange] = useState(initStore);

  const store = {
    data,
    handleChange,
  };

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}
