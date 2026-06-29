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
    const paymentCollection = myDB.collection("payments")
    const reviewCollection=myDB.collection("review")

    // post review
    app.post("/api/reviews", async (req, res) => {
      try {
        const review = req.body;

        // basic validation (optional but good)
        if (!review.taskId || !review.userName || !review.text) {
          return res.status(400).json({
            message: "Missing required fields",
          });
        }

        const result = await reviewCollection.insertOne({
          taskId: review.taskId,
          userName: review.userName,
          text: review.text,
          createdAt: new Date(),
        });

        res.status(201).json({
          success: true,
          message: "Review added successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          message: "Server error",
        });
      }
    });

    // deliveral link updload and task complete api
    app.patch("/api/tasks/:id/deliverable", async (req, res) => {
      const { id } = req.params;
      const { deliverable_url } = req.body;

      const result = await taskCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            deliverable_url,
            status: "completed",
            completedAt: new Date(),
          },
        }
      );

      res.send({
        success: true,
        result,
      });
    });

    // delete task by admin (api)
    app.delete("/api/admin/tasks/:id", async (req, res) => {
      try {
        const { id } = req.params;

        const result = await taskCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).send({
            success: false,
            message: "Task not found",
          });
        }

        res.send({
          success: true,
          message: "Task deleted successfully",
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    });

    // user blcoke by userID
    app.patch("/api/users/block", async (req, res) => {
      try {
        const { userId, isBlocked } = req.body;

        if (!userId) {
          return res.status(400).send({
            success: false,
            message: "User ID is required",
          });
        }

        const result = await userCollection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              isBlocked: isBlocked,
            },
          }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({
            success: false,
            message: "User not found",
          });
        }

        res.send({
          success: true,
          message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    });

    // get all payment data
    app.get("/api/admin/payments", async (req, res) => {
      try {
        const payments = await paymentCollection
          .find({})
          .sort({ paidAt: -1 })
          .toArray();

        res.send({
          success: true,
          data: payments,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    });

    // get all task
    app.get("/api/admin/tasks", async (req, res) => {
      try {
        const tasks = await taskCollection
          .find({})
          .sort({ createdAt: -1 })
          .toArray();

        res.send({
          success: true,
          data: tasks,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    });


    // get all user
    app.get("/api/admin/users", async (req, res) => {
      try {
        const users = await userCollection
          .find({})
          .sort({ createdAt: -1 })
          .toArray();

        res.send({
          success: true,
          data: users,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    });


    // get admin overview all data (summary data)
    app.get("/api/admin/dashboard", async (req, res) => {
      try {
        const totalUsers = await userCollection.countDocuments();

        const totalClients = await userCollection.countDocuments({
          role: "client",
        });

        const totalFreelancers = await userCollection.countDocuments({
          role: "freelancer",
        });

        const totalTasks = await taskCollection.countDocuments();

        const openTasks = await taskCollection.countDocuments({
          status: "open",
        });

        const inProgressTasks = await taskCollection.countDocuments({
          status: "in_progress",
        });

        const completedTasks = await taskCollection.countDocuments({
          status: "completed",
        });

        const totalPayments = await paymentCollection.countDocuments();

        const payments = await paymentCollection.find({}).toArray();

        const totalRevenue = payments.reduce(
          (sum, payment) => sum + Number(payment.amount || 0),
          0
        );

        res.send({
          success: true,
          data: {
            totalUsers,
            totalClients,
            totalFreelancers,
            totalTasks,
            openTasks,
            inProgressTasks,
            completedTasks,
            totalPayments,
            totalRevenue,
          },
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    });



    // get active project by freelancer id
    app.get("/api/freelancer/activeprojects/:id", async (req, res) => {
      const freelancerId = req.params.id;

      const projects = await taskCollection.find({
        assignedFreelancerId: freelancerId,
        status: {
          $in: ["in_progress", "completed"],
        },
      }).toArray();

      res.send(projects);
    });



    // Get payments by freelancer id
    app.get("/api/payments/freelancer/:freelancerId", async (req, res) => {
      const { freelancerId } = req.params;

      const payments = await paymentCollection.find({
        freelancerId: freelancerId,
      }).toArray();

      res.send({
        success: true,
        data: payments,
      });
    });




    // Get payments by client id
    app.get("/api/payments/client/:clientId", async (req, res) => {
      const { clientId } = req.params;

      const payments = await paymentCollection.find({
        clientId: clientId,
      }).toArray();

      res.send({
        success: true,
        data: payments,
      });
    });


    // post payment data in db
    app.post("/payment", async (req, res) => {
      try {
        const {
          proposalId,
          taskId,
          amount,
          freelancerId,
          freelancerEmail,
          freelancerName,
          clientId,
          clientName,
          clientEmail,
        } = req.body;

        // Save payment
        await paymentCollection.insertOne({
          proposalId,
          taskId,
          amount,
          freelancerId,
          freelancerEmail,
          freelancerName,
          clientId,
          clientName,
          clientEmail,
          paidAt: new Date(),
        });

        // Accept selected proposal
        await proposalCollection.updateOne(
          {
            _id: new ObjectId(proposalId),
          },
          {
            $set: {
              status: "accepted",
              acceptedAt: new Date(),
            },
          }
        );

        // Reject ALL OTHER proposals of the same task
        await proposalCollection.updateMany(
          {
            task_id: taskId,
            _id: { $ne: new ObjectId(proposalId) }, // except accepted proposal
          },
          {
            $set: {
              status: "rejected",
              rejectedAt: new Date(),
            },
          }
        );

        // Update task
        await taskCollection.updateOne(
          {
            _id: new ObjectId(taskId),
          },
          {
            $set: {
              status: "in_progress",
              assignedFreelancerId: freelancerId,
              assignedFreelancerEmail: freelancerEmail,
              assignedFreelancerName: freelancerName,
              assignedAt: new Date(),
            },
          }
        );

        res.send({
          success: true,
          message: "Payment successful. Proposal accepted and others rejected.",
        });
      } catch (error) {
        console.log(error);

        res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    });


    // Get proposals by task id
    app.get("/api/proposal/task/:taskId", async (req, res) => {
      const { taskId } = req.params;

      const proposals = await proposalCollection
        .find({ task_id: taskId })
        .toArray();

      res.send(proposals);
    });

    // get proposals by client email
    app.get("/api/proposal/client/:email", async (req, res) => {
      try {
        const email = req.params.email;

        const proposals = await proposalCollection
          .find({ client_email: email })
          .sort({ submitted_at: -1 })
          .toArray();

        res.send({
          success: true,
          data: proposals,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    });


    // get proposal by freelancer
    app.get("/api/proposal/freelancer/:email", async (req, res) => {
      try {
        const email = req.params.email;

        const proposals = await proposalCollection
          .find({ freelancer_email: email })
          .sort({ submitted_at: -1 })
          .toArray();

        return res.send({
          success: true,
          data: proposals,
        });
      } catch (error) {
        return res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    });

    // POST Proposal
    app.post("/api/proposal", async (req, res) => {
      try {
        const {
          task_id,
          freelancer_email,
          proposed_budget,
          estimated_days,
          cover_note,
        } = req.body;

        if (!task_id || !freelancer_email) {
          return res.status(400).send({
            success: false,
            message: "Missing required fields",
          });
        }

        const alreadyApplied = await proposalCollection.findOne({
          task_id,
          freelancer_email,
        });

        if (alreadyApplied) {
          return res.status(400).send({
            success: false,
            message: "You already applied for this task",
          });
        }

        const proposal = {
          ...req.body,
          status: "pending",
          submitted_at: new Date(),
        };

        const result = await proposalCollection.insertOne(proposal);

        return res.status(201).send({
          success: true,
          message: "Proposal submitted",
          data: result,
        });
      } catch (error) {
        return res.status(500).send({
          success: false,
          message: error.message,
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
      task.deliverable_url = "";
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


// app.listen(process.env.PORT || 5000, () => {
//   console.log(`Server is running on port ${process.env.PORT || 5000}`);
// });
module.exports = app;