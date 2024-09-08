import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./realtimemonitoring/display";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


function App() {


  return (
    
    <BrowserRouter>
    <Navbar />
      <Routes>
      <Route exact path="/" element={<Landing />} />        
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
      <Footer />


    </BrowserRouter>
  )
}

export default App
