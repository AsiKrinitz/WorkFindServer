import mongoose from "mongoose";

// Define a schema
export const jobSchema = new mongoose.Schema({
  jobId: Number,
  jobRole: String,
  jobRequirements: String,
  jobLocation: String,
  jobDescription: String,
  jobSalary: Number,
  nameOfCompany: String,
  jobOwner: String,
  jobDate: Date,
  experienceRequired: Boolean,
  isApplied: Boolean,
});

export const jobModel = mongoose.model("JobsDetails", jobSchema);

export const addJob = async (job) => {
  let newJob = new jobModel(job);
  return await newJob.save();
};

export const getJobs = async () => {
  return await jobModel.find();
};
