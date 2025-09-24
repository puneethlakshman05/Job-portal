import {useContext, useEffect, useState} from 'react'
import { assets } from '../assets/assets';
import { AppContext } from '../Context/AppContext';

const RecruiterLogin = () => {
    const [state, setState] = useState('Login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(false);
    const[isTextDataSubmitted, setIsDataSubmitted] = useState(false);
    const {setShowRecruiterLogin} = useContext(AppContext);
    const onSubmitHandler = async(e) =>{
            e.preventDefault();
            if(state === "Sign Up" && !isTextDataSubmitted)
            {
                setIsDataSubmitted(true);
            }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        }

    })

  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
        <form onSubmit={ onSubmitHandler} className=' relative bg-white rounded-xl text-slate-500 p-10' >
            <h1 className='text-center text-2xl text-neutral-700 font-medium'>Recruiter {state}</h1>
            <p className='text-sm'>Welcome back! Please sign in to continue</p>
            {state === 'Sign Up' && isTextDataSubmitted 
            ? <>
                <div className='flex items-center gap-4 my-10'>
                    <label htmlFor='image'>
                        <img className='w-16 h-14 rounded-full' src={image ? URL.createObjectURL(image) : assets.upload_area} alt=''/>
                        <input onChange={e=>setImage(e.target.files[0])} id='image' type='file' hidden />
                    </label>
                    <p>Upload Company <br/> logo</p>
                </div>
            </>
            :  <>
            {state !== 'Login' &&(
                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.person_icon} alt=''/>
                <input className='outline-none text-sm' onChange={e => setName(e.target.value)} value={name} type='text' placeholder='Company name' required/>
            </div>
            )}
           
             <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.email_icon} alt=''/>
                <input className='outline-none text-sm' onChange={e => setEmail(e.target.value)} value={email} type='email' placeholder='Email Id' required/>
            </div>
             <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.lock_icon} alt=''/>
                <input className='outline-none text-sm' onChange={e => setPassword(e.target.value)} value={password} type='password' placeholder='Password' required/>
            </div>
          

            </>

            }
             {
             state === 'Login' && <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot Password?</p>
             }
           
             <button type='submit' className='bg-fuchsia-800 text-white w-full py-2 rounded-full mt-2'>
                {state === 'Login' ? 'login' : isTextDataSubmitted ? 'create account' : 'next'}
            </button>
            {
                state ==='Login' 
                ? <p className='text-sm mt-4 text-center'>Don't have an account?<span className='cursor-pointer text-blue-600  ' onClick={() => setState('Sign Up')}>Sign Up</span></p>
                : <p className='text-sm mt-4 text-center'>Already have an account?<span className='cursor-pointer text-blue-600' onClick={() => setState('Login')}>Login</span></p>
            }
          
            <img onClick={e => setShowRecruiterLogin(false)}  className='absolute top-5 right-5 cursor-pointer' src={assets.cross_icon} alt=''/>

        </form>
    </div>
  )
}

export default RecruiterLogin