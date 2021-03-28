import './App.css';
import React,{Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventPage from './pages/Events';
import AttendingPage from './pages/Attending';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Redirect from="/" to="/auth" exact />
          <Route path="/auth" component={AuthPage} />
          <Route path="/events" component={EventPage} />
          <Route path="/attending" component={AttendingPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
