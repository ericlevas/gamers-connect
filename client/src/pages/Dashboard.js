import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import { Redirect } from 'react-router-dom';

// Renders sidebar after successful login
class Dashboard extends Component {

    manageAccount = () => {

    }

    render() {
        return (
            <React.Fragment>
                <AuthContext.Consumer>
                    {(context) => {
                        return (
                            <nav className="main-navigation-items">
                                {!context.token && <Redirect to="/auth" exact />}
                                {context.token &&
                                    <React.Fragment>
                                        <h2>Welcome to Gamers Connect!</h2>
                                        <p className="login-email">You are logged in as -email-.</p>
                                        <button type="button" className="submit-button" onClick={this.manageAccount}>Manage Account</button>
                                        <div className="divider" />
                                        <button className="signup-button" onClick={context.logout}>Logout</button>
                                        <br /><br />
                                        
                                    </React.Fragment>
                                }
                                <hr /><br />
                                <h2>Instructions:</h2>
                                <ul>
                                    <li>Select dates and you will be prompted to create a new event</li>
                                    <li>Drag, drop, and resize events</li>
                                    <li>Click an event to delete it</li>
                                </ul><hr /><br />
                            </nav>
                        );
                    }}
                </AuthContext.Consumer>
            </React.Fragment >
        );
    }
}

export default Dashboard;