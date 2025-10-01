import express from "express";
import multer from "multer";
import { applyForJob, getUserData, getUserJobApplications, updateUserResume } from "../controllers/userController.js";
import upload from "../config/multer.js";
// const upload = multer({dest:'uploads/'})
const router = express.Router();

//get userData 
router.get('/user',getUserData);

//apply for a job
router.post('/apply',applyForJob);

//get applied jobs data
router.get('/applications',getUserJobApplications);

//update user profile(resume)
router.post('/update-resume',upload.single('resume'),updateUserResume);

export default router;