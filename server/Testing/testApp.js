//Setup server
const express = require("express");
 
const app = express()
 
/* More server Logic */
 
 
//Listen on a port
 
const port = process.env.PORT || "4000";
 
app.listen(port);
 
console.log(`🚀 Server ready at http://localhost:${port}/graphql`);