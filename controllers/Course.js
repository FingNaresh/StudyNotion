const Course=require("../models/Course");
const Tag=require("../models/tag");
const User=require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


// create course handler function
exports.createCourse=async(req,res)=>{
    try {
        // data fetch
        const {name,description,tagId}=req.body;
        // validation
        if(!name || !description || !tagId){
            return res.status(400).json({
                success:false,
                message:"Please provide name, description and tagId for course"
            });
        }
        // create course
        const courseDetails=await Course.create({
            name:name,
            description:description,
            tagId:tagId
        });
        res.status(201).json({
            success:true,
            message:"Course created successfully",
            data:courseDetails
        }); 

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error while creating course",
            error:error.message
        });
    }   
};

// get all courses handler function
exports.showAllCourses=async(req,res)=>{
    try {
        const allCourses=await Course.find({}).populate("tagId");
        res.status(200).json({
            success:true,
            message:"All courses fetched successfully",
            data:allCourses
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error while fetching courses",
            error:error.message
        });
    }
};






