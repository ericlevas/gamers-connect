const authResolver = require('./auth');
const eventsResolver = require('./events');
const attendingResolver = require('./attendings');

const rootResolver = {
    ...authResolver,
    ...eventsResolver,
    ...attendingResolver
};

module.exports = rootResolver;