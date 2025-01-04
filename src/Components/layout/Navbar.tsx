import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="nav__container">
            <div className="nav__logo">
                Physio<span>Care</span>
            </div>
            <ul className="nav__links">
                <li className="link">
                    <a href="#home">Home</a>
                </li>
                <li className="link">
                    <a href="#about">About Us</a>
                </li>
                <li className="link">
                    <a href="#service">Services</a>
                </li>
                <li className="link">
                    <a href="#pages">Pages</a>
                </li>
                <li className="link">
                    <a href="#blog">Blog</a>
                </li>
                <Link to={'/store'} className="link">
                    <a href="#blog">Store</a>
                </Link>
            </ul>
            <button className="btn">Contact Us</button>
        </nav>
    );
};

export default Navbar;