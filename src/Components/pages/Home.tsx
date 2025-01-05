import React from 'react';
import { BsTools } from 'react-icons/bs';
import { RiMentalHealthFill } from 'react-icons/ri';
import { TbBuildingHospital } from 'react-icons/tb';
import { RiHospitalLine, RiHandHeartLine, RiTruckLine } from "react-icons/ri";
import SpecialistsCarousel from '../layout/SpecialistsCarousel';
import specialistsData from '../../static-data/doctorData.json';
import products from '../../static-data/storeData.json';
import ProductCarousel from '../layout/ProductCarousel';
import TestimonialCard from '../layout/TestimonialCard';
import testimonials from '../../static-data/testimonials.json';

const Home: React.FC = () => {
    return (
        <div>
            <header >
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
                    <div className="lg:justify-self-end w-full max-w-md">
                        <form className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                            <h4 className="text-2xl font-bold text-primary-dark text-center mb-8">
                                Book Now
                            </h4>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary hover:border-primary transition-colors placeholder:text-text-light"
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary hover:border-primary transition-colors placeholder:text-text-light"
                                />
                                <input
                                    type="text"
                                    placeholder="Address"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary hover:border-primary transition-colors placeholder:text-text-light"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone No."
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary hover:border-primary transition-colors placeholder:text-text-light"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-primary hover:bg-primary-semidark text-white rounded-lg transition-colors duration-300 font-medium text-lg mt-6"
                            >
                                Book Appointment
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <section className="section__container service__container " id="service">
                <div className="service__header">
                    <div className="service__header__content mb-4">
                        <h2 className="text-4xl font-bold text-primary-dark mb-2">Our Special service</h2>
                        <p>
                            Beyond simply providing medical care, our commitment lies in
                            delivering unparalleled service tailored to your unique needs.
                        </p>
                    </div>
                    <button className="service__btn">Ask A Service</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
                    {/* Service Card 1 */}
                    <div className="group flex flex-col items-center text-center bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
                        <span className="flex items-center justify-center w-16 h-16 bg-primary-light rounded-full text-primary-semidark text-3xl shadow-md transition-colors duration-300 group-hover:bg-primary-semidark group-hover:text-white">
                            <BsTools />
                        </span>
                        <h4 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                            Functional Assessment
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                            "Precise Evaluations, Effective Solutions: Experience top-notch functional and biomechanical assessments tailored to your needs at our facility."
                        </p>
                        <a href="#" className="text-primary-dark font-medium hover:underline">
                            Learn More
                        </a>
                    </div>

                    {/* Service Card 2 */}
                    <div className="group flex flex-col items-center text-center bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
                        <span className="flex items-center justify-center w-16 h-16 bg-primary-light rounded-full text-primary-semidark text-3xl shadow-md transition-colors duration-300 group-hover:bg-primary-semidark group-hover:text-white">
                            <RiMentalHealthFill />
                        </span>
                        <h4 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                            Comprehensive Physiotherapy Evaluation
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                            "Thorough Assessments, Personalized Care: Our expert evaluations and detailed diagnostics help you stay proactive about your physical health and mobility."
                        </p>
                        <a href="#" className="text-primary-dark font-medium hover:underline">
                            Learn More
                        </a>
                    </div>

                    {/* Service Card 3 */}
                    <div className="group flex flex-col items-center text-center bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
                        <span className="flex items-center justify-center w-16 h-16 bg-primary-light rounded-full text-primary-semidark text-3xl shadow-md transition-colors duration-300 group-hover:bg-primary-semidark group-hover:text-white">
                            <TbBuildingHospital />
                        </span>
                        <h4 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                            General Physiotherapy Care
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                            "Holistic Physiotherapy for All: Trust us to provide comprehensive care to help you restore, maintain, and enhance your movement and function."
                        </p>
                        <a href="#" className="text-primary-dark font-medium hover:underline">
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            <section
                className="section__container flex flex-col lg:flex-row items-center gap-12 px-6 py-16 lg:py-24"
                id="about"
            >
                {/* Content Section */}
                <div className="about__content w-full lg:w-1/2 space-y-6">
                    <h2 className="text-4xl font-bold text-primary-dark">About Us</h2>
                    <p className="text-gray-700 leading-relaxed text-justify">
                        Welcome to PhysioCare, your trusted destination for expert physiotherapy services and comprehensive rehabilitation solutions. We are dedicated to helping you regain mobility, reduce pain, and improve your overall quality of life through personalized care and advanced therapeutic techniques.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-justify">
                        Explore our extensive range of physiotherapy treatments and wellness programs designed to address various conditions, including musculoskeletal injuries, neurological disorders, pediatric needs, and post-surgical rehabilitation. Our team of skilled physiotherapists is committed to educating, empowering, and guiding you toward a healthier, more active lifestyle.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-justify">
                        Discover practical exercise routines, ergonomic advice, and lifestyle modifications to enhance your physical and mental well-being. At PhysioCare, we believe that small, consistent steps can lead to significant improvements in your recovery journey. Let us partner with you in achieving your health and mobility goals.
                    </p>
                </div>

                {/* Image Section */}
                <div className="about__image w-full lg:w-1/2">
                    <img
                        src="https://www.reshot.com/preview-assets/illustrations/VAZ9BMYX6U/female-doctor-VAZ9BMYX6U-w1600.jpg"
                        alt="About Us"
                        className="rounded-xl shadow-lg w-full"
                    />
                </div>
            </section>

            <section
                className="section__container flex flex-col-reverse lg:flex-row items-center gap-12 px-6 py-8 lg:py-24"
                id="blog"
            >
                {/* Image Section */}
                <div className="why__image w-full lg:w-1/2 flex justify-center">
                    <img
                        src="https://img.freepik.com/free-vector/hand-drawn-flat-iranian-women-illustration_23-2149857837.jpg"
                        alt="Why Choose Us"
                        className="rounded-xl shadow-lg w-full h-auto"
                    />
                </div>

                {/* Content Section */}
                <div className="why__content w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                    <h2 className="text-4xl font-bold text-primary-dark">Why Choose Us?</h2>
                    <p className="text-gray-700 leading-relaxed">
                        With a steadfast commitment to your well-being, our team of highly trained healthcare professionals ensures that you receive nothing short of exceptional patient experiences.
                    </p>

                    {/* Grid Section */}
                    <div className="why__grid flex flex-wrap">
                        {/* Card 1 */}
                        <div className="flex items-start space-x-4">
                            <span className="bg-primary-semidark p-4 text-white rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-110">
                                <RiHospitalLine size={30} />
                            </span>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">Personalized Rehabilitation Plan</h4>
                                <p className="text-sm text-gray-600">
                                    We design tailored programs that cater to your specific condition, ensuring effective recovery and improved functionality.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="flex items-start space-x-4">
                            <span className="bg-primary-semidark p-4 text-white rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-110">
                                <RiHandHeartLine size={30} />
                            </span>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">Compassionate Care</h4>
                                <p className="text-sm text-gray-600">
                                    Our skilled physiotherapists offer a patient-centered approach, prioritizing your comfort and well-being during every session.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="flex items-start space-x-4">
                            <span className="bg-primary-semidark p-4 text-white rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-110">
                                <RiTruckLine size={30} />
                            </span>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">Home-based Therapy Options</h4>
                                <p className="text-sm text-gray-600">
                                    For your convenience, we provide physiotherapy services in the comfort of your home to aid recovery and promote independence.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="section__container service__container">
                <div className='flex flex-col items-center'>
                    <h1 className='text-4xl font-bold text-primary-dark mb-2 text-center'>
                        Our Specialists
                    </h1>
                    <p className='text-primary-semidark mb-4'>Meet our specialist with great experience</p>
                </div>
                <SpecialistsCarousel specialists={specialistsData} />
            </section>

            <section className="section__container service__container p-0 overflow-x-hidden">
                <div className='flex flex-col items-center mb-12'>
                    <h1 className='text-4xl font-bold text-primary-dark text-center'>
                        Our Products
                    </h1>
                </div>
                {/* @ts-ignore */}
                <ProductCarousel products={products} />
            </section>

            <section className="wrapper min-h-screen flex items-center justify-center">
                <div>
                    <h1>Our Happy Customer Reviews</h1>
                    <h5>Check what they say about us..</h5>

                    <div className="flex flex-wrap justify-center gap-8 px-6">
                        {testimonials.map((testimonial) => (
                            <TestimonialCard
                                key={testimonial.id}
                                name={testimonial.name}
                                designation={testimonial.designation}
                                image={testimonial.image}
                                review={testimonial.review}
                            />
                        ))}
                    </div>

                </div>
            </section>
        </div>
    );
};
export default Home;
