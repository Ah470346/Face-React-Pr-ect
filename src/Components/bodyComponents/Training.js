import * as faceapi from 'face-api.js';


//----------------------------------handler train images 
export const handleTrainImages = (data,setProgress,setPercent) =>{
    const total = data.reduce((d,i)=>{
        return d + i.images.length
    },0);
    let percent = 1;
    const number = (num)=>{
        if(num === 100){
            return 99;
        } else{
            return num;
        }
    }
    return Promise.all([
        data.map(async label =>{
            const descriptions = [];
            for(let i of label.images){
                const img = await i;
                const a = document.createElement('img');
                a.src = img;
                const detections = await faceapi.detectAllFaces(a)
                    .withFaceLandmarks()
                    .withFaceDescriptors();
                if(detections.length === 0 ){
                    descriptions.push([]);
                } else  if(detections){
                    let max = 0;
                    let finalDetection;
                    for(let i of detections){
                        const area = i.alignedRect.box.width*i.alignedRect.box.height;
                        if(area > max){
                            finalDetection = i;
                            max = area
                        }
                    }
                    if(finalDetection.descriptor){
                        descriptions.push(finalDetection.descriptor);
                    }
                    setPercent({number:number(Math.round(percent/total*100))});
                    percent ++;
                } 
               
            }
            return {label: label.label , faceDetects: descriptions,ChannelName:label.channel};
        })
    ]);
} 

