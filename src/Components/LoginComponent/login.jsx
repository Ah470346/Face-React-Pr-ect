import React ,{useEffect}from 'react';
import {useDispatch} from 'react-redux';
import { Form, Input, Button ,notification,Checkbox} from 'antd';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser , faLock} from '@fortawesome/free-solid-svg-icons';
import {userLogin,fetchFaceDetect,setPermission} from '../../Actions/actionCreators';
import {useHistory} from 'react-router-dom';
import authApi from '../../api/authApi';
import CheckNetwork from "../CheckNetwork";
import Logo from "../../assets/VBPO.png";
import {isMobile} from 'react-device-detect';
import {Link} from "react-router-dom";
function Login(props) {
    const history = useHistory();
    const dispatch = useDispatch();
    const Login = (user) => dispatch(userLogin(user));
    const fetchFace = ()=> dispatch(fetchFaceDetect())
    const setPermis = (user) => dispatch(setPermission(user));

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
                span: 24,
        },
    };
    const tailLayout = {
        wrapperCol: {
            span: 24
        },
    };

    const postAuth = async (user)=>{
        try {
            const response = await authApi.postAuth(user);
            if(response){
                notification.success({
                    message: `Đăng nhập thành công!`
                });
                Login(user);
                for(let property in user){
                    if(property !== 'password'){
                        localStorage.setItem(property,user[property]);
                    }
                }
                localStorage.setItem('protect',true);
                localStorage.setItem('permission',response);
                setPermis({permission: response});
                fetchFace();
                if(isMobile === true){
                    history.push('/'); 
                }else if(response === "admin"){
                    history.push('/home'); 
                } else {
                    history.push('/rtsp'); 
                }
                
                
            }
        } catch (e) {
            if (e.response && e.response.data) {
                notification.error({
                    message: `${e.response.data.message}!`
                });
              }
        }
    }

    const RedirectTest = () =>{
        history.push('/'); 
    }
    
    const onFinish = (values) => {
        if(CheckNetwork()===false){
            notification.error({
                message: 'Yêu cầu kết nối mạng !!!',
                description:
                  'Thiết bị của bạn chưa kết nối mạng',
            });
        } else{
            postAuth(values);
        }
    };
    const onFinishFailed = (errorInfo) => {
    };
    useEffect(()=>{
        const wrapLogin = document.querySelector(".wrap-login");
        wrapLogin.style.height = `${document.body.offsetHeight}px`;
    },[]);
    return (
        <div className='wrap-login'>
            <div className='login-content'>
                <div className='login'>
                    {isMobile === false && <div onClick={RedirectTest} className="test">
                        <div className="test1">
                            <div></div>
                        </div>
                        <p>TEST</p>
                    </div>}
                    <div className="logo">
                        <img width='160' height='80' alt="" src={Logo}></img>
                    </div>
                    <div className='title'>
                        <p className='singin-title'>Login me</p>
                    </div>
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        layout="vertical"  
                        size="large" 
                        >
                        <Form.Item
                            name="username"
                            rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                            ]}
                        >
                            <Input  
                                className='user-input' 
                                addonAfter={<FontAwesomeIcon icon={faUser}/>} />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                            ]}
                        >
                            <Input
                                addonAfter={<FontAwesomeIcon icon={faLock}></FontAwesomeIcon>}  
                                type="password"/>
                        </Form.Item>
                        <Form.Item className="wrap-button" {...tailLayout}>
                            <Button  className="button" danger type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                {isMobile === true && <Link to="/" className="test-link">Test me</Link>}
            </div>
        </div>
    )
}

export default Login;


