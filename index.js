const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pyjfh6u.mongodb.net/portfolio`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const projectCollection = client.db("portfolio").collection("projects");

    app.post("/projects", async (req, res) => {
      const project = req.body;
      const result = await projectCollection.insertOne(project);
      return res.send(result);
    });

    app.get("/projects", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 6;

      const skip = (page - 1) * perPage;

      const result = await projectCollection

        .find()
        .skip(skip)
        .limit(perPage)
        .toArray();

      return res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
