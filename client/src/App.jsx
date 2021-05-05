import React from 'react'
import './main.css';
import FullCalendar, { formatDate } from '@fullcalendar/react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import Logo from '../media/logo.png'
import AuthPage from './pages/Auth';
import AttendingPage from './pages/Attending';
import AuthContext from './context/auth-context';
import Dashboard from './pages/Dashboard';
import Modal from './components/modal/Modal';
import Backdrop from './components/backdrop/Backdrop';

export default class App extends React.Component {
  state = {
    token: null,
    userId: null,
    weekendsVisible: true,
    currentEvents: [],
    creating: false,
    viewing: false,
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

  render() {
    return (
      <div className='app'>
        {this.renderSidebar()}
        <div className='app-main'>
          <div className='header'>
            <label>
              <input
                type='checkbox'
                checked={this.state.weekendsVisible}
                onChange={this.handleWeekendsToggle}
              ></input>
            toggle weekends
          </label></div>
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
            initialEvents={INITIAL_EVENTS}
            //events={INITIAL_EVENTS}
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
    )
  }

  /* Sidebar Content */
  renderSidebar() {
    return (
      <div className='app-sidebar'>
        <div className='app-sidebar-section'>
          <h1><img src={Logo} alt="Gamers Connect"></img></h1>
          <hr /><br />
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
                  {this.state.token && <Redirect from="/" to="/dashboard" exact />}
                  {this.state.token && (
                    <Redirect from="/auth" to="/dashboard" exact />
                  )}
                  {!this.state.token && (
                    <Route path="/auth" component={AuthPage} />
                  )}
                  <Route path="/dashboard" component={Dashboard} />
                  {this.state.token && (
                    <Route path="/attending" component={AttendingPage} />
                  )}
                  {!this.state.token && <Redirect to="/auth" exact />}
                </Switch>
              </AuthContext.Provider>
            </React.Fragment>
          </BrowserRouter>

          <h2>All Events ({this.state.currentEvents.length})</h2>
          <ul>
            {this.state.currentEvents.map(renderSidebarEvent)}
          </ul>
        </div>
      </div>
    )
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    })
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, viewing: false, selectedEvent: null });
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

  handleDateSelect = (selectInfo) => {
    if (this.state.token) {
      this.setState({ creating: true });
      //this.setState({ startDate: selectInfo.startStr });
      //this.setState({ endDate: selectInfo.endStr });
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
    if (this.state.token) {
      this.setState({ viewing: true });
    }

    //If user is not logged in, inform user to login
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
