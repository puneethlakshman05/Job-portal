import { useState, useEffect, useContext } from "react";
import Navbar from "../Components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import Footer from "../Components/Footer";
import { AppContext } from "../Context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

const Applications = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);

  const {
    backendUrl,
    userData,
    userApplications,
    fetchUserData,
    fetchUserApplications,
  } = useContext(AppContext);

  // ✅ Upload or update resume
  const updateResume = async () => {
    try {
      if (!resume) {
        toast.error("Please select a resume before saving.");
        return;
      }

      const formData = new FormData();
      formData.append("resume", resume);

      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + "/api/users/update-resume",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
      } else {
        toast.error(data.message || "Failed to update resume.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
    setIsEdit(false);
    setResume(null);
  };

  // ✅ Fetch applications when user is ready
  useEffect(() => {
    if (user) {
      fetchUserApplications();
    }
  }, [user]);

  return (
    <>
      <Navbar />

      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-8">
        {/* Resume Section */}
        <h2 className="text-xl font-semibold">Your Resume</h2>
        <div className="flex gap-2 mb-6 mt-3">
          {isEdit || !userData?.resume ? (
            <>
              <label className="flex items-center" htmlFor="resumeUpload">
                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">
                  {resume ? resume.name : "Select Resume"}
                </p>
                <input
                  id="resumeUpload"
                  onChange={(e) => setResume(e.target.files[0])}
                  accept="application/pdf"
                  type="file"
                  hidden
                />
                <img src={assets.profile_upload_icon} alt="upload" />
              </label>
              <button
                onClick={updateResume}
                className="bg-green-100 border border-green-400 rounded-lg px-4 py-2"
              >
                Save
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <a
                className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg"
                href={userData.resume}
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className="text-gray-500 border border-gray-300 rounded-lg px-3 py-2"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Jobs Applied Section */}
        <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
        <table className="min-w-full bg-white rounded-lg border">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b text-left">Company</th>
              <th className="py-3 px-4 border-b text-left">Job Title</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">
                Location
              </th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">
                Date
              </th>
              <th className="py-3 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {userApplications && userApplications.length > 0 ? (
              userApplications.map((job, index) =>
                job?.jobId && job?.companyId ? (
                  <tr key={index}>
                    <td className="py-3 px-4 flex items-center gap-2 border-b">
                      <img
                        className="w-8 h-8 object-contain"
                        src={job.companyId?.image || "/fallback-logo.png"}
                        alt="logo"
                      />
                      {job.companyId?.name || "Unknown Company"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {job.jobId?.title || "Untitled Job"}
                    </td>
                    <td className="py-2 px-4 border-b max-sm:hidden">
                      {job.jobId?.location || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b max-sm:hidden">
                      {job.date ? moment(job.date).format("ll") : "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`${
                          job.status === "Accepted"
                            ? "bg-green-100 text-green-700"
                            : job.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        } px-4 py-2 rounded-lg`}
                      >
                        {job.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ) : null
              )
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  {userApplications && userApplications.length === 0
                    ? "No applications found"
                    : "Loading..."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Footer />
    </>
  );
};

export default Applications;
