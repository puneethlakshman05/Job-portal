// import { assets } from "../assets/assets"
import { useNavigate } from "react-router-dom"

const JobCard = ({job}) => {
  const navigate = useNavigate();
  return (
    <div className="border p-4 shadow rounded h-full ">
        <div className="flex justify-between items-center">
            <img src={job.companyId.image} alt="" />
        </div>
        <h4 className="font-medium text-xl mt-2">{job.title}</h4>
        <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded ">{job.location}</span>
            <span className="bg-red-50 border border-red-200 px-4 py-1.5 rounded">{job.level}</span>
        </div>
        <p className="text-gray-500 text-sm mt-4" dangerouslySetInnerHTML={{__html:job.description.slice(0,150)}}></p>
        <div className=" flex mt-4 gap-2.5 text-sm ">
            <button onClick={()=>{navigate(`/apply-job/${job._id}`); scrollTo(0,0)}} className="bg-green-600 text-white px-3 py-2.5 rounded">Apply now</button>
            <button onClick={()=>{navigate(`/apply-job/${job._id}`); scrollTo(0,0)}} className="bg-amber-50 border border-gray-500 px-3 py-2.5 rounded">Learn more</button>
        </div>
    </div>
  )
}

export default JobCard