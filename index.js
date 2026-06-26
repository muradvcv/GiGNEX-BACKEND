const express = require('express');
const cors = require('cors')
const app = express()
const port = 5000
require('dotenv').config()
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World! server is running')
})


// mondodb drivers codes

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGO_DB_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();



    const myDB = client.db("gignex_db");
    const taskCollection = myDB.collection("tasks");
    const userCollection = myDB.collection("user");
    const proposalCollection = myDB.collection("proposal")


    // post proposal
    // post proposal
    app.post("/api/proposal", async (req, res) => {
      try {
        const proposal = req.body;

        // basic validation (important)
        if (!proposal || !proposal.taskId || !proposal.clientId) {
          return res.status(400).send({
            success: false,
            message: "taskId and clientId required",
          });
        }

        const newProposal = {
          ...proposal,
          status: "pending", // default status (VERY IMPORTANT)
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await proposalCollection.insertOne(newProposal);

        res.send({
          success: true,
          message: "Proposal created successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: "Server error",
          error: error.message,
        });
      }
    });


    // get one freelancer
    app.get("/api/freelancers/:id", async (req, res) => {
      try {
        const freelancer = await userCollection.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!freelancer) {
          return res.status(404).send({
            message: "Freelancer not found",
          });
        }

        res.send(freelancer);
      } catch (error) {
        res.status(500).send({
          message: error.message,
        });
      }
    });

    // get all freelancer
    app.get("/api/freelancers", async (req, res) => {
      try {
        const freelancers = await userCollection
          .find({
            role: "freelancer",
            isBlocked: false,
          })
          .toArray();

        res.send(freelancers);
      } catch (error) {
        res.status(500).send({
          message: "Failed to fetch freelancers",
          error: error.message,
        });
      }
    });


    // get one tasks
    app.get("/api/browsetasks/:id", async (req, res) => {
      try {
        const task = await taskCollection.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!task) {
          return res.status(404).send({
            message: "Task not found",
          });
        }

        res.send(task);
      } catch (error) {
        res.status(500).send({
          message: error.message,
        });
      }
    });


    // get all tasks
    app.get("/api/browsetasks", async (req, res) => {
      try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;
        const search = req.query.search || "";

        const skip = (page - 1) * limit;

        const query = {};

        if (search) {
          query.title = {
            $regex: search,
            $options: "i",
          };
        }

        const totalTasks = await taskCollection.countDocuments(query);

        const tasks = await taskCollection
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();


        res.send({
          tasks,
          currentPage: page,
          totalPages: Math.ceil(totalTasks / limit),
          totalTasks,
        });
      } catch (error) {
        res.status(500).send({
          message: error.message,
        });
      }
    });


    // delete task
    app.delete("/api/tasks/:id", async (req, res) => {
      const id = req.params.id;

      const task = await taskCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!task) {
        return res.status(404).send({
          message: "Task not found",
        });
      }

      if (
        task.status !== "open" ||
        task.assignedFreelancerId
      ) {
        return res.status(403).send({
          message: "Task cannot be deleted",
        });
      }

      const result = await taskCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });
    // edit task
    app.patch("/api/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;

      const result = await taskCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            title: body.title,
            description: body.description,
            budget: body.budget,
            deadline: body.deadline,
          },
        }
      );

      res.send(result);
    });

    // get single task
    app.get("/api/tasks/:id", async (req, res) => {
      const id = req.params.id;

      const result = await taskCollection.findOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    // get all own task for client
    app.get('/api/tasks', async (req, res) => {
      const query = {};
      if (req.query.clientId) {
        query.clientId = req.query.clientId
      }
      if (req.query.status) {
        query.status = req.query.status
      }
      const cursor = taskCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    // post a new task by client
    app.post('/api/tasks', async (req, res) => {
      const task = req.body;
      task.createdAt = new Date();
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})