import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { AppContext } from '../Context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import Loading from '../Components/Loading'

const Managejobs = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState(false)
  const { backendUrl, companyToken } = useContext(AppContext)

  // Fetch company jobs
  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
        headers: { token: companyToken },
      })
      if (data.success) {
        setJobs(data.jobsData.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Change job visibility
  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { id },
        { headers: { token: companyToken } }
      )

      if (data.success) {
        toast.success(data.message)
        fetchCompanyJobs()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs()
    }
  }, [companyToken])

  if (!jobs) return <Loading />

  if (jobs.length === 0)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-xl sm:text-2xl text-gray-600">No Jobs Available or Posted</p>
      </div>
    )

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Manage Jobs</h2>

      {/* ✅ Desktop Table */}
      <div className="hidden md:block overflow-x-auto shadow-lg rounded-2xl">
        <table className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="py-3 px-4 text-left">No.</th>
              <th className="py-3 px-4 text-left">Job Title</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Location</th>
              <th className="py-3 px-4 text-center">Applications</th>
              <th className="py-3 px-4 text-center">Visible</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr
                key={index}
                className={`text-gray-700 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100 transition`}
              >
                <td className="py-3 px-4 text-center">{index + 1}</td>
                <td className="py-3 px-4 font-medium text-gray-800">{job.title}</td>
                <td className="py-3 px-4">{moment(job.date).format('ll')}</td>
                <td className="py-3 px-4">{job.location}</td>
                <td className="py-3 px-4 text-center">{job.applicants}</td>
                <td className="py-3 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={job.visible}
                    onChange={() => changeJobVisibility(job._id)}
                    className="scale-125 accent-blue-500 cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Cards */}
      <div className="md:hidden space-y-4">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{job.title}</h3>
            <p className="text-sm text-gray-500 mb-1">
              <strong>Date:</strong> {moment(job.date).format('ll')}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <strong>Location:</strong> {job.location}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Applications:</strong> {job.applicants}
            </p>

            <div className="flex items-center justify-between mt-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                Visible:
                <input
                  type="checkbox"
                  checked={job.visible}
                  onChange={() => changeJobVisibility(job._id)}
                  className="scale-125 accent-blue-500 cursor-pointer"
                />
              </label>

              <button
                onClick={() => navigate('/dashboard/add-job')}
                className="bg-blue-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-blue-600 transition"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Add New Job Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate('/dashboard/add-job')}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
        >
          Add New Job
        </button>
      </div>
    </div>
  )
}

export default Managejobs
