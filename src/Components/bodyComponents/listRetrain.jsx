import React, {useState,useEffect} from 'react';
import Folder from '../../assets/folder.svg';
import {Modal, Checkbox } from 'antd';
import Remove from '../../assets/delete.svg';


const ListRetrain = ({visible,setVisible,handleTrain,dataExist,dataNew}) => {
    const [listCheck , setListCheck] = useState([]);
    const [listNew , setListNew] = useState([]);
    const [listExist , setListExist] = useState([]);
    //----------------------------------------Checkbox
    const onChange = (e,index) => {
        let list = [...listCheck];
        for(let i of list){
            if(i.index === index){
                i.checked = e.target.checked;
            }
        }
        setListCheck(list);
      };
    const onDelete = (id) =>{
        const data = listNew.filter((i,index)=>{
            return index !== id;
        })
        setListNew(data);
    }
    const onOKe = () =>{
        const data = dataExist.filter((i,index)=>{
            return listCheck[index].checked !== false
        });
          ;
        setListExist([]);
        handleTrain([...data,...listNew]);
        setVisible(false);
    }
    useEffect(()=>{
        const listCheckDefault =  dataExist.map((i,index)=>{
            return {index: index , checked: false};
        });
        setListCheck(listCheckDefault);
        setListExist([...dataExist]);
        setListNew([...dataNew]);
    },[visible]);
    return (
    <>
        {visible === true && <Modal
            title="Danh sách các folders đã tải lên, chọn những folders muốn training"
            centered
            visible={visible}
            onOk={onOKe}
            onCancel={() => {setVisible(false)}}
            okText="Train"
            cancelText="Cancel"
            className='retrain-status'
            width={650}
            >
            {listExist.length !== 0 && <><p className="list-title old">Các folders đã tồn tại, chọn những folder muốn train lại:</p>
            <div className='scroll-list exist'>
                {
                    listExist.map((i,index)=>{
                        return( <div key={index} className="list-item-exist">
                            <div className="wrap-folder">
                                    <img src={Folder} alt=""></img>
                                    <p>{i.label}</p>
                            </div>
                            <div className='choose-folder'>
                                <Checkbox defaultChecked={false}  className='a' onChange={(e)=>onChange(e,index)}></Checkbox>
                            </div>
                        </div>
                        )
                    })
                }
            </div></>}
            { listNew.length !==0 && <><p className="list-title new">Các folders mới, chọn những folder muốn train:</p>
                <div className='scroll-list new'>
                {
                    listNew.map((i,index)=>{
                        return( <div key={index} className="list-item-exist">
                            <div className="wrap-folder">
                                    <img src={Folder} alt=""></img>
                                    <p>{i.label}</p>
                            </div>
                            <div className='delete-folder'>
                                <img onClick={()=>onDelete(index)} src={Remove} alt=""></img>
                            </div>
                        </div>
                        )
                    })
                }
            </div></>}
        </Modal>}
    </>
    );
};


export default ListRetrain;
