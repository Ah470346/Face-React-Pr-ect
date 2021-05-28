import React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import { Form, Input, Button, Checkbox ,notification} from 'antd';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser , faLock} from '@fortawesome/free-solid-svg-icons';
import {userLogin,fetchFaceDetect} from '../../Actions/actionCreators';
import {useHistory} from 'react-router-dom';
function Login(props) {
    const users = useSelector(state => state.users);
    // const status = useSelector(state => state.status);

    const history = useHistory();
    const dispatch = useDispatch();
    const Login = (user) => dispatch(userLogin(user));
    const fetchFace = ()=> dispatch(fetchFaceDetect())

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

    const checkUser = (users,values)=>{
        for (let i of users){
            if(values.username === i.userName && values.password === i.password ){
                return true;
            }
        }
        return false;
    }
    

    const onFinish = (values) => {
        if(checkUser(users,values) === true){
            notification.success({
                message: 'Đăng nhập thành công!'
            });
            Login(values);
            for(let property in values){
                if(property !== 'password'){
                    localStorage.setItem(property,values[property]);
                }
            }
            localStorage.setItem('protect',true);
            fetchFace();
            history.push('/');  
        } else {
            notification.error({
                message: 'Đăng nhập thất bại!',
                description: "Tài khoản hoặc mật khẩu không chính xác, xin nhập lại!"   
            });
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

                        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Form.Item className="wrap-button" {...tailLayout}>
                            <Button  danger shape="round" type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className='welcome'>
                    <div className='welcome-text'>
                        <div className='welcome-to'>
                            <p> <span>Welcome</span> to VBPO</p>
                        </div>
                        <div className='introduction'>
                            <p>Công ty cổ phần V.B.P.O là công ty chuyên về các nghiệp vụ BPO (Business Process Outsourcing – Gia công quy trình doanh nghiệp),
                                với đối tác là các doanh nghiệp Nhật Bản, Mỹ…, làm toàn bộ những công việc liên quan đến ứng dụng công nghệ thông tin, từ những 
                                công việc đơn giản nhất như nhập dữ liệu, số hóa văn bản… cho đến những công việc phức tạp hơn như dịch vụ kế toán, tài chính, 
                                chăm sóc khách hàng, xử lý đồ họa…</p>
                        </div>
                    </div>
                    <div className='welcome-bottom'></div>
                </div>
            </div>
        </div>
    )
}

export default Login;


