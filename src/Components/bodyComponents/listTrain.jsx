import React from 'react';
import {useSelector} from 'react-redux';
import Folder from '../../assets/folder.svg';

const ListTrain = () => {
    const faceDetects = useSelector(state => state.faceDetect)
    return (
        <div className='list-train'>
            <p>Danh Sách Đã Train</p>
            <div className='scroll-list'>
                {
                    faceDetects.map((i,index)=>{
                        return(
                            <div key={index} className='list-item'>
                                <img src={Folder}></img>
                                <p>{i.label}</p>
                            </div>
                        )
                    })   
                }
            </div>
        </div>
    );
};



export default ListTrain;
