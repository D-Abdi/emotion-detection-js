let emotion 

const video = document.getElementById('video')
const stopVideoBtn = document.getElementById('stopVideo')

stopVideoBtn.addEventListener("click", stopVideo)

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')
  ]).then(startVideo)
  

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream, 
        err => console.error(err)
    )
}



video.addEventListener('play', () => {

    const canvas = faceapi.createCanvasFromMedia(video)

    document.body.append(canvas)

    const displaySize = { width: video.width, height: video.height}

    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {
       const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
       .withFaceLandmarks()
       .withFaceExpressions()

       canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

       const resizedDetections = faceapi.resizeResults(detections, displaySize)

       faceapi.draw.drawDetections(canvas, resizedDetections)
       faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
       faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

       let neutral = resizedDetections[0].expressions.neutral
       let happy = resizedDetections[0].expressions.happy
       let sad = resizedDetections[0].expressions.sad
       let angry = resizedDetections[0].expressions.angry
       let disgusted = resizedDetections[0].expressions.disgusted
       let surprised = resizedDetections[0].expressions.surprised
       let fearful = resizedDetections[0].expressions.fearful

       switch(Math.max(neutral, sad, angry, disgusted, surprised, happy)) {
           case neutral:
               emotion = "Happy"
               break;
            case sad:
                emotion = "sad"
                break;
            case angry:
                emotion = "angry"
                break;
            case disgusted:
                emotion = "disgusted"
                break;
            case surprised:
                emotion = "surprised"
                break;
            case happy:
                emotion = "happy"
                break;
            case fearful:
                emotion = "fearful"
                break;
            default:
                console.log("No Expression Recognized");
                emotion = "None"
       }
       
    }, 100);
    
    
})

function stopVideo() {
    video.pause()
    console.log(emotion);
 }
