import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/login";
import Loading from "./components/common/Loading";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate loading time for Vanta background and other resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
