const Event = require('../../models/event');
const User = require('../../models/user');
const Attending = require('../../models/attending');
const { transformEvent } = require('./merge');


module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args,req) => {
        if(!req.isAuth){
            throw new Error('User is not authenticated!');
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            gameTitle: args.eventInput.gameTitle,
            start: new Date(args.eventInput.start),
            end: new Date(args.eventInput.end),
            creator: req.userId
        });
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = transformEvent(result);

            const creator = await User.findById(req.userId);
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
    }  

};