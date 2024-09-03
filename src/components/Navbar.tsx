import { Link } from "react-router-dom";
import styles from "../css/Navbar.module.css";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

const Navbar = () => {
  const auth = useAuth();

  useEffect(() => {}, [auth.isLoggedIn]);

  return (
    <div className={styles.nav} id="navbar">
      <Link className={styles.navlink} to="/manage">
        Manage Locations
      </Link>
      <Link className={styles.navlink} to="/my">
        My Locations
      </Link>
      <Link className={styles.navlink} to="/search">
        Everyone Else's Locations
      </Link>
      <Link className={styles.navlink} to="/account">
        My Account
      </Link>
      <Link className={styles.navlink} to="/userguide">
        User Guide
      </Link>
      <Link className={styles.navlink} to="/about">
        About GeoSave
      </Link>
      <Link className={styles.navlink} to="/login">
        {auth.isLoggedIn ? "Switch User" : "Login"} / Create Account
      </Link>
      {auth.isLoggedIn && (
        <a
          className={styles.navlink}
          style={{ cursor: "pointer" }}
          onClick={auth.logout}
        >
          Logout
        </a>
      )}
    </div>
  );
};

export default Navbar;
