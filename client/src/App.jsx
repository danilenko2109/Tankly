// import { useState } from 'react'

import './App.css'
import NavBar from './components/NavBar/NavBar'
import FuelPage from './pages/FuelPage/FuelPage'
import Header from './components/Header/Header'
import AboutUsPage from './pages/AboutUsPage/AboutUsPage'
import {Routes,Route} from "react-router"
import PromotionsPage from './pages/PromotionsPage/PromotionsPage'
function App() {
  

  return (
    <>
      <div>
        
          <Routes>
            <Route path="/" element={<FuelPage/>}></Route>
            <Route path="/about-us" element={<AboutUsPage/>}></Route>
            <Route path="/check" element={<PromotionsPage/>}></Route>
          </Routes>
      
        {/* <FuelPage></FuelPage> */}
        {/* <AboutUsPage></AboutUsPage> */}
        <NavBar></NavBar>

        </div>
    </>
  )
}

export default App
