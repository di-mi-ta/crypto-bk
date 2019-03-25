import React from 'react';
import { Parallax } from 'react-parallax';
import { Link } from 'react-router-dom';
import '../css/home/home.css';

const inlineStyle = {
    padding: 25,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)"
};

// const bg = '/'

function Home(props) {
    return (
        <div className="container home-container">
            <Parallax style={{width: "100%"}} strength={15} bgImage={'assets/images/bg3.jpg'} blur={{min: 0, max: 3}}>
                <div style={{height: 500}}>
                    <div style={inlineStyle}>
                        <div className="super-node">
                            <span>Snode-Crypto</span>
                        </div>
                        <div className="home-slogan">
                            <p>
                                One must acknowledge with cryptography no amount of violence will ever solve a math problem
                            </p>
                        </div>
                        <div className="btns-container">
                            <Link className="try-link btn-lg btn-outline-warning" to="/algorithm/des">Try to Encrypt</Link>
                        </div>
                    </div>       
                </div>
            </Parallax>
        </div>
    );
}

export default Home;