import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Logo from '../../media/logo.png'
import Modal from '../components/modal/Modal';
import Backdrop from '../components/backdrop/Backdrop';
import Calendar from './Calendar';

export default class AuthPage extends Component {

    state = {
        isLogin: true,
        flag: '',
        title: 'Log in',
        weekendsVisible: true,
        currentEvents: [],
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            if (this.state.title == 'Log in') {
                this.setState({ title: 'Sign up' });
            }
            else {
                this.setState({ title: 'Log in' });
            }
            return { isLogin: !prevState.isLogin };
        });
    };

    submitHandler = (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
                query Login($email: String!, $password: String!){
                    login(email: $email,password: $password)
                    {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `,
            variables: {
                email: email,
                password: password
            }
        };

        if (!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation CreateUser($email: String!, $password: String!){
                        createUser(userInput: {email: $email, password: $password})
                        {
                            _id
                            email
                        }
                    }
                `,
                variables: {
                    email: email,
                    password: password
                }
            };

        }
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    this.setState({ flag: 'Please try again. ' });
                    throw new Error('Failed');
                }
                return res.json();
            })
            .then(resData => {
                if (resData.data.login) {
                    this.context.login(
                        resData.data.login.token,
                        resData.data.login.userId,
                        resData.data.login.tokenExpiration
                    );
                }
                else if (resData.data.createUser) {
                    this.loginMethod(email, password);
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    loginMethod(email, password) {
        let requestBody = {
            query: `
                query Login($email: String!, $password: String!){
                    login(email: $email,password: $password)
                    {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `,
            variables: {
                email: email,
                password: password
            }
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    this.setState({ flag: 'Please try again. ' });
                    throw new Error('Failed');
                }
                return res.json();
            })
            .then(resData => {
                if (resData.data.login) {
                    this.context.login(
                        resData.data.login.token,
                        resData.data.login.userId,
                        resData.data.login.tokenExpiration
                    );
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        return (
            <div className='app'>
                <div className='app-sidebar'>
                    <div className='app-sidebar-section'>
                        <h1><img src={Logo} alt="Gamers Connect"></img></h1>
                        <hr /><br />
                        <div>
                            <h2>{this.state.title}</h2>
                            <form onSubmit={this.submitHandler}>
                                <input type="text" className="form-control" placeholder="Email" ref={this.emailEl} />
                                <input type="password" className="form-control" placeholder="Password" ref={this.passwordEl} />
                                <br />
                                {this.state.flag}
                                Forgot <a href="forgot_password.html" className="a">Password?</a>
                                <br /><br />
                                <button type="submit" className="submit-button">Submit</button>
                                <div className="divider" />
                                <button type="button" className="signup-button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
                            </form>
                            <br /><hr /><br />
                            <h2>Instructions:</h2>
                            <ul>
                                <li>Create an account or log in to create or view groups</li>
                                <li>Select a date and you will be prompted to create a new group</li>
                                <li>Select an event to view its details, delete, or join it</li>
                                <li>When in week or day view, drag and drop to create events</li>
                                
                            </ul><hr /><br />
                        </div>
                    </div>
                </div>

                <div className='app-main'>
                    <Calendar />
                    {(this.state.creating) && <Backdrop />}
                    {this.state.creating && (
                        <Modal
                            title="New Event"
                            canCancel
                            canConfirm
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.modalConfirmHandler}
                            confirmText="Confirm"
                        >
                            <form>
                                <div className="form-control">
                                    <label htmlFor="title">Title</label>
                                    <input type="text" id="title" ref={this.titleEl}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="gameTitle">Game Title</label>
                                    <input type="text" id="gameTitle" ref={this.gameTitleEl}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="start">Date</label>
                                    <input type="datetime-local" id="start" ref={this.startEl}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="end">Date</label>
                                    <input type="datetime-local" id="end" ref={this.endEl}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="description">description</label>
                                    <textarea id="description" rows="4" ref={this.descriptionEl}></textarea>
                                </div>
                            </form>
                        </Modal>
                    )}
                    {(this.state.viewing) && <Backdrop />}
                    {
                        this.state.viewing && (
                            <Modal
                                title="Event Name"
                                canCancel
                                canConfirm
                                onCancel={this.modalCancelHandler}
                                onConfirm={this.attendHandler}
                                confirmText="Confirm"
                            >
                                <p>Would you like to join this event?</p>
                            </Modal>
                        )}
                </div>
            </div>
        );
    }
}