const express = require("express");
const { graphqlHTTP } = require('express-graphql');
const schema = require("../graphql/schema/index");
const resolvers = require("../graphql/resolvers/index");
const { startDatabase } = require("./testDb");
const expressPlayground = require("graphql-playground-middleware-express")
  .default;
 
// Create a context for holding contextual data (db info in this case)
const context = async () => {
  const db = await startDatabase();
 
  return { db };
};
 
const app = express();
 
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    context,
  })
);
 
//Graphql Playground route
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));
 
module.exports = app;