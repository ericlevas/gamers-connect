const Attending = require('../../models/attending');
const Event = require('../../models/event');
const {transformAttending,transformEvent} = require('./merge');

module.exports = {
    attendings: async (args,req) => {
        if(!req.isAuth){
            throw new Error('User is not authenticated!');
        }
        try {
            const attendings = await Attending.find({user: req.userId});
            return attendings.map(attending => {
                return transformAttending(attending);
            });
        } catch (err) {
            throw err;
        }
    },

    attendEvent: async (args,req) => {
        if(!req.isAuth){
            throw new Error('User is not authenticated!');
        }
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const attending = new Attending({
            user: req.userId,
            event: fetchedEvent
        });
        const result = await attending.save();
        return transformAttending(result);
    },

    cancelAttending: async (args,req) =>{
        if(!req.isAuth){
            throw new Error('User is not authenticated!');
        }
        try{
            const attending = await Attending.findById(args.attendingId).populate('event');
            const event = transformEvent(attending.event);
            await Attending.deleteOne({_id: args.attendingId});
            return event;
        }catch(err){
            throw err;
        }
    }
};
