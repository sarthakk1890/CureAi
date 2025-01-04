import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="section__container footer__container">
                <div className="footer__col">
                    <h3>
                        Physio<span>Care</span>
                    </h3>
                    <p>
                        We are honored to be a part of your healthcare journey and committed
                        to delivering compassionate, personalized, and top-notch care every
                        step of the way.
                    </p>
                    <p>
                        Trust us with your health, and let us work together to achieve the
                        best possible outcomes for you and your loved ones.
                    </p>
                </div>
                <div className="footer__col">
                    <h4>About Us</h4>
                    <p>Home</p>
                    <p>About Us</p>
                    <p>Work With Us</p>
                    <p>Our Blog</p>
                    <p>Terms & Conditions</p>
                </div>
                <div className="footer__col">
                    <h4>Services</h4>
                    <p>Search Terms</p>
                    <p>Advance Search</p>
                    <p>Privacy Policy</p>
                    <p>Suppliers</p>
                    <p>Our Stores</p>
                </div>
                <div className="footer__col">
                    <h4>Contact Us</h4>
                    <p>
                        <i className="ri-map-pin-2-fill"></i>M.A.M.C, Agroha
                    </p>
                    <p>
                        <i className="ri-mail-fill"></i> support@physiocare.com
                    </p>
                    <p>
                        <i className="ri-phone-fill"></i>9536773981
                    </p>
                </div>
            </div>
            <div className="footer__bar">
                <div className="footer__bar__content">
                    <p>PhysioCare</p>
                    <div className="footer__socials">
                        <span>
                            <i className="ri-instagram-line"></i>
                        </span>
                        <span>
                            <i className="ri-facebook-fill"></i>
                        </span>
                        <span>
                            <i className="ri-heart-fill"></i>
                        </span>
                        <span>
                            <i className="ri-twitter-fill"></i>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;