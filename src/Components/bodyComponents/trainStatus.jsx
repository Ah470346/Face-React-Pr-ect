import React,{useState} from 'react';
import { Modal, Button } from 'antd';
import Folder from '../../assets/folder.svg';
import Success from '../../assets/success.svg';
import Failed from '../../assets/failed.svg';
import {useSelector} from 'react-redux';

function TrainStatus({setShowModal,info,setInfo}) {
    const faceDescriptions = useSelector(state=> state.faceDetect)
    return (
        <Modal
          title="Kết quả Training"
          centered
          closable={false}
          visible={true}
          onOk={() => {setShowModal(false); setInfo([])}}
          onCancel={() => {setShowModal(false); setInfo([]); console.log('cancel');}}
          className='train-status'
          width='700px'
        >
            {
                info.map((i,index)=>{
                    let success;
                    for(let j of faceDescriptions){
                        if(i.name === j.label){
                            success = j.faceDetects.length
                        }
                    }
                    return(
                        <div key={index} className='wrap-item'>
                            <div className='wrap-folder'>
                                <img src={Folder} alt=""></img>
                                <p>{i.name}</p>
                            </div>
                            {
                                success !== 0 ? <div className='status'>
                                    <p className='success'>{success}/{i.images}</p>
                                    <img src={Success} alt=""></img>
                                </div>
                                : 
                                <div className='status'>
                                    <p className='failed'>{success}/{i.images}</p>
                                    <img src={Failed} alt=""></img>
                                </div>
                            }
                        </div>
                    )
                })
            }
        </Modal>
    )
}



export default TrainStatus;

