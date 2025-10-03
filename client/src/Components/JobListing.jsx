import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../Context/AppContext';
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard';



const JobListing = () => {
    const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext);
    const [showFilter, setShowFilter ] = useState(true);
    const [currentPage, setCurrentage] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]); 
    const [filteredJobs, setFilteredJobs] = useState(jobs)
    const handleCategoryChange = (category) =>{
        setSelectedCategories(
            prev => prev.includes(category) ? prev.filter(cat => cat !== category) : [...prev, category]    
        )
    }
     const handleLocationChange = (location) =>{
        setSelectedLocations(
            prev => prev.includes(location) ? prev.filter(loc => loc !== location) : [...prev, location]    
        )
    }
    useEffect(()=>{
        const matchesCategory = (job) => selectedCategories.length === 0 || selectedCategories.includes(job.category);
        const matchesLocation = (job) => selectedLocations.length === 0 || selectedLocations.includes(job.location);
        const matchesTitle = (job) => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());
        const matcheslocation = (job) => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowercase());
        const newFilteredJobs = jobs.slice().reverse().filter(
            job => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matcheslocation(job)
        )
        setFilteredJobs(newFilteredJobs);
        setCurrentage(1);
        // setFilteredJobs(
        //     jobs.filter(job => matchesCategory(job) && matchesLocation(job))
        // )
        // setCurrentage(1);
    }, [jobs,selectedLocations,selectedCategories,searchFilter]);
  return (
    <div className='container 2xl:px-20 mx-auto  flex flex-col lg:flex-row max-lg:space-y-6 py-8'>
        {/* Sidebar */}
       <div className='w-1/2 lg-w-1/4 bg-white px-4 '>
        {/* Search Filter from Hero Component */}
        {
            isSearched && (searchFilter.title !== "" || searchFilter.location !== "") &&
            (
                <>
                <h3 className='font-medium text-lg mb-4'>Current Search</h3>
                <div className='mb-4 text-gray-600'>
                    {searchFilter.title && (
                        <span className='inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>
                            {searchFilter.title}
                            <img onClick={ e => setSearchFilter(prev =>({...prev,title:""})) } className='cursor-pointer' src={assets.cross_icon} alt="cross_icon" />
                        </span>
                    )}
                
                 
                    {searchFilter.location && (
                        <span className='inline-flex items-center gap-2.5 bg-red-50 border border-blue-200 px-4 py-1.5 rounded ml-2'>
                            {searchFilter.location}
                            <img onClick={ e => setSearchFilter(prev =>({...prev,location:""})) } className='cursor-pointer' src={assets.cross_icon} alt="cross_icon" />
                        </span>
                    )}
                </div>
                </>
            )
        }
    <button onClick={e => setShowFilter(prev => !prev)} className='px-6 py-1.5 rounded border border-gray-400 lg:hidden'>
        {showFilter ? "Close" : "Filters"}
    </button>


        {/* Category FIlter */}
        <div className={showFilter ? '' : 'max-lg:hidden'}>
            <h4 className='font-medium text-lg py-4'>Search By Categories</h4>
            <ul className='space-y-1.5 text-gray-800'>
                {
                    JobCategories.map((category, index) =>(
                        <li className='flex items-center gap-2' key={index}>
                            <input type="checkbox" className='mr-2 scale-125' onChange={()=>handleCategoryChange(category)} checked={selectedCategories.includes(category)}/>
                            {category}
                            </li>
                    ))
                }
            </ul>
        </div>
           {/* Location Filter */}
        <div className={showFilter ? '' : 'max-lg:hidden'}>
            <h4 className='font-medium text-lg py-4 pt-10'>Search By Locations</h4>
            <ul className='space-y-1.5 text-gray-800'>
                {
                    JobLocations.map((location, index) =>(
                        <li className='flex items-center gap-2' key={index}>
                            <input type="checkbox" className='mr-2 scale-125' onChange={()=> handleLocationChange(location)} checked={selectedLocations.includes(location)}/>
                            {location}
                            </li>
                    ))
                }
            </ul>
        </div>
       </div>
       {/* Job listings */}
       <section className=' text-gray-800 max-lg:px-2 '>
        <h3 className='font-medium text-3xl py-2' id='job-list'>Latest Jobs</h3>
        <p className='mb-8'>Get your desired job from top companies</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4'>
            {filteredJobs.slice((currentPage - 1)*6,currentPage * 6).map((job,index)=>(
                <JobCard  key={index} job={job}/>
            ))}
        </div>
        {/* Pagination */}
        {filteredJobs.length > 0 && (
            <div className='flex items-center justify-center space-x-2 mt-10'>
                <a href ="#job-list">
                    <img onClick={() => setCurrentage(Math.max(currentPage-1),1)} src={assets.left_arrow_icon} alt = ""/>
                </a>
                {Array.from({length: Math.ceil(filteredJobs.length / 6)}).map((_,index)=>(
                    <a key={index} href="#jobs-list">
                        <button onClick={() => setCurrentage(index+1)} className={`w-10 h-10 items-center justify-center border border-gray-300 rounded ${currentPage === index+1 ? 'bg-red-50 text-red-500' : 'text-gray-500'}`}>{index + 1}</button>
                    </a>
                ))}
                   <a href ="#job-list">
                    <img onClick={() => setCurrentage(Math.min(currentPage+1, Math.ceil(filteredJobs.length/6)))} src={assets.right_arrow_icon} alt = ""/>
                </a>
            </div>
        )}
       </section>
    </div>
  )
}

export default JobListing