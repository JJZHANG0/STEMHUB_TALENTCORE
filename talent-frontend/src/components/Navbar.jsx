import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className="navbar">
            <div className="navbar-logo">STEMHUB</div>
            <button className="navbar-logout" onClick={() => navigate('/')}>LOGOUT</button>
        </nav>
    );
} 