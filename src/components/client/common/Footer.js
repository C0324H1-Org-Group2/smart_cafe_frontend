import React from 'react';
import BlogPost from './BlogPost';
import FeaturedNews from "../news/FeaturedNews";

const Footer = () => {
    return (
        <footer className="ftco-footer ftco-section img">
            <div className="overlay"></div>
            <div className="container">
                <div className="row mb-5">
                    <div className="col-lg-3 col-md-6 mb-5 mb-md-5">
                        <div className="ftco-footer-widget mb-4">
                            <h2 className="ftco-heading-2">About Us</h2>
                            <p>Our cafe has a classic style, with a cozy and nostalgic space. The shop has a bit of nostalgia, taking you back to peaceful moments of time.</p>
                            <ul className="ftco-footer-social list-unstyled float-md-left float-lft mt-5">
                                <li className="ftco-animate"><a href="#"><span className="icon-twitter"></span></a></li>
                                <li className="ftco-animate"><a href="#"><span className="icon-facebook"></span></a></li>
                                <li className="ftco-animate"><a href="#"><span className="icon-instagram"></span></a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 mb-5 mb-md-5">
                        <div className="ftco-footer-widget mb-4">
                            <h2 className="ftco-heading-2">Recent Blog</h2>
                            <BlogPost imgUrl="image_1.jpg" title="Even the all-powerful Pointing has no control about" date="Sept 15, 2018" author="Admin" />
                            <BlogPost imgUrl="image_2.jpg" title="Even the all-powerful Pointing has no control about" date="Sept 15, 2018" author="Admin" />
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-6 mb-5 mb-md-5">
                        <div className="ftco-footer-widget mb-4 ml-md-4">
                            <h2 className="ftco-heading-2">Services</h2>
                            <ul className="list-unstyled">
                                <li><a href="#" className="py-2 d-block">Coffe</a></li>
                                <li><a href="#" className="py-2 d-block">Freeze</a></li>
                                <li><a href="#" className="py-2 d-block">Tea</a></li>
                                <li><a href="#" className="py-2 d-block">Other</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-5 mb-md-5">
                        <div className="ftco-footer-widget mb-4">
                            <h2 className="ftco-heading-2">Have a Questions?</h2>
                            <div className="block-23 mb-3">
                                <ul>
                                    <li><span className="icon icon-map-marker"></span><span className="text">Hà Nội, Việt Nam</span></li>
                                    <li><a href="#"><span className="icon icon-phone"></span><span className="text">+84 123456789</span></a></li>
                                    <li><a href="#"><span className="icon icon-envelope"></span><span className="text">mutdshop@gmail.com</span></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <p>&copy; 2024 All rights reserved | Coffe made <i className="icon-heart" aria-hidden="true"></i> by Codegym Hà Nội</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
