import React,{useState,useEffect} from 'react';
import Add from '../../assets/add.svg';
import {useSelector,useDispatch} from 'react-redux';
import {fetchChannel} from '../../Actions/actionCreators';
import {Modal,notification,Popconfirm} from 'antd';
import channelAPI from '../../api/channelsApi';

function Channel(props) {
    const dispatch = useDispatch();
    const channels = useSelector(state => state.channel);
    const fetchChannels = () => dispatch(fetchChannel());
    const [addVisible,setAddVisible] = useState(false);
    const [editVisible,setEditVisible] = useState(false);
    const [selectChannel,setSelectChannel] = useState();
    const checkChannelAdd = (channel) =>{
        for(let i of channels){
            if(i.ChannelName === channel.ChannelName){
                return "Tên của channel đã tồn tại !!!";
            }
            if(i.CameraIP === channel.CameraIP){
                return "IP camera của channel đã tồn tại !!!";
            }
        }
        return true;
    }
    const checkChannelEdit = (data,channel) =>{
        for(let i of channels){
            if(i.ChannelName !== channel.ChannelName && i.ChannelName === data.ChannelName){
                return "Tên của channel đã tồn tại !!!";
            }
            if(i.CameraIP !== channel.CameraIP && i.CameraIP === data.CameraIP){
                return "IP camera của channel đã tồn tại !!!";
            }
        }
        return true;
    }
    const checkField = (data) =>{
        if(data.ChannelName === undefined || data.ChannelName === ""){
            notification.error({
                message: "Bạn chưa nhập Channel name !!!"
            })
            return false
        } else if(data.CameraIP === undefined || data.CameraIP === ""){
            notification.error({
                message: "Bạn chưa nhập IP camera !!!"
            })
            return false
        } else if(data.OfficeName === undefined || data.getOfficeName === ""){
            notification.error({
                message: "Bạn chưa nhập Office name !!!"
            })
            return false
        }
        return true;
    }
    const onAdd = async () =>{
        const data = {
            ChannelName: document.getElementById('input-channel-name').value,
            CameraIP:document.getElementById('input-ip-camera').value,
            OfficeName:document.getElementById('input-office-name').value
        }
        if(checkField(data) === true){
            if(checkChannelAdd(data) !== true){
                notification.error({
                    message: checkChannelAdd(data)
                })
            } else {
                const response = await channelAPI.postChannel(data);
                if(response){
                    notification.success({
                        message: "Thêm channel thành công !"
                    })
                    setAddVisible(false);
                    fetchChannels();
                }else {
                    notification.error({
                        message: "Thêm channel thất bại !"
                    })
                    setAddVisible(false);
                }
            }
        }
    }
    const onEdit = async (channel) =>{
        const data = {
            ChannelName: document.getElementById('input-channel-name-edit').value,
            CameraIP:document.getElementById('input-ip-camera-edit').value,
            OfficeName:document.getElementById('input-office-name-edit').value
        }
        if(checkField(data) === true){
            if(checkChannelEdit(data,channel) !== true){
                notification.error({
                    message: checkChannelEdit(data,channel)
                })
            } else {
                const response = await channelAPI.editChannel({condition:channel.ChannelName, channel: data});
                if(response){
                    notification.success({
                        message: "Sửa channel thành công !"
                    })
                    setEditVisible(false);
                    fetchChannels();
                } else {
                    notification.error({
                        message: "Sửa channel thất bại !"
                    })
                    setEditVisible(false);
                }
            }
        }
    }
    const onDelete = async (channel)=>{
        const response = await channelAPI.deleteChannel(channel);
        if(response){
            notification.success({
                message: "Xóa channel thành công !"
            })
            setEditVisible(false);
            fetchChannels();
        } else {
            notification.error({
                message: "Xóa channel thất bại !"
            })
            setEditVisible(false);
        }
    }
    useEffect(()=>{
        fetchChannels();
    },[channels.length]);
    return (
        <div className="wrap-channel">
            <p>List Channels</p>
            <div className="wrap-list">
                <ul className="list">
                    <li >
                        <div onClick={()=>{setAddVisible(true)}} className="add-channel-item">
                            <img width="30" height="30" src={Add} alt="" />
                            <p>Add Channel</p>
                        </div>
                    </li>
                    {
                        channels.map((i,index)=>{
                            return(
                                <li key={index}> 
                                    <div onClick={()=> {setSelectChannel(i);setEditVisible(true)}} className="channel-item">
                                        <p>{i.ChannelName}</p>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <Modal
            title="Add Channel"
            centered
            visible={addVisible}
            onCancel={()=>setAddVisible(false)}
            cancelButtonProps ={{ style:{ display: 'none' }} }
            onOk={()=>onAdd()}
            className="channel-modal add"
            width="800px"
            >
                <div className="wrap-content-modal">
                    <div className="field channel-name">
                        <p>Channel Name</p>
                        <input id="input-channel-name"  type="text" />
                    </div>
                    <div className="field ip-camera">
                        <p>IP Camera</p>
                        <input id="input-ip-camera"   type="text" />
                    </div>
                    <div className="field office-name">
                        <p>Office Name</p>
                        <input id="input-office-name"   type="text" />
                    </div>
                </div>
            </Modal>
            <Modal
            title="Channel Detail"
            centered
            visible={editVisible}
            onCancel={()=>{setEditVisible(false)}}
            cancelButtonProps ={{ style:{ display: 'none' }} }
            okButtonProps = {{ style:{ display: 'none' }} }
            className="channel-modal edit"
            footer={[
            <Popconfirm key="1" placement="top" title="Are you sure you want to save?" onConfirm={()=>onEdit(selectChannel)} okText="Yes" cancelText="No">
                <button className="btn-save">Save</button>
            </Popconfirm>,
            <Popconfirm key="2" placement="top" title="Are you sure you want to delete?" onConfirm={()=>onDelete(selectChannel)} okText="Yes" cancelText="No">
                <button className="btn-delete">Delete</button>
            </Popconfirm>]}
            width="800px"
            >
                <div className="wrap-content-modal">
                    <div className="field channel-name">
                        <p>Channel Name</p>
                        <div key={selectChannel && selectChannel.ChannelName}>
                            <input id="input-channel-name-edit" defaultValue={selectChannel && selectChannel.ChannelName}  type="text" />
                        </div>
                    </div>
                    <div className="field ip-camera">
                        <p>IP Camera</p>
                        <div key={selectChannel && selectChannel.CameraIP}>
                            <input id="input-ip-camera-edit" defaultValue={selectChannel && selectChannel.CameraIP} type="text" />
                        </div>
                    </div>
                    <div className="field office-name">
                        <p>Office Name</p>
                        <div key={selectChannel && selectChannel.OfficeName}>
                            <input id="input-office-name-edit" defaultValue={selectChannel && selectChannel.OfficeName} type="text" />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Channel;

