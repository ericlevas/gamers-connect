import React, { Component } from 'react';
import Modal from '../components/modal/Modal';
import Backdrop from '../components/backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/events/eventlist/EventList';
import Spinner from '../components/spinner/Spinner';

class EventPage extends Component {
    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null
    };
    isActive = true;

    constructor(props) {
        super(props);
        this.titleEl = React.createRef();
        this.gameTitleEl = React.createRef();
        this.startDateEl = React.createRef();
        this.endDateEl = React.createRef();
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
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                    query{
                        events{
                            _id
                            title
                            description
                            gameTitle
                            startDate
                            endDate
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
                this.setState({ events: events, isLoading: false });
            })
            .catch(err => {
                console.log(err);
                this.setState({ isLoading: false });
            });

    };

    modalConfirmHandler = () => {
        this.setState({ creating: false });
        const title = this.titleEl.current.value;
        const gameTitle = this.gameTitleEl.current.value;
        const startDate = this.startDateEl.current.value;
        const endDate = this.endDateEl.current.value;
        const description = this.descriptionEl.current.value;
        //const event = { title, gameTitle, date, description };

        if (title.trim().length === 0 || gameTitle.trim().length === 0 || this.startDateEl.current.value.trim().length === 0 || this.startDateEl.current.value.trim().length === 0 || description.trim().length === 0) {
            return;
        }

        const requestBody = {
            query: `
                    mutation CreateEvent($title: String!, $description: String!,$gameTitle: String!,$startDate: String!,$endDate: String!){
                        createEvent(eventInput:{
                            title: $title,
                            gameTitle: $gameTitle,
                            description: $description,
                            startDate: $startDate,
                            endDate: $endDate,
                        })
                        {
                            _id
                            title
                            description
                            startDate
                            endDate
                            creator{
                                _id
                                email
                            }
                        }
                    }
                `,
            variables: {
                title: title,
                description: description,
                gameTitle: gameTitle,
                startDate: startDate,
                endDate: endDate
            }
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
                this.setState(prevState => {
                    const updatedEvents = [...prevState.events];
                    updatedEvents.push({
                        _id: this.context.userId,
                        title: resData.data.createEvent.title,
                        description: resData.data.createEvent.description,
                        startDate: resData.data.createEvent.startDate,
                        endDate: resData.data.createEvent.endDate,
                        creator: {
                            _id: this.context.userId,
                        }
                    });
                    return { events: updatedEvents };
                });
            })
            .catch(err => {
                console.log(err);
            });

    };

    modalCancelHandler = () => {
        this.setState({ creating: false, selectedEvent: null });
    };

    showDetailHandler = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId);
            return { selectedEvent: selectedEvent };
        });
    };

    attendHandler = () => {
        if (!this.context.token) {
            this.setState({ selectedEvent: null });
            return;
        }
        const requestBody = {
            query: `
                    mutation AttendEvent($id: ID!){
                        attendEvent(eventId: $id){
                            _id
                            createdAt
                            updatedAt
                        }
                    }
                `,
            variables: {
                id: this.state.selectedEvent._id
            }
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed');

                }
                return res.json();
            })
            .then(resData => {
                console.log(resData);
                this.setState({ selectedEvent: null });

            })
            .catch(err => {
                console.log(err);
            });

    }

    render() {
        return (
            <React.Fragment>
                {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
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
                                <label htmlFor="startDate">Date</label>
                                <input type="datetime-local" id="startDate" ref={this.startDateEl}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="endDate">Date</label>
                                <input type="datetime-local" id="endDate" ref={this.endDateEl}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">description</label>
                                <textarea id="description" rows="4" ref={this.descriptionEl}></textarea>
                            </div>
                        </form>
                    </Modal>
                )}
                {this.state.selectedEvent &&
                    (<Modal
                        title={this.state.selectedEvent.title}
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.attendHandler}
                        confirmText={this.context.token ? 'Join' : 'Confirm'}
                    >
                        <h1>{this.state.selectedEvent.title}</h1>
                        <h2>{this.state.selectedEvent.gameTitle}- {new Date(this.state.selectedEvent.date).toLocaleDateString('en-US')}</h2>
                        <p>{this.state.selectedEvent.description}</p>
                    </Modal>)
                }

                {this.context.token && (<div className="events-control">
                    <p>Share your own Events!</p>
                    <button className="submit-button" onClick={this.startCreateEventHandler}>
                        Create Event
              </button>
                </div>)}
                {this.state.isLoading ?
                    (<Spinner />)
                    :
                    (<EventList
                        events={this.state.events}
                        authUserId={this.context.userId}
                        onViewDetail={this.showDetailHandler}
                    />)
                }
            </React.Fragment>
        );
    }
}

export default EventPage;