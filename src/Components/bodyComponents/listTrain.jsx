import React from 'react';
import { Menu, Dropdown,notification} from 'antd';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser,faImage,faEllipsisV,faCircle,faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import recognitionApi from '../../api/recognitionApi';
import {fetchFaceDetect} from '../../Actions/actionCreators';
import store from '../../store/store';

const menu = (i) => {
    const green = "#3ebd03";
    const red = "#f1422b";
    const onActive = async()=>{
        try {
            const res = await recognitionApi.editActiveRecognition({...i,Active: !i.Active });
            store.dispatch(fetchFaceDetect());
            if(res[0].Active === true){
                notification.success({
                    message:"Active successfully!!!"
                })
            } else {
                notification.success({
                    message:"Inactive successfully!!!"
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
    const onDelete = async()=>{
        try {
            const res = await recognitionApi.deleteRecognition({...i,isDelete: true });
            if(res){
                notification.success({
                    message:"Delete successfully!!!"
                })
                store.dispatch(fetchFaceDetect());
            }
        } catch (error) {
            console.log(error);
        }
    }
    return(
    <Menu style={{fontFamily:"'Roboto Slab', serif"}}>
      <Menu.Item onClick={onActive} style={{padding:"15px 40px",fontSize:"1.2em"}}>
        <FontAwesomeIcon className="menu-icon" style={{marginRight:"10px"}} color={i.Active === true ? red : green} icon={faCircle}></FontAwesomeIcon>
        {i.Active === true ? "Inactive" : "Active"}
      </Menu.Item>
      <Menu.Item onClick={onDelete} style={{padding:"15px 40px",fontSize:"1.2em"}}>
        <FontAwesomeIcon className="menu-icon" style={{marginRight:"10px"}} color={red} icon={faTrashAlt}></FontAwesomeIcon>
        Delete
      </Menu.Item>
    </Menu>
  )};

const ListTrain = ({filter}) => {;
    return (
        <div className='list-train'>
            <div className='scroll-list'>
                {
                    filter.map((i,index)=>{
                        return(
                            <div key={index} className='list-item' style={{background: i.Active === true ? "none" : "#ccc",opacity: i.Active === true ? "1" : "0.3"}}>
                                <div className="wrap-person">
                                    <FontAwesomeIcon className="icon" icon={faUser}></FontAwesomeIcon>
                                    <p>{i.label}</p>
                                </div>
                                <div className="wrap-time">
                                    <p>{i.Time}</p>
                                </div>
                                <div className="wrap-image">
                                    <p>{i.faceDetects.length}</p>
                                    <FontAwesomeIcon className="icon" icon={faImage}></FontAwesomeIcon>
                                </div>
                                <div className="wrap-channel-name">
                                    <p>{i.ChannelName}</p>
                                </div>
                                <div className="wrap-menu">
                                    <Dropdown trigger={['click']} overlay={menu(i)} placement="bottomRight">
                                        <FontAwesomeIcon className="icon" icon={faEllipsisV}></FontAwesomeIcon>
                                    </Dropdown>
                                </div>
                            </div>
                        )
                    })   
                }
            </div>
        </div>
    );
};



export default ListTrain;
