import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../Context/AppContext';

const Navbar = () => {
    const {openSignIn} = useClerk();
    const {user} = useUser();
    // console.log(user);

    const navigate = useNavigate();
    const {setShowRecruiterLogin} = useContext(AppContext);
  return (
    <div className='shadow py-2 p-fixed z-50 !important'>
        <div className='container px-6 2xl:px-20 mx-auto flex justify-between items-center'>
            <img onClick={()=>navigate('/')} className='cursor-pointer' src={assets.logo} alt="logo" />
            {
            user
            ?<div className='flex items-center gap-3'>
                <Link to={'/applications'}>Applied Jobs</Link>
                <p>|</p>
                <p className='max-sm:hidden'>Hi,{user.firstName + " "+ user.lastName}</p>
                <UserButton/>
            </div>
            : <div className='flex gap-4 max-sm:text-sm'>
                <button onClick={e => setShowRecruiterLogin(true)} className='text-gray-600'>Recruiter Login</button>
                <button onClick={ e => openSignIn()} className='bg-red-800 text-white px-6 sm:px-9 py-2 rounded-full'>Login</button>
            </div>
            }
        </div>
    </div>
  )
}

export default Navbar