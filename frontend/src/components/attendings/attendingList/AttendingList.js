import React from 'react';
import './AttendingList.css';

const AttendingList= props => (
    <ul className = "attending__list">
        {props.attendings.map(attending=>{
            return (
            <li key = {attending._id} className = "attending__item">
                <div className="attending__item-data">
                    {attending.event.title} - {' '}
                    {new Date(attending.createdAt).toLocaleDateString('en-US')}
                </div>
                <div className ="attending__item-actions">
                    <button className="btn" onClick={props.onDelete.bind(this, attending._id)}>Cancel</button>
                </div>
                
            </li>
            );
        })}
    </ul>   
);


export default AttendingList;