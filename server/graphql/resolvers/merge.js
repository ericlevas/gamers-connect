const DataLoader = require('dataloader');
const Event = require('../../models/event');
const User = require('../../models/user');
const {dateToString} = require('../../utils/date');

const eventLoader = new DataLoader((eventIds) =>{
    return events(eventIds);
});

const userLoader = new DataLoader((userIds) =>{
    return User.find({_id: {$in: userIds}});
});


const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });

        events.sort((a,b) =>{
            //make sure to sort the events in the correct index order.
            return eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString()
            );
        });  
        return events.map(event => {
            return transformEvent(event);
        });
    } catch (err) {
        throw err;
    }
};

const singleEvent = async eventId => {
    try {
        const event = await eventLoader.load(eventId.toString());
        return event;
    } catch (err) {
        throw err;
    }
};

const user = async userId => {
    try {
        const user = await userLoader.load(userId.toString());
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    }
};


const transformEvent = event =>{
    return{
        ...event._doc,
        _id: event.id,
        start: dateToString(event._doc.start),
        end: dateToString(event._doc.end),
        creator: user.bind(this, event.creator)
    };  
};


const transformAttending = attending =>{
    return{
        ...attending._doc,
        _id: attending.id,
        user: user.bind(this, attending._doc.user),
        event: singleEvent.bind(this, attending._doc.event),
        createdAt: dateToString(attending.createdAt),
        updatedAt: dateToString(attending.updatedAt)
    };
};

exports.transformEvent = transformEvent;
exports.transformAttending = transformAttending;
