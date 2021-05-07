import React, { Component } from 'react';
import FullCalendar, { formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import AuthContext from '../context/auth-context';

export default class Calendar extends Component {
    state = {
        weekendsVisible: true,
        events: [],
        creating: false,
        viewing: false,
    };
    isActive = true;

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
                    events={this.state.events}
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
        let calendarApi = selectInfo.view.calendar;
        if (this.state.token) {
            this.setState({ creating: true });
            //this.setState({ start: selectInfo.startStr });
            //this.setState({ end: selectInfo.endStr });
        }
        else {
            alert('Please login to create an event.')
        }
        calendarApi.unselect() // clear date selection
    }

    handleEventClick = (clickInfo) => {
        if (this.context.token) {
            this.setState({ viewing: true });
        }
        else {
            alert('Please login to view an event.')
        }

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