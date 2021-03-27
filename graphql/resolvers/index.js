const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Attending = require('../../models/attending');

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        });
        return events;
    } catch (err) {
        throw err;
    }
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id: event.id,
            creator: user.bind(this, event.creator)
        };
    } catch (err) {
        throw err;
    }
};

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    }
};

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });
        } catch (err) {
            throw err;
        }
    },

    attendings: async () => {
        try {
            const attendings = await Attending.find();
            return attendings.map(attending => {
                return {
                    ...attending._doc,
                    _id: attending.id,
                    user: user.bind(this, attending._doc.user),
                    event: singleEvent.bind(this, attending._doc.event),
                    createdAt: new Date(attending.createdAt).toISOString(),
                    updatedAt: new Date(attending.updatedAt).toISOString()
                };
            });
        } catch (err) {
            throw err;
        }
    },

    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            gameTitle: args.eventInput.gameTitle,
            date: new Date(args.eventInput.date),
            creator: '605fb2682b557c53a046bf46'
        });
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            };
            const creator = await User.findById('605fb2682b557c53a046bf46');

            if (!creator) {
                throw new Error('User not found.');
            }
            creator.createdEvents.push(event);
            await creator.save();

            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('User exists already.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });

            const result = await user.save();

            return { ...result._doc, password: null, _id: result.id };
        } catch (err) {
            throw err;
        }
    },

    attendEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const attending = new Attending({
            user: '605fb2682b557c53a046bf46',
            event: fetchedEvent
        });
        const result = await attending.save();
        return {
            ...result._doc,
            _id: result.id,
            user: user.bind(this, attending._doc.user),
            event: singleEvent.bind(this, attending._doc.event),
            createdAt: new Date(result.createdAt).toISOString(),
            updatedAt: new Date(result.updatedAt).toISOString()
        };
    },

    cancelAttending: async args =>{
        try{
            const attending = await Attending.findById(args.attendingId).populate('event');
            const event = {
                ...attending.event._doc,
                _id: attending.event.id,
                creator:user.bind(this,attending.event._doc.creator)
            };
            await Attending.deleteOne({_id: args.attendingId});
            return event;
        }catch(err){
            throw err;
        }
    }
};
