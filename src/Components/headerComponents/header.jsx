import React from 'react';
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
import {clearLogin,fetchFaceDetect,setPermission} from '../../Actions/actionCreators';
import CheckNetwork from "../CheckNetwork";
import {notification} from 'antd';
import Login from '../../assets/login.svg';
import Logout from '../../assets/logout.svg';

function Header(props) {
    const dispatch = useDispatch();
    const clearStatus = () => dispatch(clearLogin());
    const fetchFace = () => dispatch(fetchFaceDetect());
    const setPermis = (user) => dispatch(setPermission(user));
    const status = useSelector(state => state.status);;
    const signOut = ()=>{
        if(CheckNetwork()===false){
            notification.error({
                message: 'Yêu cầu kết nối mạng !!!',
                description:
                  'Thiết bị của bạn chưa kết nối mạng',
            });
        } else{
            localStorage.removeItem('username');
            localStorage.removeItem('password');
            localStorage.removeItem('remember');
            localStorage.removeItem('permission');
            localStorage.setItem('protect', false);
            setPermis({permission: ""});
            clearStatus();
        }
    } 
    return (
        <div className='wrap-header'>
            <Navbar light expand="md" className='VBPO-header'>
                <NavbarBrand className="header-brand" href="/">
                    <img alt="" src={Logo}></img>
                </NavbarBrand>
                <Nav className="mr-auto sign-in" navbar>
                    <NavItem>
                        {
                            (status.protect === 'false' || status.length ===0) ? <Link onClick={fetchFace} className='nav-link' to="/login"><img width="30px" height="30px" src={Login}/>  Log in</Link>
                            : <Link onClick={signOut} className='nav-link' to="/login"><img width="30px" height="30px"src={Logout}/>  Log out</Link>
                        }
                    </NavItem>
                </Nav>
            </Navbar>
        </div>
    )
}


export default Header;

