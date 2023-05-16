// mongodb
const userName = "cmsc"
const password = "1234"
const databaseAndCollection = {db: "CMSC335_DB", collection: "final"};

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${userName}:${password}@cluster0.xuezueb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
(async function() {
    await client.connect();
})();

// express
const express = require("express");   /* Accessing express module */
const app = express();  /* app is a request handler function */
app.listen(4000);

const path = require("path");
/* directory where templates will reside */
app.set("views", path.resolve());

/* view/templating engine */
app.set("view engine", "ejs");

// bodyparser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));

// get results from database
function result(data) {
    let html = "";
    data.forEach(e => html += e.option + ": " + e.votes + " votes received <br>");
    return html;
}

// endpoints
app.get("/", (request, response) => {
    const variables = {
        content: ""
    }
    response.render("page", variables);
});

// display results on main page under voting
app.post("/", async (request, response) => {
    let entry = request.body.option;
    if (entry == 1) {
        entry = {option: "md"};
    } else if (entry == 2) {
        entry = {option: "nm"};
    }
    try {
        // update entry with incremented counter
        const update = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).updateOne(entry, { $inc: { votes: 1 }});
        let filter = {};
        const results = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).find(filter).toArray();
        const variables = {
            content: result(results)
        }
        response.render("page", variables);
    } catch (e) {
        console.error(e);
    }
});