import * as faceapi from 'face-api.js';
import store from '../../store/store'; 


//----------------------------------handler train images 
export const handleTrainImages = (data,setProgress,setPercent) =>{
    const faceDescriptions = store.getState().faceDetect;
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
            let bestMatch={distance:0,label:""};
            let faceMatcher;
              // find best match
            for(let i of label.images){
                let finalDetection;
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
                    for(let i of detections){
                        const area = i.alignedRect.box.width*i.alignedRect.box.height;
                        if(area > max && i.alignedRect.score > 0.8){
                            finalDetection = i;
                            max = area;
                        }
                    }
                    if(finalDetection){
                        descriptions.push(finalDetection.descriptor);
                    }
                    setPercent({number:number(Math.round(percent/total*100))});
                    percent ++;
                } 
                let array = []
                for(let i of faceDescriptions){
                    if(i.ChannelName === label.channel && i.label !== label.label){
                        const a =  new faceapi.LabeledFaceDescriptors(i.label,i.faceDetects);
                        array.push(a);
                    }
                }
                if(array.length !== 0){
                    faceMatcher = new faceapi.FaceMatcher(array,0.99);
                }
                if(finalDetection && faceMatcher){
                    const Match = faceMatcher.findBestMatch(finalDetection.descriptor);
                    if(Match.distance >= bestMatch.distance){
                        bestMatch = {distance: Match.distance,label:Match.label};
                    }
                }
            }
            faceDescriptions.push({label: label.label , faceDetects: descriptions,ChannelName:label.channel});
            return {label: label.label , faceDetects: descriptions,ChannelName:label.channel,bestMatch:{...bestMatch},file:label.file};
        })
    ]);
} 

