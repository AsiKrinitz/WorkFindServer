import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {
  addJob,
  getJobs,
  submitToJob,
  deleteJob,
  getJobById,
  updateJobByIdInDatabase,
  countUserJobs,
} from "./jobService.js";
import {
  addResume,
  getAllResumes,
  getAllResumesFiltered,
  findResumeByEmail,
  updateResumeByEmail,
  deleteResumeByEmail,
} from "./resumeService.js";

import { getRoles, giveEmployerRole } from "./userRolesService.js";

// import * as fs from "fs";

// import * as https from "https";

const app = express();
const port = 3000;

// var options = {
//   key: fs.readFileSync("ssl/server.key"),
//   cert: fs.readFileSync("ssl/server.crt"),
//   ca: fs.readFileSync("ssl/ca.crt"),
// };

// Create an HTTPS server using the provided options and the Express app
// https.createServer(options, app).listen(port, () => {
//   console.log(
//     `Server is listening on - https://localhost:${port} and also at - https://127.0.0.1:3000`
//   );
// });

// middleware to allow cross origin requests 3001 to 3000
app.use(cors());

// middleware to parse json data. by default express does not parse json data
app.use(express.json());

// Start the server without ssl http
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/JobQuestDB")
  .then(() => {
    console.log("Connected to MongoDB from the mongoDb file");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

// Define a route
// http://localhost:3000
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// http://localhost:3000/api/test
app.get("/api/test", (req, res) => {
  res.send("this is test 123");
});

// post new job
app.post("/api/employersJobs", async (req, res) => {
  try {
    let job = req.body;
    let result = await addJob(job);
    console.log(result);

    let message = "Job added successfully!";

    res.send({ message, result });
  } catch (err) {
    console.log("Error occurred: " + err);
    res.status(500).send({ message: "An error occurred." });
  }
});

// get all jobs
app.get("/api/GetAllJobs", async (req, res) => {
  try {
    let jobs = await getJobs();
    res.send(jobs);
    res.end();
  } catch (err) {
    console.log(err);
  }
});

// add resume
app.post("/api/resume", async (req, res) => {
  try {
    let resume = req.body;
    // console.log(resume);

    let result = await addResume(resume);
    let message = "Resume added successfully!";
    res.send(result);
  } catch (error) {
    res.send("you got some error : " + error);
  }
});

// get all resumes
app.get("/api/getAllResumes", async (req, res) => {
  let resumes = await getAllResumes();
  res.send(resumes);
});

// get all resumes filtered
app.get("/api/getAllResumesFiltered", async (req, res) => {
  let userEmail = req.query.userEmail;
  // console.log("this is the req.query" + req.query);
  // console.log("data send with as parameter " + req.query.userEmail);
  let resumes = await getAllResumesFiltered(userEmail);
  res.send(resumes);
});

// check if email already exists in a resume
app.get("/api/checkExistingResume", async (req, res) => {
  const userEmail = req.query.userEmail;
  // console.log("the user email is: " + userEmail);
  const existingResume = await findResumeByEmail(userEmail);

  if (existingResume == null) {
    res.send(null);
  } else {
    res.send(existingResume);
  }
});

// Submit user to job !
app.get("/api/SubmitToJob", async (req, res) => {
  let userEmail = req.query.email; // Get the email from the query parameter
  let jobId = req.query.jobId;
  let userAnswer = req.query.userAnswer;

  const jobDetails = await submitToJob(userEmail, jobId, userAnswer);

  if (jobDetails) {
    res.send(true);
    // res.status(200).json(jobDetails); // Send job details if found
  } else {
    res.send(false);
    // res.status(404).json({ error: "Job not found" });
  }
});

// delete the job from the JobDetails Collection
app.delete("/api/DeleteJob", async (req, res) => {
  const jobId = req.query.jobId;

  const result = await deleteJob(jobId);

  res.send(result);
});

// edit existing resume
app.put("/api/editResume", async (req, res) => {
  const updatedData = req.body; // Data to update in the resume
  let userEmail = updatedData.userEmail;

  try {
    const updatedResume = await updateResumeByEmail(userEmail, updatedData);
    res.send(updatedResume);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating the resume.");
  }
});

// Delete a resume by email
app.delete("/api/deleteResume/:userEmail", async (req, res) => {
  const userEmail = req.params.userEmail; // Access the userEmail from the route parameter

  try {
    const deletedResume = await deleteResumeByEmail(userEmail);
    if (deletedResume != null) {
      res.send({ message: "Resume deleted successfully" });
    } else {
      res.status(404).send({ message: "Resume not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting the resume.");
  }
});

// Get a job by its ID
app.get("/api/GetJob/:jobId", async (req, res) => {
  const jobId = req.params.jobId;

  try {
    // Fetch the job by its ID (you can replace this with your actual database query)
    const job = await getJobById(jobId);

    if (!job) {
      res.status(404).json({ message: "Job not found" });
    } else {
      res.json(job);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a job by its ID
app.put("/api/UpdateJob/:jobId", async (req, res) => {
  const jobId = req.params.jobId;
  const updatedJobData = req.body;

  try {
    // Update the job by its ID
    const updatedJob = await updateJobByIdInDatabase(jobId, updatedJobData);

    if (!updatedJob) {
      res.status(404).json({ message: "Job not found" });
    } else {
      res.json(updatedJob);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// count how many jobs wach user got
app.get("/api/countUserJobs/:userEmail", async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const jobCount = await countUserJobs(userEmail);
    res.send({ jobCount });
  } catch (err) {
    console.log("Error occurred: " + err);
    res.status(500).send({ message: "An error occurred." });
  }
});

// exapmle with using URL params
// looks like this - (/api/getRoles/12345)
app.get("/api/getRolesUrlParams/:userId", async (req, res) => {
  const userId = req.params.userId; // Access userId from the URL parameter
  // console.log(userId);

  try {
    let result = await getRoles(userId); // Use the getRoles function from the service

    res.status(200).send(result); // Send the response with the roles data
    res.end();
  } catch (error) {
    console.error("Error occurred: " + error);
    res.status(500).send({ message: "An error occurred.", error });
    res.end();
  }
});

// http://localhost:3000/api/AddName/name
app.get("/api/AddName/:userName", (req, res) => {
  let userName = req.params.userName;
  console.log("the name we got is : " + userName);
  res.send(userName + " the king");
});

// http://localhost:3000/api/AddAnimal?userAnimal=animal
app.get("/api/AddAnimal", async (req, res) => {
  let userAnimal = req.query.userAnimal;

  let test = {
    animal: userAnimal,
  };
  res.send(test);
});

// giving Employer Role for the users
app.get("/api/AskForRole/:userSub", async (req, res) => {
  let userSub = req.params.userSub;
  console.log(userSub);

  try {
    let temp = false;
    temp = await giveEmployerRole(userSub);

    console.log(temp);

    if (temp === true) {
      res.status(200).json(temp);
      res.end();
    } else {
      res.status(200).json(temp);
      res.end();
    }
  } catch (error) {
    console.error("Error occurred: " + error);
    res.status(500).send({ message: "An error occurred.", error });
    res.end();
  }
});
