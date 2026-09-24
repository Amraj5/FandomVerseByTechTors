import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/homepage"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        {/* <Route path="/explore" element={<Explore />} /> */}

       </Routes>
    </BrowserRouter>
  );
}



export default App;