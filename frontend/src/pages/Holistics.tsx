import { useEffect, useRef, useState } from 'react';
import { Results, Holistic ,HAND_CONNECTIONS, FACEMESH_TESSELATION, POSE_CONNECTIONS, VERSION } from '@mediapipe/holistic';
import {
    drawConnectors,
    drawLandmarks,
    Data,
    lerp,
  } from '@mediapipe/drawing_utils';


const Holistics = () => {
    const [inputVideoReady, setInputVideoReady] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [currentlySigning, setCurrentlySigning] = useState(true);

    const inputVideoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const prevLeftLandmarks = useRef<any | null>(null);
    const prevRightLandmarks = useRef<any | null>(null);
    
    const lastChange = useRef(0);
    const prevFrame = useRef<any | null>(null);
    const currentFrame = useRef<any | null>(null);

    useEffect(() => {
        if (!inputVideoReady){
            return;
        }

        if (inputVideoRef.current && canvasRef.current) {
            console.log('rendering');
            contextRef.current = canvasRef.current.getContext('2d');
            const constraints = {
                video : {width: {min : 1280}, height: {min: 720}}
            };
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                if (inputVideoRef.current){
                    inputVideoRef.current.srcObject = stream;
                }
                sendToMediaPipe();
            });
            
            const config = new Holistic({locateFile: (file) => 
                 `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@` +
                `${VERSION}/${file}`
                });
            config.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableSegmentation: true,
                smoothSegmentation: true,
                refineFaceLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
                });
            
            config.onResults(onResults);

            const sendToMediaPipe = async () => {
                if (inputVideoRef.current) {
                  if (!inputVideoRef.current.videoWidth) {
                    console.log(inputVideoRef.current.videoWidth);
                    requestAnimationFrame(sendToMediaPipe);
                  } else {
                    await config.send({ image: inputVideoRef.current });
                    requestAnimationFrame(sendToMediaPipe);
                  }
                }
              };      
        }
    },[inputVideoReady])
    
    const onResults = (results: Results) => {
        if (canvasRef.current && contextRef.current) {
            setLoaded(true);

            contextRef.current.save();
            contextRef.current.clearRect(
              0,
              0, 
              canvasRef.current.width, 
              canvasRef.current.height);
            
            contextRef.current.drawImage(
              results.image,
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );

            // only overwrite existing pixels
            // contextRef.current.globalCompositeOperation = 'source-in';
            // contextRef.current.fillStyle = '#00000000';
            // contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            // onlu overwrite missing pixels
            contextRef.current.globalCompositeOperation = 'destination-atop';
            contextRef.current.drawImage(
              results.image, 0 ,0 ,canvasRef.current.width, canvasRef.current.height
            );

            contextRef.current.globalCompositeOperation = 'source-over';
            drawConnectors(contextRef.current, results.poseLandmarks, POSE_CONNECTIONS,
                        {color: '#C0C0C070', lineWidth: 4});
            drawLandmarks(contextRef.current, results.poseLandmarks,
                        {color: '#FF0000', lineWidth: 2});
            drawConnectors(contextRef.current, results.faceLandmarks, FACEMESH_TESSELATION,
                          {color: '#C0C0C070', lineWidth: 1});
            drawConnectors(contextRef.current, results.leftHandLandmarks, HAND_CONNECTIONS,
                          {color: '#CC0000', lineWidth: 5});
            drawLandmarks(contextRef.current, results.leftHandLandmarks,
                        {color: '#FF0000', lineWidth: 2});
            drawConnectors(contextRef.current, results.rightHandLandmarks, HAND_CONNECTIONS,
                          {color: '#00CC00', lineWidth: 5});
            drawLandmarks(contextRef.current, results.rightHandLandmarks,
                        {color: '#FF0000', lineWidth: 2});
            contextRef.current.restore();
        }
        console.log("results function called.")
    }
    return (
        <div>
          <video
            className='input_video'
            autoPlay
            style={{
              display: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transform: 'scale(-1, 1)',
            }}
            ref={(el) => {
              inputVideoRef.current = el;
              setInputVideoReady(!!el);
            }}
          />
          {/* {currentlySigning ? (
            <div className='absolute top-0 left-0 right-0 bottom-0 bg-green-800 bg-opacity-50 flex justify-center items-center'>
              <div className='text-white text-4xl'>Signing</div>
            </div>
          ) : (
            <div className='absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center'>
              <div className='text-white text-4xl'>Not Signing</div>
            </div>
          )} */}
          {!loaded && (
            <div className='absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center'>
              <div className='text-white text-4xl'>Loading</div>
            </div>
          )}
          <canvas
            className='mx-auto mt-10'
            ref={canvasRef} width={1280} height={720} />
        </div>
      );
}
export default Holistics;

