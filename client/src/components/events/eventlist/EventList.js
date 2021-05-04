import React from 'react';
import EventItem from '../eventItem/EventItem.js'

const eventList = props=> {
    const events = props.events.map(event => {
            return (
            <EventItem 
                key = {event._id} 
                eventId ={event._id} 
                title={event.title}
                gameTitle ={event.gameTitle} 
                startDate={event.startDate}
                endDate={event.endDate}
                userId={props.authUserId}
                creatorId ={event.creator._id}
                onDetail={props.onViewDetail}
            />);
        });

    return <ul className="events__list">{events}</ul>;

};

export default  eventList;