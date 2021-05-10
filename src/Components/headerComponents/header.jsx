import React from 'react';
import Logo from '../../assets/VBPO.png';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
  } from 'reactstrap';

function Header(props) {
    return (
        <div className='wrap-header'>
            <Navbar color="light" light expand="md">
                <NavbarBrand className="header-brand" href="/">
                    <img width='84' height='37' alt="" src={Logo}></img>
                </NavbarBrand>
                <Nav className="mr-auto" navbar>
                    <NavItem>
                        <NavLink href="/">Home</NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
        </div>
    )
}


export default Header;

