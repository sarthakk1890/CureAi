import React from 'react';
import { BsTools } from 'react-icons/bs';
import { RiMentalHealthFill } from 'react-icons/ri';
import { TbBuildingHospital } from 'react-icons/tb';
import SpecialistsCarousel from '../layout/SpecialistsCarousel';
import specialistsData from '../../static-data/doctorData.json';

const Home: React.FC = () => {
    return (
        <div>
            <header>
                <div className="section__container header__container" id="home">
                    <div className="header__content">
                        <h1>Providing an Exceptional Patient Experience</h1>
                        <p>
                            Welcome, where exceptional patient experiences are our priority.
                            With compassionate care, state-of-the-art facilities, and a
                            patient-centered approach, we're dedicated to your well-being.
                            Trust us with your health and experience the difference.
                        </p>
                        <button className="btn">See Services</button>
                    </div>
                    <div className="header__form">
                        <form>
                            <h4>Book Now</h4>
                            <input type="text" placeholder="First Name" />
                            <input type="text" placeholder="Last Name" />
                            <input type="text" placeholder="Address" />
                            <input type="text" placeholder="Phone No." />
                            <button className="btn form__btn">Book Appointment</button>
                        </form>
                    </div>
                </div>
            </header>

            <section className="section__container service__container" id="service">
                <div className="service__header">
                    <div className="service__header__content">
                        <h2 className="section__header">Our Special service</h2>
                        <p>
                            Beyond simply providing medical care, our commitment lies in
                            delivering unparalleled service tailored to your unique needs.
                        </p>
                    </div>
                    <button className="service__btn">Ask A Service</button>
                </div>
                <div className="service__grid">
                    <div className="service__card">
                        <span><BsTools /></span>
                        <h4>Functional Assessment</h4>
                        <p>
                            "Precise Evaluations, Effective Solutions: Experience top-notch functional and biomechanical assessments tailored to your needs at our facility."
                        </p>
                        <a href="#">Learn More</a>
                    </div>
                    <div className="service__card">
                        <span><RiMentalHealthFill /></span>
                        <h4>Comprehensive Physiotherapy Evaluation</h4>
                        <p>
                            "Thorough Assessments, Personalized Care: Our expert evaluations and detailed diagnostics help you stay proactive about your physical health and mobility."
                        </p>
                        <a href="#">Learn More</a>
                    </div>
                    <div className="service__card">
                        <span><TbBuildingHospital /></span>
                        <h4>General Physiotherapy Care</h4>
                        <p>
                            "Holistic Physiotherapy for All: Trust us to provide comprehensive care to help you restore, maintain, and enhance your movement and function."
                        </p>
                        <a href="#">Learn More</a>
                    </div>
                </div>
            </section>

            <section className="section__container service__container">
                <div className='flex flex-col items-center'>
                    <h1 className='section__header text-center'>
                        Our Specialists
                    </h1>
                    <p className='text-primary-semidark'>Meet our specialist with great experience</p>
                </div>
                <SpecialistsCarousel specialists={specialistsData} />
            </section>

            <section className="section__container about__container" id="about">
                <div className="about__content">
                    <h2 className="section__header">About Us</h2>
                    <p>
                        Welcome to PhysioCare, your trusted destination for expert physiotherapy services and comprehensive rehabilitation solutions. We are dedicated to helping you regain mobility, reduce pain, and improve your overall quality of life through personalized care and advanced therapeutic techniques.
                    </p>
                    <p>
                        Explore our extensive range of physiotherapy treatments and wellness programs designed to address various conditions, including musculoskeletal injuries, neurological disorders, pediatric needs, and post-surgical rehabilitation. Our team of skilled physiotherapists is committed to educating, empowering, and guiding you toward a healthier, more active lifestyle.
                    </p>
                    <p>
                        Discover practical exercise routines, ergonomic advice, and lifestyle modifications to enhance your physical and mental well-being. At PhysioCare, we believe that small, consistent steps can lead to significant improvements in your recovery journey. Let us partner with you in achieving your health and mobility goals.
                    </p>
                </div>
                <div className="about__image">
                    <img src="https://www.reshot.com/preview-assets/illustrations/VAZ9BMYX6U/female-doctor-VAZ9BMYX6U-w1600.jpg" alt="about" />
                </div>
            </section>
        </div>
    );
};
export default Home;
