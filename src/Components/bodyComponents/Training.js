import * as faceapi from 'face-api.js';


//----------------------------------handler train images 
export const handleTrainImages = (dataUpLoad) =>{
    return Promise.all([
        dataUpLoad.map(async label =>{
            const descriptions = [];
            for(let i of label.images){
                const img = await i;
                const a = document.createElement('img');
                a.src = img;
                const detections = await faceapi.detectSingleFace(a)
                    .withFaceLandmarks()
                    .withFaceDescriptor();
                if(detections.descriptor){
                    descriptions.push(detections.descriptor);
                }   
            }
            return {label: label.label , faceDetects: descriptions};
        })
    ]);
} 

