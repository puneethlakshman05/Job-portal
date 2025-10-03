import Job from "../models/Job.js"
import JobApplication from "../models/jobApplication.js"
import User from "../models/User.js"
import { v2 as cloudinary } from "cloudinary"


//get user data
export const getUserData = async(req,res) =>{
    
    const {userId} = req.auth()

    try {
        const user = await User.findById(userId)
        
        if(!user)
        {
            return res.json({success:false, message:'User not found'})
        }
        res.json({success:true, user})
    } 
    catch (error) 
    {
        res.json({success:false, message:error.message})
    }

}


//Apply for a job
export const applyForJob =async(req,res) =>
{
    const {jobId} = req.body;

    const {userId} = req.auth();

    try {
        
        const isAlreadyApplied = await JobApplication.find({jobId,userId});
        if(isAlreadyApplied.length > 0)
        {
           return res.json({success:false, message:'Already Applied'})
        }
        const jobData = await Job.findById(jobId)

        if(!jobData)
        {
            return res.json({success:false, message:'Job not found'})
        }
        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date:Date.now(),

        })

        res.json({success:true, message:'Applied successfully'})
    } 
    catch (error) {
        res.json({success:false, message:error.message})
    }
}

//get user applied applications
export const getUserJobApplications = async(req,res) =>
{
    try {
       const {userId} = req.auth()
       
       const applications = await JobApplication.find({userId})
       .populate('companyId', 'name email image' )
       .populate('jobId','title description location category level salary')
       .exec()
       if(!applications)
       {
        return res.json({success:false, message:'no job applications found'})
       }
       return res.json({success:true, applications})
    } 
    catch (error) {
        res.json({success:false, message:error.message})
    }
}
//update user profile
export const updateUserResume = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.json({ success: false, message: "No file uploaded" });
    }

    const userData = await User.findById(userId);

    // Upload buffer to cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "raw" }, // raw for pdf, docx etc.
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(resumeFile.buffer); // Send buffer instead of file path
    });

    const resumeUpload = await uploadPromise;

    userData.resume = resumeUpload.secure_url;
    await userData.save();

    return res.json({ success: true, message: "Resume Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};