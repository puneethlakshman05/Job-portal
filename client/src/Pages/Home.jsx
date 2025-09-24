import AppDownload from "../Components/AppDownload"
import Footer from "../Components/Footer"
import Hero from "../Components/Hero"
import JobListing from "../Components/JobListing"
import Navbar from "../Components/Navbar"

const Home = () => {
  return (
    <div>
        <Navbar />
        <Hero />
        <JobListing/>
        <AppDownload/>
        <Footer/>
    </div>
  )
}

export default Home