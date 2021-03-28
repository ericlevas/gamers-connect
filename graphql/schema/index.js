const {buildSchema} = require('graphql');

module.exports = buildSchema(`

type Attending{
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type Event{
    _id: ID!
    title: String!
    gameTitle: String!
    description: String!
    date: String!
    creator: User!
}

type User{
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
}

type AuthData{
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

input UserInput{
    email: String!
    password: String!
}

input EventInput{
    title: String!,
    gameTitle: String!,
    description: String!,
    date: String!
}

type RootQuery{
    events: [Event!]!
    attendings: [Attending!]!
    login(email: String!,password:String!): AuthData!
}
type RootMutation{
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    attendEvent(eventId: ID): Attending!
    cancelAttending(attendingId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
