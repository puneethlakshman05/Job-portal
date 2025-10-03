import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/jobApplication.js";


//Register a new Company

export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.json({ success: false, message: "Company already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // ✅ Upload image from memory buffer instead of file path
    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "companies" }, // optional: stores inside "companies" folder
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(imageFile.buffer); // send file buffer to Cloudinary
    });

    const imageUpload = await uploadPromise;

    // Create company
    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
    });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Company login
export const loginCompany = async(req,res)=>{

    const {email,password} = req.body;
    try 
    {
        const company = await Company.findOne({email});
        if(await bcrypt.compare(password, company.password))
        {

            res.json({
                success:true,
                company:
                {
                    _id: company._id,
                    name:company.name,
                    email:company.email,
                    image:company.image
                },
                token:generateToken(company._id)
            })
        }
        else{
            res.json({success:false,message:`Invalid email or password`})
        }
    }
     catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}

//get company data
export const getCompanyData = async(req,res) =>{
    
    try {
        const company = req.company;

        res.json({success:true,company});
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}
//post a new job
export const postJob = async(req,res)=>{

    const {title,description, location, salary, level, date, category} = req.body;

    const companyId = req.company._id;
    // console.log(companyId, {title,description, location, salary});
    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date:Date.now(),
            level,
            category

        })
        await newJob.save();

        res.json({success:true, newJob})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
    
}
//Get company job applicants
export const getCompanyJobApplicants = async(req,res) =>{

    try {
        const companyId = req.company._id

        //find job applications  for the user and populate related data
        const applications = await JobApplication.find({companyId})
        .populate('userId','name image resume')
        .populate('jobId','title location category level salary')
        .exec()
        return res.json({success:true, applications})
    } 
    catch (error) {
        res.json({success:false, message:error.message})
    }
}
// get comapny posted jobs 
export const getCompanyPostedJobs = async(req,res) =>
{
    try {
        
        const companyId = req.company._id;

        const jobs = await Job.find({companyId});

// Adding no of applicants info in data
        const jobsData = await Promise.all(jobs.map(async (job) =>{

            const applicants = await JobApplication.find({jobId: job._id})
            return {...job.toObject(), applicants:applicants.length}
        }))
    

        res.json({success:true, jobsData})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}
//change application status
export const changeApplicationStatus = async( req,res)=>{

    try {
         const {id, status} = req.body;

    //find job application data and update status
    await JobApplication.findOneAndUpdate({_id: id},{status})
    res.json({success:true, message:'status changed'})

    } 
    catch (error) {
        res.json({success:false, message:error.message})
    }

   
}
//change job visibility
export const changeVisibility = async(req,res) =>{

    try {
        

        const {id} = req.body;

        const companyId = req.company._id;

        const job = await Job.findById(id);

        if(companyId.toString()===job.companyId.toString())
        {
            job.visible = !job.visible
        }
        await job.save();

        res.json({success:true, job})

    } 
    catch (error) {
        res.json({success:false, message:error.message})
    }
}