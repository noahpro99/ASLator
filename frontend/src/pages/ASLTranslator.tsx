import { useEffect, useRef, useState } from 'react';
import { Results, Holistic, HAND_CONNECTIONS, FACEMESH_TESSELATION, POSE_CONNECTIONS, VERSION } from '@mediapipe/holistic';
import {
  drawConnectors,
  drawLandmarks,
  Data,
  lerp,
} from '@mediapipe/drawing_utils';

const ASLTranslator = () => {
  const [inputVideoReady, setInputVideoReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [currentlySigning, setCurrentlySigning] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('transcript here lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua');

  const inputVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const prevLeftLandmarks = useRef<any | null>(null);
  const prevRightLandmarks = useRef<any | null>(null);
  const lastChange = useRef(0);
  const prevFrame = useRef<any | null>(null);
  const currentFrame = useRef<any | null>(null);

  useEffect(() => {
    if (!inputVideoReady) {
      return;
    }
    if (inputVideoRef.current && canvasRef.current) {
      console.log('rendering');
      contextRef.current = canvasRef.current.getContext('2d');
      const constraints = {
        video: { width: { min: 1280 }, height: { min: 720 } },
      };
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        if (inputVideoRef.current) {
          inputVideoRef.current.srcObject = stream;
        }
        sendToMediaPipe();
      });

      const config = new Holistic({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@${VERSION}/${file}`,
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
  }, [inputVideoReady]);

  const onResults = (results: Results) => {
    if (canvasRef.current && contextRef.current) {
      setLoaded(true);

      contextRef.current.save();
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      contextRef.current.drawImage(
        results.image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      contextRef.current.globalCompositeOperation = 'destination-atop';
      contextRef.current.drawImage(
        results.image, 0, 0, canvasRef.current.width, canvasRef.current.height
      );

      contextRef.current.globalCompositeOperation = 'source-over';
      // drawConnectors(contextRef.current, results.poseLandmarks, POSE_CONNECTIONS,
      //   { color: '#C0C0C070', lineWidth: 4 });
      // drawLandmarks(contextRef.current, results.poseLandmarks,
      //   { color: '#FF0000', lineWidth: 2 });
      // drawConnectors(contextRef.current, results.faceLandmarks, FACEMESH_TESSELATION,
      //   { color: '#C0C0C070', lineWidth: 1 });
      drawConnectors(contextRef.current, results.leftHandLandmarks, HAND_CONNECTIONS,
        { color: '#CC0000', lineWidth: 5 });
      drawLandmarks(contextRef.current, results.leftHandLandmarks,
        { color: '#FF0000', lineWidth: 2 });
      drawConnectors(contextRef.current, results.rightHandLandmarks, HAND_CONNECTIONS,
        { color: '#00CC00', lineWidth: 5 });
      drawLandmarks(contextRef.current, results.rightHandLandmarks,
        { color: '#FF0000', lineWidth: 2 });
      contextRef.current.restore();
      let totalDiff = 0;
      let totalHands = 0;

      if (results.rightHandLandmarks) {
        totalHands++;
        if (prevRightLandmarks.current) {
          let diff = 0;
          for (let i = 0; i < prevRightLandmarks.current.length; i++) {
            const prevLandmark = prevRightLandmarks.current[i];
            const landmark = results.rightHandLandmarks[i];
            diff += Math.abs(prevLandmark.x - landmark.x);
            diff += Math.abs(prevLandmark.y - landmark.y);
            diff += Math.abs(prevLandmark.z - landmark.z);
          }
          totalDiff += diff;
        }
        prevRightLandmarks.current = results.rightHandLandmarks;
      }
      if (results.leftHandLandmarks) {
        totalHands++;
        if (prevLeftLandmarks.current) {
          let diff = 0;
          for (let i = 0; i < prevLeftLandmarks.current.length; i++) {
            const prevLandmark = prevLeftLandmarks.current[i];
            const landmark = results.leftHandLandmarks[i];
            diff += Math.abs(prevLandmark.x - landmark.x);
            diff += Math.abs(prevLandmark.y - landmark.y);
            diff += Math.abs(prevLandmark.z - landmark.z);
          }
          totalDiff += diff;
        }
        prevLeftLandmarks.current = results.leftHandLandmarks;
      }

      prevFrame.current = currentFrame.current;
      let avgDiff = totalDiff / totalHands;
      console.log(avgDiff);
      if (avgDiff > 0.7) {
        setCurrentlySigning(true);
      }
      if (avgDiff > 0.11) {
        lastChange.current = currentFrame.current;
      }
      if (currentFrame.current - lastChange.current > 20) {
        setCurrentlySigning(false);
      }
      currentFrame.current++;
    }
  };

  return (
    <>
      <video
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
      <div className='flex flex-row items-start justify-evenly flex-wrap flex-grow p-8'>
        <div className='w-full md:w-1/2 h-full flex flex-col'>
          <canvas
            className='rounded-xl shadow-2xl max-w-full'
            ref={canvasRef} width={640} height={360}
          />
          {!loaded &&
            <div className='text-2xl font-bold text-center p-4 text-gray-500'>
              Loading...</div>
          }
          {currentlySigning &&
            <div className='text-2xl font-bold text-center p-4 text-green-500'>
              Currently Signing</div>
          }
        </div>
        <div className='w-full md:w-1/2 h-full flex flex-col border-4 border-green-500 rounded-xl shadow-2xl'>
          <div className='flex flex-col flex-grow p-4'>
            {currentTranscript &&
              <div className='text-2xl font-bold overflow-y-auto'>
                {currentTranscript}
              </div>
            }
          </div>
        </div>
      </div >
    </>
  );
};

export default ASLTranslator;