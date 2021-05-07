import React, { Component } from 'react';
import Modal from '../components/modal/Modal';
import Backdrop from '../components/backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/events/eventlist/EventList';
import Spinner from '../components/spinner/Spinner';
import { Redirect } from 'react-router-dom';
import Logo from '../../media/logo.png'
import FullCalendar, { formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default class EventPage extends Component {
    state = {
        creating: false,
        viewing: false,
        events: [],
        isLoading: false,
        selectedEvent: null,
        weekendsVisible: true,
        startD: null,
        endD: null,
    };
    isActive = true;

    constructor(props) {
        super(props);
        this.titleEl = React.createRef();
        this.gameTitleEl = React.createRef();
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
                            start
                            end
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
        const start = this.state.startD;
        const end = this.state.endD;
        const description = this.descriptionEl.current.value;
        //const event = { title, gameTitle, date, description };

        if (title.trim().length === 0 || gameTitle.trim().length === 0 || description.trim().length === 0) {
            return;
        }

        const requestBody = {
            query: `
                    mutation CreateEvent($title: String!, $description: String!,$gameTitle: String!,$start: String!,$end: String!){
                        createEvent(eventInput:{
                            title: $title,
                            gameTitle: $gameTitle,
                            description: $description,
                            start: $start,
                            end: $end,
                        })
                        {
                            _id
                            title
                            description
                            start
                            end
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
                start: start,
                end: end
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
                        start: resData.data.createEvent.start,
                        end: resData.data.createEvent.end,
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
        this.setState({ creating: false, selectedEvent: null, viewing: false });
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
            <div className='app'>
                <div className='app-sidebar'>
                    <div className='app-sidebar-section'>
                        <h1><img src={Logo} alt="Gamers Connect"></img></h1>
                        <hr /><br />
                        <React.Fragment>
                            <AuthContext.Consumer>
                                {(context) => {
                                    return (
                                        <nav className="main-navigation-items">
                                            {!context.token && <Redirect to="/auth" exact />}
                                            {context.token &&
                                                <React.Fragment>
                                                    <h2>Welcome to Gamers Connect!</h2>
                                                    <p className="login-email">You are logged in.</p>
                                                    <button type="button" className="submit-button" onClick={this.manageAccount}>Manage Account</button>
                                                    <div className="divider" />
                                                    <button className="signup-button" onClick={context.logout}>Logout</button>
                                                    <br /><br />
                                                </React.Fragment>
                                            }
                                            <hr />
                                        </nav>
                                    );
                                }}
                            </AuthContext.Consumer>
                        </React.Fragment >
                        <React.Fragment>
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

                            <br /><h2>All Events</h2>
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
                    </div>
                </div>
                <div className='app-main'>
                    <div className='header'>
                        <label>
                            <input
                                type='checkbox'
                                checked={this.state.weekendsVisible}
                                onChange={this.handleWeekendsToggle}
                            ></input>
                        toggle weekends
                        </label>
                    </div>

                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        initialView='dayGridMonth'
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        weekends={this.state.weekendsVisible}
                        events={this.state.events}
                        select={this.handleDateSelect}
                        eventContent={renderEventContent}
                        eventClick={this.handleEventClick}
                        eventsSet={this.handleEvents}
                    //eventAdd={function(){}}
                    //eventChange={function(){}}
                    //eventRemove={function(){}}
                    />
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

    handleWeekendsToggle = () => {
        this.setState({
            weekendsVisible: !this.state.weekendsVisible
        })
    }
    
    handleDateSelect = (selectInfo) => {
        if (this.context.token) {
            this.setState({ creating: true });
            this.setState({ startD: selectInfo.startStr });
            this.setState({ endD: selectInfo.endStr });
        }
        else {
            alert('Please login to create an event.')
        }
        //let title = prompt('Please enter a new title for your event')

        let calendarApi = selectInfo.view.calendar;
        calendarApi.unselect() // clear date selection

        // if (title) {
        //   calendarApi.addEvent({
        //     id: createEventId(),
        //     title,
        //     start: selectInfo.startStr,
        //     end: selectInfo.endStr,
        //     allDay: selectInfo.allDay
        //   })
        // }
    }

    handleEventClick = (clickInfo) => {
        if (this.context.token) {
            this.setState({ viewing: true });
        }
        else {
            alert('Please login to view an event.')
        }

        //Conditional: If !token

        //If user is event owner, include delete button
        //Conditional: If token && (userID == creatorID)
        //if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        //clickInfo.event.remove()
        //Update events database and attending database

        //If user is not event owner or member of group, include join button
        //Conditional: If token && (userID != creatorID) && !attending
        //Update attending database

        //If user is not event owner but is member of group, include leave button
        //Conditional: If token && (userID != creatorID) && attending
        //Update attending database

        //}
    }

    handleEvents = (events) => {
        this.setState({
            currentEvents: events
        })
    }
}

function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    )
}

function renderSidebarEvent(event, token) {
    return (
        <li key={event.id}>
            <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
            <i>{event.title}</i>
        </li>
    )
}