import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Movies from "./component/Movies";
import Watchlist from "./component/watchlist";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Movies />} />
         <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
    </Router>
  );
}

export default App;
