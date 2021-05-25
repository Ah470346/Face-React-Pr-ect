import React,{useEffect} from 'react';
import Logo from '../../assets/VBPO.png';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
  } from 'reactstrap';
  import {
    Link
} from "react-router-dom";
import {useSelector,useDispatch} from 'react-redux';
import {clearLogin} from '../../Actions/actionCreators';

function Header(props) {
    const dispatch = useDispatch();
    const clearStatus = () => dispatch(clearLogin());
    const status = useSelector(state => state.status);;
    const signOut = ()=>{
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('remember');
        localStorage.setItem('protect', false);
        clearStatus();
    } 
    return (
        <div className='wrap-header'>
            <Navbar color="light" light expand="md" className='VBPO-header'>
                <NavbarBrand className="header-brand" href="/">
                    <img width='84' height='37' alt="" src={Logo}></img>
                </NavbarBrand>
                <Nav className="mr-auto" navbar>
                    <NavItem>
                        <Link className='nav-link' to="/">Home</Link>
                    </NavItem>
                </Nav>
                <Nav className="mr-auto sign-in" navbar>
                    <NavItem>
                        {
                            (status.protect === 'false' || status.length ===0) ? <Link className='nav-link' to="/login">Sign in</Link>
                            : <Link onClick={signOut} className='nav-link' to="/login">Sign out</Link>
                        }
                        
                    </NavItem>
                </Nav>
            </Navbar>
        </div>
    )
}


export default Header;

