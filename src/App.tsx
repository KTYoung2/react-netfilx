import { BrowserRouter ,Routes, Route, } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Componensts/Header";
import Trailer from "./Routes/Trailer";


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="movies/:id" element={<Home />} />
        <Route path="movies/trailer/:id" element={<Trailer />}/>
        <Route path="/tv" element={<Tv />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/:id" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
