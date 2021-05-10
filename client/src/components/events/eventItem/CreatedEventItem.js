import React from 'react';
import './EventItem.css';

const createdEventItem = props => (
    <li key={props.eventId} className="events__list-item">
    <div>
        {props.title} - {' '}
        {new Date(props.start).toLocaleDateString('en-US')}
    </div>
    </li>
);

export default createdEventItem;