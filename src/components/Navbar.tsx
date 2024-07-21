import { Link } from "react-router-dom";
import styles from "../css/Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.nav} id="navbar">
      <Link className={styles.navlink} to="/my">
        My Locations
      </Link>
      <Link className={styles.navlink} to="/search">
        Everyone Else's Locations
      </Link>
      <Link className={styles.navlink} to="/account">
        My Account
      </Link>
      <Link className={styles.navlink} to="/login">
        Login / Create Account
      </Link>
    </div>
  );
};

export default Navbar;
