import React,{useState,useEffect} from 'react';
import { Modal ,Button,Select,Input,Checkbox,notification} from 'antd';
import {useSelector,useDispatch} from 'react-redux';
import recognitionApi from '../../api/recognitionApi';
import {fetchFaceDetect} from '../../Actions/actionCreators';
import {
    RightOutlined,
    LeftOutlined,
    SearchOutlined
  } from '@ant-design/icons';

const {Option} = Select;
const CheckboxGroup = Checkbox.Group;

function Modify({setShowModalModify}) {
    const dispatch = useDispatch();
    const [selectChannel,setSelectChannel] = useState({left:"",right:""});
    const [checkAll,setCheckAll] = useState({left:false,right:false});
    const [indeterminate,setIndeterminate] = useState({left:false,right:false});
    const [listChecked,setListChecked] = useState({left:[],right:[]});
    const [plainOptions,setPlainOptions] = useState({left:[],right:[]});
    const faceDescriptions = useSelector(state => state.faceDetect);
    const channels = useSelector(state => state.channel);
    const [select,setSelect] = useState({left:"choose channel",right:"choose channel"});
    const [input,setInput] = useState({left:"",right:""});
    const [active,setActive] = useState(false);
    const [visibleWarning,setVisibleWarning] = useState(false);
    const [visibleConfirm,setVisibleConfirm] = useState(false);
    const [warning,setWarning] = useState({title:"",content:""}); 
    const [defaultArray,setDefaultArray] = useState({left:[],right:[]});
    const fetchFaceDetects = () => dispatch(fetchFaceDetect());

    const setToDefault = () =>{
        setPlainOptions({right:[],left:[]});
        setDefaultArray({right:[],left:[]});
        setListChecked({left:[],right:[]});
        setIndeterminate({left:false,right:false});
        setSelectChannel({left:"",right:""});
        setCheckAll({left:false,right:false});
        setSelect({left:"choose channel",right:"choose channel"});
        setInput({left:"",right:""});
        
    }

    const handleChange = (value,direction) =>{
        if(direction === "left"){
            setSelectChannel({...selectChannel,left: value});
            const list = faceDescriptions.filter((i)=>{
                return i.ChannelName === value && i.Active !== false;
            });
            setPlainOptions({right:[],left:list.map((i)=> i.label)});
            setDefaultArray({...defaultArray,left:list.map((i)=> i.label)});
            setListChecked({left:[],right:[]});
            setIndeterminate({left:false,right:false});
            setSelect({...select,left:value});
        } else {
            setSelectChannel({...selectChannel,right: value});
            setSelect({...select,right:value});
        }
    }
    const onSearch = (value,direction) =>{
        if(direction === "left"){
            const filter = defaultArray.left.filter((i)=>{
                return i.includes(value.target.value);
            })
            if(value.target.value !== ""){
                setPlainOptions({...plainOptions,left:[...filter]})
            } else if(value.target.value === ""){
                setPlainOptions({...plainOptions,left:defaultArray.left});
            }
            setInput({...input,left:value.target.value});
        }
        if(direction === "right"){
            const filter = defaultArray.right.filter((i)=>{
                return i.includes(value.target.value);
            })
            if(value.target.value !== ""){
                setPlainOptions({...plainOptions,right:[...filter]})
            } else if(value.target.value === ""){
                setPlainOptions({...plainOptions,right:defaultArray.right});
            }
            setInput({...input,right:value.target.value});
        }
    }
    const onCheck = (list,direction) =>{
        if(direction === "left"){
            setListChecked({...listChecked,left:list});
            setIndeterminate({...indeterminate,left:list.length !==0 && list.length < plainOptions.left.length? true : false});
            setCheckAll({...checkAll,left:list.length === plainOptions.left.length});
        } else if(direction === "right"){
            setListChecked({...listChecked,right:list});
            setIndeterminate({...indeterminate,right:list.length !==0 && list.length < plainOptions.right.length? true : false});
            setCheckAll({...checkAll,right:list.length === plainOptions.right.length});
        }
    }
    const onCheckAll = (value,direction) =>{
        if (direction === "left") {
            setListChecked(value.target.checked ? {...listChecked,left:plainOptions.left} : {...listChecked,left:[]});
            setIndeterminate({...indeterminate,left : false});
            setCheckAll({...checkAll,left:value.target.checked});
        } else if(direction === "right") {
            setListChecked(value.target.checked ? {...listChecked,right:plainOptions.right} : {...listChecked,right:[]});
            setIndeterminate({...indeterminate,right : false});
            setCheckAll({...checkAll,right:value.target.checked});
        }
    }
    const onConvert = (value,direction)=>{
        if(selectChannel.right === ""){
            notification.error({
                message:"You haven't selected the channel to change !!!"
            })
        } else {
            if(active === false){
                if(direction === "left"){
                    const leftArray = defaultArray.left.filter((i)=>{
                        return !value.includes(i);
                    })
                    setPlainOptions({left:[...leftArray],right:[...value,...defaultArray.right]});
                    setListChecked({...listChecked,left:[]});
                    setDefaultArray({left:[...leftArray],right:[...value,...defaultArray.right]});
                    setIndeterminate({right:checkAll.right === true ? true : false,left:false});
                    setCheckAll({right:false,left:false});
                }else if(direction === "right"){
                    const rightArray = defaultArray.right.filter((i)=>{
                        return !value.includes(i);
                    })
                    setPlainOptions({left:[...value,...defaultArray.left],right:[...rightArray]});
                    setListChecked({...listChecked,right:[]});
                    setDefaultArray({left:[...value,...defaultArray.left],right:[...rightArray]});
                    setIndeterminate({left:checkAll.left === true ? true : false,right:false});
                    setCheckAll({right:false,left:false});
                }
            } else {
                if(direction === "left"){
                    setPlainOptions({...plainOptions,right:[...value,...defaultArray.right]});
                    setListChecked({...listChecked,left:[]});
                    setDefaultArray({...defaultArray,right:[...value,...defaultArray.right]});
                    setIndeterminate({right:checkAll.right === true ? true : false,left:false});
                    setCheckAll({right:false,left:false});
                }else if(direction === "right"){
                    const rightArray = defaultArray.right.filter((i)=>{
                        return !value.includes(i);
                    })
                    setPlainOptions({left:[...defaultArray.left],right:[...rightArray]});
                    setListChecked({...listChecked,right:[]});
                    setDefaultArray({left:[...defaultArray.left],right:[...rightArray]});
                    setIndeterminate({left:checkAll.left === true ? true : false,right:false});
                    setCheckAll({right:false,left:false});
                }
            }
        }
    }
    const onClick = (action) =>{
        if(action === "move" && active === true && defaultArray.right.length === 0){
            setToDefault();
            setActive(false);
        } else if (action === "clone" && active === false && defaultArray.right.length === 0){
            setToDefault();
            setActive(true);
        } else if (action === "move" && active === true && defaultArray.right.length !== 0){
            setWarning({title:"Warning",content:"You haven't successfully cloned. Do you want clone? "});
            setVisibleWarning(true);
        }  else if (action === "clone" && active === false && defaultArray.right.length !== 0){
            setWarning({title:"Warning",content:"You haven't successfully moved. Do you want move? "});
            setVisibleWarning(true);
        }
        
    }
    const onSubmit = async (action) =>{
        if(action === "move" && active === true && defaultArray.right.length !== 0){
            try {
                const res = await recognitionApi.cloneRecognition({label:defaultArray.right,FromChannel:selectChannel.left,ToChannel: selectChannel.right});
                if(res){
                    setToDefault();
                    setActive(false);
                    setVisibleWarning(false);
                    fetchFaceDetects();
                }
            } catch (error) {
                console.log(error);
            }
        } else if (action === "clone" && active === false && defaultArray.right.length !== 0){
            try {
                const res = await recognitionApi.moveRecognition({label:defaultArray.right,FromChannel:selectChannel.left,ToChannel: selectChannel.right});
                if(res){
                    setToDefault();
                    setActive(true);
                    setVisibleWarning(false);
                    fetchFaceDetects();
                }
            } catch (error) {
                console.log(error);
            }
        } else if(action === "move" && active === true && defaultArray.right.length === 0){
            setToDefault();
            setActive(false);
            setVisibleWarning(false);
        } else if(action === "clone" && active === false && defaultArray.right.length === 0){
            setToDefault();
            setActive(true);
            setVisibleWarning(false);
        }
    }
    const onCantSubmit = (action) =>{
        if(action === "move" && active === true){
            setToDefault();
            setActive(false);
            setVisibleWarning(false);
        } else if (action === "clone" && active === false){
            setToDefault();
            setActive(true);
            setVisibleWarning(false);
        }
    }
    const onCancel = () =>{
        setVisibleWarning(false);
    }

    const onFinalSubmit = async () =>{
        if(active === false && defaultArray.right.length !== 0){
            try {
                const res = await recognitionApi.moveRecognition({label:defaultArray.right,FromChannel:selectChannel.left,ToChannel: selectChannel.right});
                if(res){
                    console.log(defaultArray.right,selectChannel.left,selectChannel.right);
                    setToDefault();
                    setShowModalModify(false);
                    fetchFaceDetects();
                }
            } catch (error) {
                console.log(error);
            }
        } else if (active === true &&  defaultArray.right.length !== 0){
            try {
                const res = await recognitionApi.cloneRecognition({label:defaultArray.right,FromChannel:selectChannel.left,ToChannel: selectChannel.right});
                if(res){
                    setToDefault();
                    setShowModalModify(false);
                    fetchFaceDetects();
                }
            } catch (error) {
                console.log(error);
            }
        } else if(active === false && defaultArray.right.length === 0){
            notification.error({
                message:"Please select data to submit!!!",
            });
        } else if(active === true && defaultArray.right.length === 0){
            notification.error({
                message:"Please select data to submit!!!",
            })
        }
    }
    function isOverflown(element) {
        return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
    }
    useEffect(() => {
        const list1 = document.getElementById("list1");
        const list2 = document.getElementById("list2");
        const listItem1 = document.querySelectorAll(".left-column .ant-checkbox-wrapper");
        const listItem2 = document.querySelectorAll(".right-column .ant-checkbox-wrapper");
        if(isOverflown(list1)){
            for(let i of listItem1){
                i.style.paddingRight = "10px";
            }
        } else {
            for(let i of listItem1){
                i.style.paddingRight = "27px";
            }
        }
        if(isOverflown(list2)){
            for(let i of listItem2){
                i.style.paddingRight = "10px";
            }
        } else {
            for(let i of listItem2){
                i.style.paddingRight = "27px";
            }
        }
    }, [select.left,defaultArray.right,defaultArray.left,input]);

    return (
        <Modal
          centered
          visible={true}
          onCancel={()=>setShowModalModify(false)}
          cancelButtonProps ={{ style:{ display: 'none' }} }
          className='modify-modal'
          width='850px'
          footer={[
            <button onClick={()=> setVisibleConfirm(true)} className="modify-submit" key="1">Submit</button>
        ]}
        >
            <div className="wrap-transfer">
                <div className="top-transfer">
                    <button 
                        style={active === false ? {color:"rgb(19, 19, 134)",border:"2px solid rgb(19, 19, 134)",fontWeight:"600"}:{}} 
                        className="button move"
                        onClick={()=> onClick("move")}>Move</button>
                    <button 
                        style={active === true ? {color:"rgb(19, 19, 134)",border:"2px solid rgb(19, 19, 134)",fontWeight:"600"}:{}} 
                        className="button clone"
                        onClick={()=> onClick("clone")}>Clone</button>
                </div>
                <div className="body-transfer">
                    <div className="left-column">
                        <div className="top">
                            <Select value={select.left} onChange={(value)=>handleChange(value,"left")}>
                                {
                                    channels.map((i,index)=>{
                                        return (
                                            <Option value={i.ChannelName} key={index}>{i.ChannelName}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </div>
                        <div className="body">
                            <div className="search-body">
                                <Input value={input.left} className="search-input" onChange={(e)=>onSearch(e,"left")} suffix={<SearchOutlined style={{color:"#bfbfbf"}}/>} placeholder="Search here"></Input>
                            </div>
                            <div id="list1" className="list-item">
                                <Checkbox className="check-all" checked={checkAll.left} indeterminate={indeterminate.left} onChange={(value)=>onCheckAll(value,"left")}></Checkbox>
                                <CheckboxGroup  options={plainOptions.left}  value={listChecked.left} onChange={(value)=>onCheck(value,"left")}/>
                            </div>
                        </div>
                    </div>
                    <div className="convert-column">
                        <Button 
                            disabled={listChecked.left.length === 0 ? true:false} type={listChecked.left.length === 0 ? "default":"primary"} 
                            style={{background:listChecked.left.length !== 0 && "rgb(19, 19, 134)"}}
                            className="left-to-right"
                            onClick={()=>onConvert(listChecked.left,"left")}>
                            <RightOutlined />
                        </Button>
                        <Button 
                            disabled={listChecked.right.length === 0 ? true:false} type={listChecked.right.length === 0 ? "default":"primary"} 
                            style={{background:listChecked.right.length !== 0 && "rgb(19, 19, 134)"}} 
                            className="right-to-left"
                            onClick={()=>onConvert(listChecked.right,"right")}>
                            <LeftOutlined />
                        </Button>
                    </div>
                    <div className="right-column">
                        <div className="top">
                            <Select value={select.right} className="select" onChange={(value)=>handleChange(value,"right")}>
                                {
                                    channels.filter((i)=>{return i.ChannelName!== selectChannel.left }).map((i,index)=>{
                                        return (
                                            <Option value={i.ChannelName} key={index}>{i.ChannelName}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </div>
                        <div className="body">
                            <div className="search-body">
                                <Input value={input.right} className="search-input" onChange={(e)=>onSearch(e,"right")} suffix={<SearchOutlined style={{color:"#bfbfbf"}}/>} placeholder="Search here"></Input>
                            </div>
                            <div id="list2" className="list-item">
                                <Checkbox className="check-all" checked={checkAll.right} indeterminate={indeterminate.right} onChange={(value)=>onCheckAll(value,"right")}/>
                                <CheckboxGroup options={plainOptions.right}  value={listChecked.right} onChange={(value)=>onCheck(value,"right")}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                centered
                visible={visibleWarning}
                onCancel={()=>{onCancel(false)}}
                title={warning.title}
                className='warning-modal'
                cancelButtonProps ={{ style:{ display: 'none' }} }
                footer={[
                    <button onClick={()=>onSubmit(active===false?"clone":"move")} className="warning-btn yes" key="1">Yes</button>,
                    <button onClick={()=>onCantSubmit(active===false?"clone":"move")} className="warning-btn no" key="2">No</button>,
                    <button onClick={onCancel} className="warning-btn cancel" key="3">Cancel</button>
                ]}
            >
                <div className="warning-content">{warning.content}</div>
            </Modal>
            <Modal
                centered
                visible={visibleConfirm}
                onCancel={()=>{setVisibleConfirm(false)}}
                title={"Confirm"}
                className='warning-modal confirm'
                cancelButtonProps ={{ style:{ display: 'none' }} }
                footer={[
                    <button onClick={()=>onFinalSubmit()} className="warning-btn yes" key="1">Yes</button>,
                    <button onClick={()=>setVisibleConfirm(false)} className="warning-btn cancel" key="2">Cancel</button>
                ]}
            >
                <div className="warning-content">Do you want {active === false ? "MOVE" : "CLONE"} data ?</div>
            </Modal>
        </Modal>
    )
}


export default Modify;

