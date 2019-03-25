import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import '../css/header/header.css';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isNavOpen: false
        };
        this.toggleNav = this.toggleNav.bind(this);
    }

    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }

    render() {
        return(
            <React.Fragment>
                <Navbar dark expand="md">
                    <div className="container">
                        <NavbarToggler onClick={this.toggleNav} />
                        <NavbarBrand className="mr-3 home-link" href="/home">
                            <span>Snode-Crypto</span>
                        </NavbarBrand>
                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink className="nav-link mr-1 small" to="/algorithm/des">
                                        DES
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link mr-1 small" to="/algorithm/aes">
                                        AES
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link mr-1 small" to="/algorithm/rsa">
                                        RSA
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link mr-1 small" to="/aboutus">
                                        About Us
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </div>
                </Navbar>
            </React.Fragment>
        );
    }
}

export default Header;