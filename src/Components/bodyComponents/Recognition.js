import * as faceapi from 'face-api.js';


const labeledDescriptors = (descriptions) => {
    return descriptions.map((description)=>{
        let face = new faceapi.LabeledFaceDescriptors(description.label, description.faceDetects);
        console.log(face);
        return face;
    });
}

export const handlePlay = (vd,faceDescriptions) =>{
    const video = document.getElementById('video');
    const wrapVideo = document.getElementById('wrap-video');
    const CurrentCanvas = document.getElementsByTagName('canvas');
    const canvas = faceapi.createCanvasFromMedia(video);
    if(CurrentCanvas.length !== 0){
        wrapVideo.replaceChild(canvas,CurrentCanvas[0]);
    } else{
        wrapVideo.appendChild(canvas);
    }
    
    

    let faceMatcher = [];
    if(faceDescriptions.length !== 0){
        faceMatcher = new faceapi.FaceMatcher(labeledDescriptors(faceDescriptions),0.5);
    }

    const displaySize = {width: vd.current.offsetWidth,height: vd.current.offsetHeight };
    faceapi.matchDimensions(canvas,displaySize);
    setInterval(async()=>{
        
        const detections = await faceapi.detectAllFaces(video,
            new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks().withFaceDescriptors();
        const resizeDetections = faceapi.resizeResults(detections,displaySize);
        console.log(resizeDetections);
        // const boxResize = (resizeDetections)=>{
        //     if(resizeDetections[0] === undefined){
        //         return [];
        //     } else {
        //         console.log(resizeDetections[0].alignedRect._box);
        //         return resizeDetections[0].alignedRect._box;
        //     }
        // }

        // const Resize = boxResize(resizeDetections);
        canvas.getContext('2d').clearRect(0,0, canvas.width,canvas.height);
        if(faceMatcher.length === 0){
            resizeDetections.forEach((r,i)=>{
                const box = resizeDetections[i].detection.box;
                const drawBox = new faceapi.draw.DrawBox(box,{label: "unknown"});
                drawBox.draw(canvas);
            })
        } else if(faceMatcher.length !== 0){
            const results = resizeDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
            canvas.getContext('2d').clearRect(0,0, canvas.width,canvas.height);
            results.forEach((r,i)=>{
                const box = resizeDetections[i].detection.box;
                const drawBox = new faceapi.draw.DrawBox(box,{label: r.label});
                drawBox.draw(canvas);
            })
        }
    },150);

}