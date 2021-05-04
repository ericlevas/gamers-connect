import React, { Component } from 'react';
//import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {

    state = {
        isLogin: true
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState => {
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
            <form onSubmit={this.submitHandler}>
                <input type="text" className="form-control" placeholder="Email" ref={this.emailEl} />
                <input type="password" className="form-control" placeholder="Password" ref={this.passwordEl} />
                <br />
                Forgot <a href="forgot_password.html" className="a">Password?</a>
                <br /><br />
                <button type="submit" className="submit-button">Submit</button>
                <div className="divider" />
                <button type="button" className="signup-button" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
            </form>
        );
    }
}

export default AuthPage;