import * as faceapi from 'face-api.js';
import store from '../../../store/store';

const labeledDescriptors = (descriptions) => {
    return descriptions.map((description)=>{
        let face = new faceapi.LabeledFaceDescriptors(description.label, description.faceDetects);
        return face;
    });
}

export const getTime = () =>{
    const time = new Date();
    const mili = time.getTime();
    let datetime = time.getDate() + "/"
                + (time.getMonth()+1)  + "/" 
                + time.getFullYear() + " - "  
                + time.getHours() + ":"  
                + time.getMinutes() + ":" 
                + time.getSeconds();
    return {datetime , mili};
}

export const handlePlay = async (faceDescriptions,addList,changeList,deleteItem) =>{
    const img = document.getElementById('imgSocket');
    const wrapVideo = document.getElementById('wrap-video');
    const CurrentCanvas = document.getElementsByTagName('canvas');
    const canvas = faceapi.createCanvas({width:img.offsetWidth-30,height:img.offsetHeight-30});
    if(CurrentCanvas.length > 1){
        wrapVideo.replaceChild(canvas,CurrentCanvas[1]);
    } else{
        wrapVideo.appendChild(canvas);
    }
    let faceMatcher = [];
    if(faceDescriptions.length !== 0){
        faceMatcher = new faceapi.FaceMatcher(labeledDescriptors(faceDescriptions),0.42);
    }
    const displaySize = {width:520,height:480};
    faceapi.matchDimensions(canvas,displaySize);
    setInterval(async()=>{
        if(img.getAttribute("alt")==="Loading..."){}
        else {
            const list =  store.getState().listRecognition
            const detections = await faceapi.detectAllFaces(img,
                new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks().withFaceDescriptors();
            const resizeDetections = faceapi.resizeResults(detections,displaySize);
            canvas.getContext('2d').clearRect(0,0, canvas.width,canvas.height);
            if(faceMatcher.length === 0){
                resizeDetections.forEach((r,i)=>{
                    const box = resizeDetections[i].detection.box;
                    const drawBox = new faceapi.draw.DrawBox(box,{label: "unknown"});
                    drawBox.draw(canvas);
                })
            } else if(faceMatcher.length !== 0){
                const results = resizeDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
                // list = 0 thì mặc định add 
                if(list.length === 0 && results.length > 0){
                    for(let i of results){
                        if(i.label !== "unknown"){
                            addList({label: i.label,distance: i.distance,time:getTime().datetime,mili: getTime().mili});
                        }
                    }
                }
                // những id trùng mà time chup cách nhau nhỏ hơn 1 p
                if(list.length !==0){
                    for(let i = 0; i < list.length ; i++){
                        for(let j = i+1; j < list.length ; j++){
                            if(list[i].label === list[j].label && (list[j].mili - list[i].mili) < 60000 ){
                                console.log(list[j].mili,list[i].mili,list[j].mili - list[i].mili);
                                deleteItem(list[j].mili);
                            }
                        }
                    }
                } 
                // nếu là id mới ko có trong mảng thì add  
                if(list.length !==0 & results.length > 0){
                    for(let i of results){
                        let exist = false;
                        for(let j of list){
                            if (i.label === j.label){
                                exist = true;
                                break;
                            }
                        }
                        if (exist === false  && i.label !== "unknown"){
                            addList({label: i.label,distance: i.distance,time:getTime().datetime,mili: getTime().mili});
                        }
                    }
                }
                // nếu đã tồn tại mà giãn cách 1 p thì add
                const ReverseArray = [...list];
                ReverseArray.reverse();
                if(list.length !==0 & results.length > 0){
                    for(let i of results){
                        for(let j of ReverseArray){
                            if(i.label === j.label){
                                if((getTime().mili - j.mili) >60000 && i.label !== "unknown"){
                                    addList({label: i.label,distance: i.distance,time:getTime().datetime,mili: getTime().mili});
                                }
                                break;
                            }
                        }
                    }
                }
                //vẽ canvas lên camera 
                canvas.getContext('2d').clearRect(0,0, canvas.width,canvas.height);
                results.forEach((r,i)=>{
                    const box = resizeDetections[i].detection.box;
                    const drawBox = new faceapi.draw.DrawBox(box,{label: r.label});
                    drawBox.draw(canvas);
                })
            }
        }
    },1000);
}