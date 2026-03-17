import { Link } from "react-router-dom";
import logo from "../assets/tydline-sqaurlogo.png";

function Header() {
  return (
    <div className="w-full flex items-center justify-center h-24">
      <div className="flex items-center gap-14">
        <Link to="/solutions">Solutions</Link>
        <Link to="/contact">Contact Us</Link>
        <img src={logo} className="w-20" alt="Tydline Logo" />
        <Link to="/about">About Us</Link>
        <Link to="/pricing">Pricing</Link>
      </div>
    </div>
  );
}

export default Header;
