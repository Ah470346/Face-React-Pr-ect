import React, {useState,useEffect} from 'react';
import { Checkbox } from 'antd';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';



const ListRetrain = ({visible,dataExist,dataNew,setDataTrain,dataTrain}) => {
    const [listCheck , setListCheck] = useState([]);
    //----------------------------------------Checkbox
    const onChange = (e,index) => {
        let arr = [...dataExist,...dataNew];
        let list = [...listCheck];
        for(let i = 0 ; i < list .length ; i++){
            if(list[i].label === index){
                list[i].checked = e.target.checked;
                if(e.target.checked == false){
                    const data = dataTrain.filter((i)=>{
                        return index !== i.label;
                    })
                    setDataTrain(data);
                } else {
                    const data = arr.filter((i)=>{
                        return index === i.label;
                    })
                    setDataTrain([...dataTrain,...data]);
                }
                
            }
        }
        setListCheck(list);
      };
    useEffect(()=>{
        let list = [...dataExist,...dataNew];
        const filter = list.map((i)=>{
            return {label:i.label, checked: true};
        })
        setListCheck(filter);
    },[dataExist,dataNew]);
    return (
    <>
        {visible === true && <div
            className='retrain-status'
            >
            <p className="list-title">List User</p>
            <div className='scroll-list'>
                {
                    dataExist.length !== 0 && dataExist.map((i,index)=>{
                        return( <div key={index} className="list-item-exist">
                            <div className="wrap-folder">
                                    <FontAwesomeIcon className="icon" icon={faUser}></FontAwesomeIcon>
                                    <p>{i.label}</p>
                            </div>
                            <div className="status exist">
                                <p>Exist</p>
                            </div>
                            <div className='choose-folder'>
                                <Checkbox defaultChecked={true}  className='a' onChange={(e)=>onChange(e,i.label)}></Checkbox>
                            </div>
                        </div>
                        )
                    })
                }
                {
                    dataNew.length !==0 && dataNew.map((i,index)=>{
                        return( <div key={index} className="list-item-exist">
                            <div className="wrap-folder">
                                    <FontAwesomeIcon className="icon" icon={faUser}></FontAwesomeIcon>
                                    <p>{i.label}</p>
                            </div>
                            <div className="status new">
                                <p>New</p>
                            </div>
                            <div className='choose-folder'>
                                <Checkbox defaultChecked={true}  className='a' onChange={(e)=>onChange(e,i.label)}></Checkbox>
                            </div>
                        </div>
                        )
                    })
                }
            </div>
        </div>}
    </>
    );
};


export default ListRetrain;
