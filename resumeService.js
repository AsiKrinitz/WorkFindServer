import mongoose from "mongoose";

export const resumeSchema = new mongoose.Schema({
  userFullName: String,
  userEmail: String,
  userPhone: String,
  userCity: String,
  gender: String,
  userEducation: String,
  userLanguages: [String],
  userExperience: String,
  userDescription: String,
  userSkillz: String,
  lastEdit: Date,
});

export const resumeModel = mongoose.model("Resume", resumeSchema);

export const addResume = async (resume) => {
  let addResume = new resumeModel(resume);
  return await addResume.save();
};

export const getAllResumes = async () => {
  return await resumeModel.find();
};

export const getAllResumesFiltered = async (userEmail) => {
  try {
    const resumes = await resumeModel.find({ userEmail: userEmail });
    return resumes;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findResumeByEmail = async (userEmail) => {
  try {
    const resume = await resumeModel.findOne({ userEmail });
    if (resume == null) {
      return null;
    } else {
      return resume;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
