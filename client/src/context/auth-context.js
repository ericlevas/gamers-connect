import React from 'react';

export default React.createContext({
    token: null,
    userId: null,
    email: null,
    isAuthenticated: false,
    login: (token,userId,email,tokenExpiration) =>{},
    logout: () =>{}
});
