import React from 'react'
import './main.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthPage from './pages/Auth';
import AttendingPage from './pages/Attending';
import AuthContext from './context/auth-context';
import EventPage from './pages/Events';

export default class App extends React.Component {
  state = {
    token: this.context.token,
    userId: this.context.userId,
    email: this.context.email,
    isAuthenticated: this.context.isAuthenticated,
  };

  login = (token, userId, email, tokenExpiration) => {
    this.setState({ token: token, userId: userId, email: email, isAuthenticated: true });
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("email", email);
    localStorage.setItem("isAuthenticated", true);
  };

  logout = () => {
    this.setState({ token: null, userId: null, email: null, isAuthenticated: false });
    localStorage.clear();
  };

  static contextType = AuthContext;

  render() {
    return (
      <div>
        <BrowserRouter>
          <React.Fragment>
            <AuthContext.Provider value={{
              token: this.state.token,
              userId: this.state.userId,
              email: this.state.email,
              isAuthenticated: this.state.isAuthenticated,
              login: this.login,
              logout: this.logout
            }}>
              <Switch>
                <Route path="auth">
                  <AuthPage />
                </Route>
                {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && (
                  <Redirect from="/auth" to="/events" exact />
                )}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}
                {this.state.token && (
                  <Route path="/events" component={EventPage} />
                )}
                {this.state.token && (
                  <Route path="/attending" component={AttendingPage} />
                )}
                {!this.state.token && <Redirect to="/auth" exact />}
                {this.state.token && <Redirect from="/events" to="/events" exact />}
              </Switch>
            </AuthContext.Provider>
          </React.Fragment>
        </BrowserRouter>
      </div>
    )
  }
}
