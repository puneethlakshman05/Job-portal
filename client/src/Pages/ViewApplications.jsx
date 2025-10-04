import { assets } from '../assets/assets'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../Components/Loading'

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext)
  const [applicants, setApplicants] = useState(false)

  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { token: companyToken },
      })
      if (data.success) {
        setApplicants(data.applications.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { id, status },
        { headers: { token: companyToken } }
      )
      if (data.success) {
        fetchCompanyJobApplications()
        toast.success(`Application ${status}`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications()
    }
  }, [companyToken])

  if (!applicants) return <Loading />

  if (applicants.length === 0)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-xl sm:text-2xl text-gray-600">No Applications Available</p>
      </div>
    )

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Job Applications</h2>

      {/* ✅ Desktop Table */}
      <div className="hidden md:block overflow-x-auto shadow-lg rounded-2xl">
        <table className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="py-3 px-4 text-left">No.</th>
              <th className="py-3 px-4 text-left">User Name</th>
              <th className="py-3 px-4 text-left">Job Title</th>
              <th className="py-3 px-4 text-left">Location</th>
              <th className="py-3 px-4 text-left">Resume</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants
              .filter((item) => item.jobId && item.userId)
              .map((applicant, index) => (
                <tr
                  key={index}
                  className={`text-gray-700 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100 transition`}
                >
                  <td className="py-3 px-4 text-center">{index + 1}</td>
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={applicant.userId.image}
                      alt=""
                    />
                    <span className="font-medium">{applicant.userId.name}</span>
                  </td>
                  <td className="py-3 px-4">{applicant.jobId.title}</td>
                  <td className="py-3 px-4">{applicant.jobId.location}</td>
                  <td className="py-3 px-4">
                    <a
                      href={applicant.userId.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
                    >
                      Resume
                      <img src={assets.resume_download_icon} alt="" className="w-4 h-4" />
                    </a>
                  </td>
                  <td className="py-3 px-4 relative">
                    {applicant.status === 'Pending' ? (
                      <div className="relative inline-block group">
                        <button className="text-gray-500 px-2">•••</button>
                        <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-md z-10 hidden group-hover:block">
                          <button
                            onClick={() =>
                              changeJobApplicationStatus(applicant._id, 'Accepted')
                            }
                            className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              changeJobApplicationStatus(applicant._id, 'Rejected')
                            }
                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          applicant.status === 'Accepted'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {applicant.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Cards */}
      <div className="md:hidden space-y-4">
        {applicants
          .filter((item) => item.jobId && item.userId)
          .map((applicant, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={applicant.userId.image}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {applicant.userId.name}
                  </h3>
                  <p className="text-sm text-gray-500">{applicant.jobId.title}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                <strong>Location:</strong> {applicant.jobId.location}
              </p>
              <a
                href={applicant.userId.resume}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:underline text-sm mb-2 inline-flex items-center gap-2"
              >
                Resume
                <img src={assets.resume_download_icon} alt="" className="w-4 h-4" />
              </a>
              <div className="mt-3">
                {applicant.status === 'Pending' ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        changeJobApplicationStatus(applicant._id, 'Accepted')
                      }
                      className="flex-1 bg-green-100 text-green-700 font-medium py-1.5 rounded-lg hover:bg-green-200 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        changeJobApplicationStatus(applicant._id, 'Rejected')
                      }
                      className="flex-1 bg-red-100 text-red-600 font-medium py-1.5 rounded-lg hover:bg-red-200 transition"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      applicant.status === 'Accepted'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {applicant.status}
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default ViewApplications
