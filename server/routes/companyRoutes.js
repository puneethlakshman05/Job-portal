import express from"express"
import multer from "multer";
import { changeApplicationStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from "../controllers/companyController.js";
import { protectCompany } from "../middleware/authMiddleware.js";
const router = express.Router();
// const upload = multer({dest:'uploads/'})
//register a company
router.post('/register',upload.single('image'),registerCompany);
///company login
router.post('/login',loginCompany);

//get company data
router.get('/company', protectCompany, getCompanyData);

//post a job
router.post('/post-job',protectCompany,postJob);

//get applicants data of company
router.get('/applicants',getCompanyJobApplicants);

//get company job list
router.get('/list-jobs',protectCompany,getCompanyPostedJobs);

//Change application status
router.post('/change-status',protectCompany,changeApplicationStatus);

//change application visibility
router.post('/change-visibility',protectCompany,changeVisibility);

export default router;