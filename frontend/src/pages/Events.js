import React, { Component } from 'react';
import Modal from '../components/modal/Modal';
import './Events.css';
import Backdrop from '../components/backdrop/Backdrop';
import AuthContext from '../context/auth-context';


class EventPage extends Component {
    state = {
        creating: false,
        events: []
    };


    constructor(props) {
        super(props);
        this.titleEl = React.createRef();
        this.gameTitleEl = React.createRef();
        this.dateEl = React.createRef();
        this.timeEl = React.createRef();
        this.descriptionEl = React.createRef();

    }

    componentDidMount() {
        this.fetchEvents();
    }

    static contextType = AuthContext;

    startCreateEventHandler = () => {
        this.setState({ creating: true });
    };

    fetchEvents() {
        const requestBody = {
            query: `
                    query{
                        events{
                            _id
                            title
                            description
                            gameTitle
                            date
                            creator{
                                _id
                                email
                            }
                        }
                    }
                `
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
                const events = resData.data.events;
                this.setState({ events: events });
            })
            .catch(err => {
                console.log(err);
            });

    };


    modalConfirmHandler = () => {
        this.setState({ creating: false });
        const title = this.titleEl.current.value;
        const gameTitle = this.gameTitleEl.current.value;
        const date = this.dateEl.current.value;
        const description = this.descriptionEl.current.value;
        const event = { title, gameTitle, date, description };

        if (title.trim().length === 0 || gameTitle.trim().length === 0 || this.dateEl.current.value.trim().length === 0 || description.trim().length === 0) {
            return;
        }

        const requestBody = {
            query: `
                    mutation{
                        createEvent(eventInput:{
                            title: "${title}",
                            gameTitle: "${gameTitle}",
                            description: "${description}",
                            date: "${date}",
                        })
                        {
                            _id
                            title
                            description
                            date
                            creator{
                                _id
                                email
                            }
                        }
                    }
                `
        };

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed');

                }
                return res.json();
            })
            .then(resData => {
                this.fetchEvents();
            })
            .catch(err => {
                console.log(err);
            });

    };

    modalCancelHandler = () => {
        this.setState({ creating: false });
    };

    render() {
        const eventList = this.state.events.map(event => {
            return <li key={event._id} className="events__list-item">{event.title}</li>;
        });

        return (
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {this.state.creating && (
                    <Modal
                        title="Add Event"
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
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
                                <label htmlFor="date">Date</label>
                                <input type="datetime-local" id="date" ref={this.dateEl}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">description</label>
                                <textarea id="description" rows="4" ref={this.descriptionEl}></textarea>
                            </div>
                        </form>
                    </Modal>
                )}
                {this.context.token && <div className="events-control">
                    <p>Share your own Events!</p>
                    <button className="btn" onClick={this.startCreateEventHandler}>
                        Create Event
              </button>
                </div>}
                <ul className="events__list">{eventList}</ul>
            </React.Fragment>
        );
    }
}

export default EventPage;