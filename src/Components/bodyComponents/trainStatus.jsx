import React from 'react';
import { Modal } from 'antd';
import Folder from '../../assets/folder.svg';
import Success from '../../assets/success.svg';
import Failed from '../../assets/failed.svg';
import {useSelector} from 'react-redux';

function TrainStatus({setShowModal,info,setInfo}) {
    const faceDescriptions = useSelector(state=> state.faceDetect);
    return (
        <Modal
          title="Kết quả Training"
          centered
          closable={false}
          visible={true}
          onOk={() => {setShowModal(false); setInfo([])}}
          cancelButtonProps ={{ style:{ display: 'none' }} }
          className='train-status'
          width='700px'
        >
            <div className="scroll-list-train">
            {
                info.map((i,index)=>{
                    let success;
                    for(let j of faceDescriptions){
                        if(i.name === j.label && i.images === j.faceDetects.length){
                            success = j.faceDetects.length;
                            break;
                        } else {
                            success = 0;
                        }
                    }
                    return(
                        <div key={index} className='wrap-item'>
                            <div className='wrap-folder'>
                                <img src={Folder} alt=""></img>
                                <p>{i.name}</p>
                            </div>
                            {
                                success !== 0 && i.bestMatch.label !== "" && <div className="best-match">
                                    <p style={{width:"90px"}}><b>≈ {i.bestMatch.label}</b></p>
                                    <p style={(100-(i.bestMatch.distance*100).toFixed(2)) <= 50 ? {background:"rgb(11, 168, 63)",color:"white"} :{background:"rgb(241, 45, 11)",color:"white"}}>
                                        ({(100-(i.bestMatch.distance*100)).toFixed(2)}%)</p>
                                </div>
                            }
                            {
                                success !== 0 ? <div className='status'>
                                    <p className='success'>{success}/{i.total}</p>
                                    <img src={Success} alt=""></img>
                                </div>
                                : 
                                <div className='status'>
                                    <p className='failed'>{success}/{i.total}</p>
                                    <img src={Failed} alt=""></img>
                                </div>
                            }
                        </div>
                    )
                })    
            }
            </div>
        </Modal>
    )
}



export default TrainStatus;

