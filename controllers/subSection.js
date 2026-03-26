const SubSection = require("../models/SubSection");
const Section = require("../models/Section");

// create sub-section logic
exports.createSubSection = async (req, res) => {
  try {
    // data fetch from request body
    const { sectionId, title, timeDuration, description } = req.params;
    // extract file/video
    const video = req.files.videoFile;
    // data validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }
    // upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME,
    );
    // create sub-section
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      video: uploadDetails.secure_url,
    });
    // update section with sub-section ObjectId
    const updatedSectionDetails = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true },
    );
    // Hw:use populate to replace sub-section ObjectId in the updatedSectionDetails
    await SubSectionDetails.populate("subSection");
    await updatedSectionDetails.populate("subSection");
    // return response
    return res.status(200).json({
      success: true,
      message: "Sub-section created successfully",
      updatedSectionDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create sub-section, please try again",
      error: error.message,
    });
  }
};

// Hw: update sub-section logic
exports.updateSubSection = async (req, res) => {
  try {
    // data fetch from request body
    const { subSectionId, title, timeDuration, description } = req.body;
    // data validation
    if (!subSectionId || !title || !timeDuration || !description) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }
    // update sub-section details
    const subSectionDetails = await SubSection.findByIdAndUpdate(
      { _id: subSectionId },
      { title, timeDuration, description },
      { new: true },
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "Sub-section updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: "Unable to update sub-section, please try again",
      error: error.message,
    });
  }
};
// Hw delete sub-section logic

exports.deleteSubSection = async (req, res) => {
  try {
    // data fetch from request body
    const { subSectionId, sectionId } = req.body;
    // data validation
    if (!subSectionId || !sectionId) {
      return res.status(404).json({
        success: false,

        message: "All fields are required",
      });
    }
    // delete sub-section
    await SubSection.findByIdAndDelete({ _id: subSectionId });
    // update section by pulling sub-section ObjectId from section's sub-section array
    const updatedCourseDetails = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $pull: { subSection: subSectionId } },
      { new: true },
    );
    // Hw: use populate to replace sub-section ObjectId in the updatedCourseDetails
    await updatedCourseDetails.populate("subSection");
    // return response
    return res.status(200).json({
      success: true,
      message: "Sub-section deleted successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete sub-section, please try again",
      error: error.message,
    });
  }
};
