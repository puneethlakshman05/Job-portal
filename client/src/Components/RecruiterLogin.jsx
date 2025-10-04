import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RecruiterLogin = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Login"); // Login | Sign Up | Forgot | OTP | Reset
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(false);
  const [isTextDataSubmitted, setIsDataSubmitted] = useState(false);
  const [isEyeVisible, setIsEyeVisible] = useState(false);
  const [isEyeVisible1, setIsEyeVisible1] = useState(false);
  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // 🔹 Login / Signup / Forgot Password Logic
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/company/login", {
          email,
          password,
        });

        if (data.success) {
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      } else if (state === "Sign Up") {
        if (!isTextDataSubmitted) {
          setIsDataSubmitted(true);
          return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (image) formData.append("image", image);

        const { data } = await axios.post(
          backendUrl + "/api/company/register",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (data.success) {
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message);
        }
      } else if (state === "Forgot") {
        // Step 1: Send OTP
        const { data } = await axios.post(
          backendUrl + "/api/company/forgot-password",
          { email }
        );
        if (data.success) {
          toast.success("OTP sent to your email");
          setState("OTP");
        } else toast.error(data.message);
      } else if (state === "OTP") {
        // Step 2: Verify OTP (you can skip if only reset uses OTP)
        setState("Reset");
      } else if (state === "Reset") {
        if (newPassword !== confirmPassword)
          return toast.error("Passwords do not match");
        const { data } = await axios.post(
          backendUrl + "/api/company/reset-password",
          { email, otp, newPassword }
        );
        if (data.success) {
          toast.success("Password reset successfully");
          setState("Login");
        } else toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="absolute inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center px-4">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white rounded-2xl text-slate-600 p-8 sm:p-10 w-full max-w-sm shadow-2xl"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-semibold mb-2">
          Recruiter {state === "Forgot" ? "Password Reset" : state}
        </h1>
        <p className="text-sm text-center mb-4">
          {state === "Forgot"
            ? "Enter your registered email to receive OTP"
            : state === "OTP"
            ? "Enter the OTP sent to your email"
            : state === "Reset"
            ? "Create a new password"
            : "Welcome back! Please sign in to continue"}
        </p>

        {/* ============ LOGIN / SIGNUP / FORGOT / OTP / RESET ============ */}
        {state === "Sign Up" && isTextDataSubmitted ? (
          <div className="flex items-center gap-4 my-8 justify-center">
            <label htmlFor="image">
              <img
                className="w-16 h-16 rounded-full border-2 border-gray-300 object-cover"
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt=""
              />
              <input
                onChange={(e) => setImage(e.target.files[0])}
                id="image"
                type="file"
                hidden
              />
            </label>
            <p className="text-sm">Upload Company Logo</p>
          </div>
        ) : state === "OTP" ? (
          <>
            <div className="border px-4 py-2 rounded-full mt-5">
              <input
                className="outline-none text-sm w-full text-center tracking-widest"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                type="text"
                placeholder="Enter 6-digit OTP"
                required
              />
            </div>
          </>
        ) : state === "Reset" ? (
          <>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="" />
              <input
                className="outline-none text-sm flex-1"
                type={isEyeVisible ? "text" : "password"}
                placeholder="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
              />
              <span
                className="material-icons cursor-pointer text-gray-500"
                style={{ fontSize: "20px" }}
                onClick={() => setIsEyeVisible(!isEyeVisible)}
              >
                {isEyeVisible ? "visibility_off" : "visibility"}
              </span>
            </div>

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="" />
              <input
                className="outline-none text-sm flex-1"
                type={isEyeVisible1 ? "text" : "password"}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
                <span
                className="material-icons cursor-pointer text-gray-500"
                style={{ fontSize: "20px" }}
                onClick={() => setIsEyeVisible1(!isEyeVisible1)}
              >
                {isEyeVisible1 ? "visibility_off" : "visibility"}
              </span>
            </div>
          </>
        ) : (
          <>
            {state !== "Login" && state !== "Forgot" && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.person_icon} alt="" />
                <input
                  className="outline-none text-sm flex-1"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Company Name"
                  required
                />
              </div>
            )}

            {(state === "Login" || state === "Sign Up" || state === "Forgot") && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.email_icon} alt="" />
                <input
                  className="outline-none text-sm flex-1"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Email Id"
                  required
                />
              </div>
            )}

            {(state === "Login" || state === "Sign Up") && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.lock_icon} alt="" />
                <input
                  className="outline-none text-sm flex-1"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={isEyeVisible ? "text" : "password"}
                  placeholder="Password"
                  required
                />
                <span
                  className="material-icons cursor-pointer text-gray-500"
                  style={{ fontSize: "20px" }}
                  onClick={() => setIsEyeVisible(!isEyeVisible)}
                >
                  {isEyeVisible ? "visibility_off" : "visibility"}
                </span>
              </div>
            )}
          </>
        )}

        {/* ===== Forgot Password Link ===== */}
        {state === "Login" && (
          <p
            onClick={() => setState("Forgot")}
            className="text-sm text-center text-blue-600 my-3 cursor-pointer hover:underline"
          >
            Forgot Password?
          </p>
        )}

        {/* ===== Submit Button ===== */}
        <button
          type="submit"
          className="bg-fuchsia-800 text-white w-full py-2 rounded-full mt-2 hover:bg-fuchsia-950 transition-all"
        >
          {state === "Login"
            ? "Login"
            : state === "Sign Up"
            ? isTextDataSubmitted
              ? "Create Account"
              : "Next"
            : state === "Forgot"
            ? "Send OTP"
            : state === "OTP"
            ? "Verify OTP"
            : "Reset Password"}
        </button>

        {/* ===== Switch between Login / Signup ===== */}
        {state === "Login" ? (
          <p className="text-sm mt-4 text-center">
            Don't have an account?
            <span
              className="cursor-pointer text-blue-600 ml-1"
              onClick={() => setState("Sign Up")}
            >
              Sign Up
            </span>
          </p>
        ) : state === "Sign Up" ? (
          <p className="text-sm mt-4 text-center">
            Already have an account?
            <span
              className="cursor-pointer text-blue-600 ml-1"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        ) : (
          <p className="text-sm mt-4 text-center text-blue-600 cursor-pointer hover:underline" onClick={() => setState("Login")}>
            Back to Login
          </p>
        )}

        <img
          onClick={() => setShowRecruiterLogin(false)}
          className="absolute top-5 right-5 cursor-pointer w-4"
          src={assets.cross_icon}
          alt=""
        />
      </form>
    </div>
  );
};

export default RecruiterLogin;
