import React, { Component } from 'react';
import FullCalendar, { formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { INITIAL_EVENTS, createEventId } from '../event-utils'
import AuthContext from '../context/auth-context';

export default class Calendar extends Component {
    state = {
        weekendsVisible: true,
        currentEvents: [],
        creating: false,
        viewing: false,
    };

    render() {
        return (
            <div>
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
        );
    }

    handleWeekendsToggle = () => {
        this.setState({
            weekendsVisible: !this.state.weekendsVisible
        })
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