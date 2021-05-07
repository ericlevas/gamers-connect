import React from 'react'
import './main.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthPage from './pages/Auth';
import AttendingPage from './pages/Attending';
import AuthContext from './context/auth-context';
import EventPage from './pages/Events';

export default class App extends React.Component {
  state = {
    token: null,
    userId: null,    
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <div>
        <BrowserRouter>
          <React.Fragment>
            <AuthContext.Provider value={{
              token: this.state.token,
              userId: this.state.userId,
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
                <Route path="/events" component={EventPage} />
                {this.state.token && (
                  <Route path="/attending" component={AttendingPage} />
                )}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </AuthContext.Provider>
          </React.Fragment>
        </BrowserRouter>
      </div>
    )
  }
}
