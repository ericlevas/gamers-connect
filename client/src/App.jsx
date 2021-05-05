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
    creating: true,
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

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

  handleDateSelect = (selectInfo) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  handleEventClick = (clickInfo) => {
    //Display popup with event info
    <React.Fragment>
      {(this.state.creating) && <Backdrop />}
      {
        this.state.creating && (
          <Modal
            title="New Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={clickInfo.event.remove()}
            confirmText="Confirm">
            <p> test </p>
          </Modal>)
      }</React.Fragment>
    
    
    //If user is not logged in, no buttons displayed OR inform user to login
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

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
      <i>{event.title}</i>
    </li>
  )
}