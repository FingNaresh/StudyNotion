const Tag = require("../models/tag");

// create tag ka handler function
exports.createTag = async (req, res) => {
  try {
    // data fetch
    const { name, description } = req.body;
    // validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide tag name and description",
      });
    }
    // create tag
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);
    res.status(201).json({
      success: true,
      message: "Tag created successfully",
      data: tagDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while creating tag",
      error: error.message,
    });
  }
};

// get all tags ka handler function
exports.showAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find(
      {},
      { name: true, description: true },
    ).populate("courses");
    res.status(200).json({
      success: true,
      message: "All tags fetched successfully",
      data: allTags,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching tags",
      error: error.message,
    });
  }
};


