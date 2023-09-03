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
  userSkills: String,
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

// edit existing resume by email
export const updateResumeByEmail = async (userEmail, updatedData) => {
  try {
    // Find the document to update
    const resumeToUpdate = await resumeModel.findOne({ userEmail });

    if (!resumeToUpdate) {
      // Handle case where the document with the specified email is not found
      return null;
    }

    // Update the fields in the document
    resumeToUpdate.set(updatedData);

    // Update the lastEdit field to the current date and time
    resumeToUpdate.lastEdit = new Date();

    // Save the updated document
    const updatedResume = await resumeToUpdate.save();

    return updatedResume;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// delete resume by email
export const deleteResumeByEmail = async (userEmail) => {
  try {
    const deletedResume = await resumeModel.findOneAndDelete({ userEmail });
    return deletedResume;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
