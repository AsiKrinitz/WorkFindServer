import mongoose from "mongoose";

// Define a schema
export const jobSchema = new mongoose.Schema({
  jobId: String,
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
  appliedRequests: [String],
});

export const jobModel = mongoose.model("JobsDetails", jobSchema);

// add a new job to the JobsDetails collection
export const addJob = async (job) => {
  let newJob = new jobModel(job);
  return await newJob.save();
};

// get all the jobs from the JobsDetails collection
export const getJobs = async () => {
  return await jobModel.find();
};

// submit user to job + check if user already submited
export const submitToJob = async (userEmail, jobId) => {
  try {
    // if exist gets the job details if not get false
    const jobDetails = await checkIfJobExist(jobId);

    if (jobDetails) {
      // Check if user's email is already in appliedRequests
      if (jobDetails.appliedRequests.includes(userEmail)) {
        return false;
        // return { message: `User ${userEmail} already applied to this job` };
      }

      // Job exists, update it with user's email
      jobDetails.appliedRequests.push(userEmail);
      await jobDetails.save();

      // Return a success response
      console.log("Job submission successful for email:", userEmail);
      return true;
      // return { message: `Job submission successful for email: ${userEmail}` };
    } else {
      // Job doesn't exist, return an error response
      return { error: "Job not found" };
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// check if job exist in the jobDetails collection
export const checkIfJobExist = async (jobId) => {
  try {
    const job = await jobModel.findOne({ _id: jobId });

    if (!job) {
      return false; // Job not found
    } else {
      return job; // Return job details if found
    }
  } catch (error) {
    console.log(error);
    return false; // Return false in case of errors
  }
};

// delete job from mongoDB
export const deleteJob = async (jobId) => {
  try {
    const result = await jobModel.findByIdAndDelete(jobId);

    if (!result) {
      return false;
      return { error: "Job not found" };
    } else {
      return true;
      return { message: "Job deleted successfully" };
    }
  } catch (error) {
    console.error(error);
    return { error: "Server error" };
  }
};
