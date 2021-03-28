const Event = require('../../models/event');
const User = require('../../models/user')
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
            date: new Date(args.eventInput.date),
            creator: '605fd08c9dfb91a74434990d'
        });
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = transformEvent(result);

            const creator = await User.findById('605fd08c9dfb91a74434990d');
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