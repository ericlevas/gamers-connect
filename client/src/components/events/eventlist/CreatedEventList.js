import React from 'react';
import CreatedEventItem from '../eventItem/CreatedEventItem.js';

const createdEventList = props => {
    const events = props.events.map(event => {
        return (
            event.creator._id == props.authUserId ?
            (<CreatedEventItem
                key={event._id}
                eventId={event._id}
                title={event.title}
                gameTitle={event.gameTitle}
                start={event.start}
                end={event.end}
                userId={props.authUserId}
                creatorId={event.creator._id}
                onDetail={props.onViewDetail}
            />)  : null );
    });

    return <ul className="events__list">{events}</ul>;

};

export default createdEventList;