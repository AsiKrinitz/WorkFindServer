import express from "express";
import cors from "cors";
import { addJob, getJobs } from "./jobService.js";
import {
  addResume,
  getAllResumes,
  getAllResumesFiltered,
  findResumeByEmail,
} from "./resumeService.js";

const app = express();
const port = 3000;

// middleware to allow cross origin requests 3001 to 3000
app.use(cors());

// middleware to parse json data. by default express does not parse json data
app.use(express.json());

import mongoose from "mongoose";

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/Jobs")
  .then(() => {
    console.log("Connected to MongoDB from the mongoDb file");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
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
    let message = "Job added successfully!";
    res.send({ message, result });

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
  const existingResume = await findResumeByEmail(userEmail);
  res.send(existingResume);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});