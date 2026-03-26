const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, courseId } = req.params;
    // data validation
    if (!sectionName || !courseId) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    // create section
    const newSection = await Section.create({ sectionName });
    // update course with section ObjectId
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection._id } },
      { new: true },
    );
    // Hw:use populate to replace sections/sub-sections both in the updatedCourseDetails
    await newSection.populate("courseContent");
    await updatedCourseDetails.populate("courseContent");
    // return response
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section, please try again",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    // data input
    const { sectionName, sectionId } = req.body;
    // data validation
    if (!sectionName || !sectionId) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }
    // update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true },
    );
    // return response
    res.status(200).json({
      success: true,
      message: "Section updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update section, please try again",
      error: error.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    // data input
    const { sectionId } = req.params;
    // data validation
    if (!sectionId) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }
    // delete section
    await Section.findByIdAndDelete(sectionId);
    // TODO: do we need to delete the entry from the course schema??
    // return response
    res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete section, please try again",
      error: error.message,
    });
  }
};
