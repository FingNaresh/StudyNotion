const Course = require("../models/Course");
const Tag = require("../models/tag");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create course handler function
exports.createCourse = async (req, res) => {
  try {
    // data fetch
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;
    // get thumbnail
    const thumbnail = req.files.thumbnailImage;
    // upload thumbnail to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(thumbnail, temp);
    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnailImage
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields for course",
      });
    }
    // check for the instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log(instructorDetails);

    if (!instructorDetails.role) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    // check given tag is valid or not
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Invalid tag provided",
      });
    }

    // upload Image to cloudinary
    const thumbnailImgage = await uploadImageToCloudinary(
      thumbnailImage,
      process.env.FOLDER_NAME,
    );

    // create course
    const newCourse = await Course.create({
      name: courseName,
      description: courseDescription,
      instructor: instructorDetails._id,
      thumbnail: thumbnailImgage.secure_url,
      whatYouWillLearn: whatYouWillLearn,
      price: price,
      tagId: tagDetails._id,
    });

    // add the new course to the user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true },
    );

    // update the tag  ka schema with the course id
    await Tag.findByIdAndUpdate(
      { _id: tagDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true },
    );

    // return response
    res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating course",
      error: error.message,
    });
  }
};

// get all courses handler function
exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      },
    )
      .populate("instructor")
      .exec();
    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching courses",
      error: error.message,
    });
  }
};
