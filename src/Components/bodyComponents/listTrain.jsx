import React,{useState,useEffect} from 'react';
import {useSelector} from 'react-redux';
import Folder from '../../assets/folder.svg';
import { Input } from 'antd';

const ListTrain = () => {
    const { Search } = Input;
    const [filter,setFilter] = useState([]);
    const faceDetects = useSelector(state => state.faceDetect);
    const onSearch = value => console.log(value);
    const onChange = (value) => {
        if(value.target.value !== "" ){
            setFilter(filter.filter((i,index)=>{
                return i.label.includes(value.target.value);
            }));
        } else {
            setFilter([...faceDetects]);
        }
        
    };
    useEffect(()=>{
        setFilter([...faceDetects]);
    },[faceDetects])
    return (
        <div className='list-train'>
            <p>Danh Sách Đã Train</p>
            <Search className='search-folder' size='large' placeholder="input search text" onChange={onChange} onSearch={onSearch} enterButton />
            <div className='scroll-list'>
                {
                    filter.map((i,index)=>{
                        return(
                            <div key={index} className='list-item'>
                                <img src={Folder} alt=""></img>
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
