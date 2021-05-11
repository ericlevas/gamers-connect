import React from 'react';

export default React.createContext({
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
    email: localStorage.getItem("email"),
    isAuthenticated: localStorage.getItem("isAuthenticated"),
    
    login: (token,userId,email,tokenExpiration) =>{},
    logout: () =>{}

});
