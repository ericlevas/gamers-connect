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
                start={event.start}
                end={event.end}
                userId={props.authUserId}
                creatorId ={event.creator._id}
                onDetail={props.onViewDetail}
            />);
        });

    return <ul className="events__list">{events}</ul>;

};

export default  eventList;