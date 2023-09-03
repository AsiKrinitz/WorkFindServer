import express from "express";
import cors from "cors";
import {
  addJob,
  getJobs,
  submitToJob,
  deleteJob,
<<<<<<< HEAD
  getJobByIdFromDatabase,
  updateJobByIdInDatabase,
=======
  getJobById,
  updateJob,
>>>>>>> 92dd2c8b2ef623ee1ae7493d70ec66483e24ff75
} from "./jobService.js";
import {
  addResume,
  getAllResumes,
  getAllResumesFiltered,
  findResumeByEmail,
  updateResumeByEmail,
  deleteResumeByEmail,
} from "./resumeService.js";

import mongoose from "mongoose";

const app = express();
const port = 3000;

// middleware to allow cross origin requests 3001 to 3000
app.use(cors());

// middleware to parse json data. by default express does not parse json data
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/Jobs")
  .then(() => {
    console.log("Connected to MongoDB from the mongoDb file");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Define a route
//http://localhost:3000
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
    console.log(resume);

    let result = await addResume(resume);
    let message = "Resume added successfully!";
    res.send(result);

    console.log(result);
  } catch (error) {
    res.send("you got some error : " + error);
  }
});

// get all resumes
app.get("/api/getAllResumes", async (req, res) => {
  let resumes = await getAllResumes();
  console.log(resumes);
  res.send(resumes);
});

// get all resumes filtered
app.get("/api/getAllResumesFiltered", async (req, res) => {
  let userEmail = req.query.userEmail;
  // console.log("this is the req.query" + req.query);
  console.log("data send with as parameter " + req.query.userEmail);
  let resumes = await getAllResumesFiltered(userEmail);
  // console.log(resumes);
  res.send(resumes);
});

// check if email already exists in a resume
app.get("/api/checkExistingResume", async (req, res) => {
  const userEmail = req.query.userEmail;
  console.log(userEmail);
  const existingResume = await findResumeByEmail(userEmail);

  if (existingResume == null) {
    res.send(false);
  } else {
    res.send(existingResume);
  }
});

// Submit user to job !
app.get("/api/SubmitToJob", async (req, res) => {
  let userEmail = req.query.email; // Get the email from the query parameter
  let jobId = req.query.jobId;

  // console.log(userEmail + jobId);

  const jobDetails = await submitToJob(userEmail, jobId);

  console.log(jobDetails);

  if (jobDetails) {
    res.send(true);
    // res.status(200).json(jobDetails); // Send job details if found
  } else {
    res.send(false);
    // res.status(404).json({ error: "Job not found" });
  }
});

<<<<<<< HEAD
// delete the job from the JobDetails Collection
=======
// handle the delete job function
>>>>>>> 92dd2c8b2ef623ee1ae7493d70ec66483e24ff75
app.delete("/api/DeleteJob", async (req, res) => {
  const jobId = req.query.jobId;

  const result = await deleteJob(jobId);

  console.log(result);

  res.send(result);
});

<<<<<<< HEAD
// edit existing resume
app.put("/api/editResume", async (req, res) => {
  const updatedData = req.body; // Data to update in the resume
  let userEmail = updatedData.userEmail;

  console.log(updatedData);
  console.log(userEmail);

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
      console.log(deletedResume);
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
  console.log(jobId);

  try {
    // Fetch the job by its ID (you can replace this with your actual database query)
    const job = await getJobByIdFromDatabase(jobId);

    if (!job) {
      res.status(404).json({ message: "Job not found" });
=======
// get a job details by jobId
app.get("/api/GetJob", async (req, res) => {
  const jobId = req.query.jobId;

  try {
    const job = await getJobById(jobId);

    if (!job) {
      res.send(false);
>>>>>>> 92dd2c8b2ef623ee1ae7493d70ec66483e24ff75
    } else {
      res.json(job);
    }
  } catch (error) {
    console.error(error);
<<<<<<< HEAD
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a job by its ID
app.put("/api/UpdateJob/:jobId", async (req, res) => {
  const jobId = req.params.jobId;
  const updatedJobData = req.body;

  try {
    // Update the job by its ID (replace this with your actual database update logic)
    const updatedJob = await updateJobByIdInDatabase(jobId, updatedJobData);

    if (!updatedJob) {
      res.status(404).json({ message: "Job not found" });
    } else {
      res.json(updatedJob);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
=======
    res.status(500).json({ error: "Server error" });
  }
});

// update job
app.put("/api/UpdateJob/:jobId", async (req, res) => {
  const jobId = req.params.jobId; // Extract the jobId from the URL parameter
  const updatedJobData = req.body; // This should contain the updated job data

  console.log(jobId);
  console.log(updatedJobData);

  try {
    const result = await updateJob(jobId, updatedJobData);

    if (!result.error) {
      res.json({ message: "Job updated successfully" });
    } else {
      res.status(404).json({ error: "Job not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
>>>>>>> 92dd2c8b2ef623ee1ae7493d70ec66483e24ff75
  }
});
