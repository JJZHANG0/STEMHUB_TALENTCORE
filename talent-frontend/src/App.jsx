import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import Home from './pages/Home';
import CandidateList from './pages/CandidateList';
import Navbar from './components/Navbar';

function AppRoutes() {
    const location = useLocation();
    const showNavbar = location.pathname !== '/';
    return (
        <>
            {showNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/candidates" element={<CandidateList/>}/>
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;
