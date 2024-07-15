import { Link } from 'react-router-dom'
import '../css/Navbar.css'


const Navbar = () => {    

    return (
        <div className="nav" id="navbar">
            <Link className="navlink" to="/mylists">My Locations</Link>
            <Link className="navlink" to="/search">Everyone Else's Locations</Link>
            <Link className="navlink" to="/account">My Account</Link>
        </div>
    )
}

export default Navbar