import React from 'react';
import './AttendingList.css';

const AttendingList= props => (
    <ul>
        {props.attendings.map(attending=>{
            return (
            <li key = {attending._id} className = "attending__item">
                <div className="attending__item-data">
                    {attending.event.title} - {' '}
                    {new Date(attending.event.start).toLocaleDateString('en-US')}
                </div>
                <div className ="attending__item-actions">
                    <button className="attending-button" onClick={props.onDelete.bind(this, attending._id)}>Leave</button>
                </div>
            </li>
            );
        })}
    </ul>   
);

export default AttendingList;