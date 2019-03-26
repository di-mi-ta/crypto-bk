import React from 'react';
import '../css/footer/footer.css';
import { Link } from 'react-router-dom';
import { SocialIcon } from 'react-social-icons';

function Footer(props) {
    return(
        <div className="footer">
            <div className="container footer-container">
                <div className="row justify-content-center">
                    <div className="col-md-3 col-xs-12 offset-1">
                        <h2 className="mb-0">Super Node</h2>
                        <h2>Crypto</h2>
                        <p>No hacker can beat us.</p>
                    </div>           
                    <div className="col-md-2 col-xs-12">
                        <h5>Explore</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/home">Home</Link></li>
                            <li><Link to="/algorithm/rabbit">RABBIT</Link></li>
                            <li><Link to="/algorithm/aes">AES</Link></li>
                            <li><Link to="/algorithm/rsa">RSA</Link></li>
                            <li><Link to="/aboutus">About Us</Link></li>
                            <li><Link to="/help">Help</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-2 col-xs-12">
                        <h5>Visit</h5>
                        <address>
                            268 Ly Thuong Kiet St.<br />
                            District 10, TP.HCM<br />
                            Socialist Republic of Vietnam<br />
                        </address>
                        <br />
                        <h5>Business</h5>
                        <address>
                            +84 35 8684 926<br />
                            SNodeCrypto.com<br />
                        </address>
                    </div>
                    <div className="col-md-4 col-xs-12 align-self-center social-icons-container">
                        <h5>Follow Us</h5>
                        <div>
                            <SocialIcon style={{height: 30, width: 30, margin: 4}} url="https://www.google.com" fgColor="#ffffff"/>
                            <SocialIcon style={{height: 30, width: 30, margin: 4}} url="https://www.facebook.com/love100009524072443" fgColor="#ffffff"/>
                            <SocialIcon style={{height: 30, width: 30, margin: 4}} url="https://www.twitter.com/" fgColor="#ffffff"/>
                            <SocialIcon style={{height: 30, width: 30, margin: 4}} url="https://linkedin.com/" fgColor="#ffffff"/>
                            <SocialIcon style={{height: 30, width: 30, margin: 4}} url="https://www.cse.hcmut.edu.vn" label="CSE" fgColor="#ffffff"/>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">             
                    <div className="col-auto">
                        <p className="mb-0">© Copyright @2019 SNodeCrypto.com. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;