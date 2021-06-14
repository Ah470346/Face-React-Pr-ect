import React from 'react';
import {useDispatch} from 'react-redux';
import { Form, Input, Button, Checkbox ,notification} from 'antd';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser , faLock} from '@fortawesome/free-solid-svg-icons';
import {userLogin,fetchFaceDetect,setPermission} from '../../Actions/actionCreators';
import {useHistory} from 'react-router-dom';
import authApi from '../../api/authApi';
import CheckNetwork from "../CheckNetwork";
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
                history.push('/home'); 
            }
        } catch (e) {
            if (e.response && e.response.data) {
                notification.error({
                    message: `${e.response.data.message}!`
                });
              }
        }
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
    return (
        <div className='wrap-login'>
            <div className='login-content'>
                <div className='login'>
                    <div className='title'>
                        <p className='VBPO'>VBPO</p>
                        <p className='singin-title'>Sign into your account</p>
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
                            label="Username"
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
                                addonBefore={<FontAwesomeIcon icon={faUser}/>} 
                                placeholder='Enter the username'/>
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                            ]}
                        >
                            <Input.Password  
                                addonBefore={<FontAwesomeIcon icon={faLock}/>}  
                                placeholder='Enter the password'/>
                        </Form.Item>

                        {/* <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item> */}

                        <Form.Item className="wrap-button" {...tailLayout}>
                            <Button  danger shape="round" type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className='image-bottom'></div>
            </div>
        </div>
    )
}

export default Login;


