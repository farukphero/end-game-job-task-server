const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8uhbkvb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const postsCollection = client.db("endGameJobTask").collection("posts");
    const commentsCollection = client.db("endGameJobTask").collection("comments");
    const profileCollection = client
      .db("endGameJobTask")
      .collection("profileInfo");

    app.get("/posts", async (req, res) => {
      const query = {};
      const cursor = postsCollection.find(query).sort({ counter: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await postsCollection.findOne(query);
      // const result =  cursor.toArray();
      res.send(cursor);
    });

    app.get("/topPosts", async (req, res) => {
      const query = {};
      const cursor = postsCollection.find(query).limit(3).sort({ counter: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/posts", async (req, res) => {
      const posts = req.body;
      const result = await postsCollection.insertOne(posts);
      res.send(result);
    });
    app.get("/comments/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { newId : id };
      console.log(query)
      const cursor = await commentsCollection.find(query).toArray();
      // const result =  cursor.toArray();
      res.send(cursor);
    });
    app.post("/comments", async (req, res) => {
      const post = req.body;
      const result = await commentsCollection.insertOne(post);
      res.send(result);
    });

    app.put("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const post = req.body;
      // console.log(post)
      const option = { upsert: true };
      const updatedReview = {
        $set: {
          counter: post.count,
          // comment: post.comment
        },
      };
      const result = await postsCollection.updateOne(
        query,
        updatedReview,
        option
      );
      res.send(result);
    });
    // app.get("/profileInfo", async (req, res) => {
    //   const query = {};
    //   const cursor = profileCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result);

    // });
    app.get("/profileInfo", async (req, res) => {
      const email = req.query.email;
      // console.log(email)
      const query = { email: email };
      const cursor = await profileCollection.findOne(query);
      // const result =  cursor.toArray();
      res.send(cursor);
    });

    app.put("/profileInfo/:email", async (req, res) => {
      const verified = req.body;
      const email = verified.email;
      // const filter = {email}
      // const options = {upsert : true};
      // const email = req.query.email;
      const query = { email: email };
      const updateInfo = req.body;
      console.log(email);
      const option = { upsert: true };
      const updatedReview = {
        $set: {
          name: updateInfo.name,
          phone: updateInfo.phone,
          education: updateInfo.education,
          presentDistrict: updateInfo.presentDistrict,
          presentDivision: updateInfo.presentDivision,
          permanentDistrict: updateInfo.permanentDistrict,
          permanentDivision: updateInfo.permanentDivision,
          nationality: updateInfo.nationality,
        },
      };
      const result = await profileCollection.updateOne(
        query,
        updatedReview,
        option
      );
      res.send(result);
    });

    app.post("/profileInfo", async (req, res) => {
      const posts = req.body;
      const result = await profileCollection.insertOne(posts);
      res.send(result);
    });
    // app.post("/profileInfo/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email };
    //   const post = req.body;
    //   // console.log(post)
    //   const option = { upsert: true };
    //   const updatedReview = {
    //     $set: {

    //        counter: post.count,
    //     },
    //   };
    //   const result = await profileCollection.updateOne(query, updatedReview,option);
    //   res.send(result);
    // });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("End game job task running!");
});

app.listen(port, () => {
  console.log(`End game job task running on port ${port}`);
});
