import React from 'react';
import './EventItem.css';

const eventItem = props => (
    <li key={props.eventId} className="events__list-item">
    <div>
        {props.title} - {' '}
        {new Date(props.start).toLocaleDateString('en-US')}
    </div>
    <div>
        {props.userId === props.creatorId ? 
        (<p>Your event</p>): 
        (<button className="event-button" onClick={props.onDetail.bind(this,props.eventId)}>
            View Details
            </button>)
        }
        
    </div>
    </li>
);

export default eventItem;