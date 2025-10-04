
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { useEffect } from "react";


const Dashboard = () => {
    const navigate = useNavigate();

    const { companyData, setCompanyData, setCompanyToken } = useContext(AppContext);

    //function to logout for company
    const logout = () => {
        setCompanyToken(null)
        localStorage.removeItem('companyToken')
        setCompanyData(null)
        navigate('/')
    }

    useEffect(() => {
        if (companyData) {
            navigate('/dashboard/manage-jobs')
        }
    }, [companyData])
    return (
        <div className="min-h-screen">
            {/* Navbar for recruiter panel */}

            <div className="shadow py-4">
                <div className="px-5 flex justify-between items-center">
                    <img onClick={e => navigate('/')} className="max-sm:w-32 cursor-pointer" src={assets.logo} alt="" />
                    {companyData && (
                        <div className="flex items-center gap-3">
                            <p className="max-sm:hidden">Welcome,{companyData.name}</p>
                            <div className="relative ">
                                <img className="w-8 border rounded-full" src={companyData.image} alt="" onClick={() =>
                                    document.getElementById("logout-menu").classList.toggle("hidden")
                                }
                                />
                                <div
                                    id="logout-menu" className="absolute hidden  top-0 right-0 z-10 text-white rounded pt-10 text-center ">
                                    <ul className="list-none m-0 p-2 bg-red-600 rounded-md  text-sm hover:bg-amber-50 hover:text-red-600 transition-all duration-200  shadow-lg">
                                        <li onClick={logout} className="py-1 px-4 cursor-pointer  text-center ">Logout</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>


            <div className="flex items-start">
                {/* left sidebar with option to add job, mange jobs view applications */}
                <div className="inline-block min-h-screen border-r-2">
                    <ul className='flex flex-col items-start pt-5 text-gray-800'>
                        <NavLink className={({ isActive }) => `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100  border-r-4 border-blue-500'}`} to={'/dashboard/add-job'}>
                            <img className="min-w-4" src={assets.add_icon} alt="" />
                            <p className="max-sm:hidden">Add Job</p>
                        </NavLink>

                        <NavLink className={({ isActive }) => `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`} to={'/dashboard/manage-jobs'}>
                            <img className="min-w-4" src={assets.home_icon} alt="" />
                            <p className="max-sm:hidden">Manage Jobs</p>
                        </NavLink>

                        <NavLink className={({ isActive }) => `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`} to={'/dashboard/view-applications'}>
                            <img className="min-w-4" src={assets.person_tick_icon} alt="" />
                            <p className="max-sm:hidden">View Applications</p>
                        </NavLink>
                    </ul>
                </div>
                <div className="flex-1 h-full p-2 sm:p-5">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Dashboard