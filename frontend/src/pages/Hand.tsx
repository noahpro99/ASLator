import { useEffect, useRef, useState } from 'react';
import { Results, Hands, HAND_CONNECTIONS, VERSION } from '@mediapipe/hands';
import {
  drawConnectors,
  drawLandmarks,
  Data,
  lerp,
} from '@mediapipe/drawing_utils';

const Hand = () => {
  const [inputVideoReady, setInputVideoReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [currentlySigning, setCurrentlySigning] = useState(false);

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

      const hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${VERSION}/${file}`,
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onResults);

      const sendToMediaPipe = async () => {
        if (inputVideoRef.current) {
          if (!inputVideoRef.current.videoWidth) {
            console.log(inputVideoRef.current.videoWidth);
            requestAnimationFrame(sendToMediaPipe);
          } else {
            await hands.send({ image: inputVideoRef.current });
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
      if (results.multiHandLandmarks && results.multiHandedness) {
        if (results.multiHandLandmarks.length === 0) {
          setCurrentlySigning(false);
        }
        let totalDiff = 0;
        for (
          let index = 0;
          index < results.multiHandLandmarks.length;
          index++
        ) {
          const classification = results.multiHandedness[index];
          const isRightHand = classification.label === 'Right';
          const landmarks = results.multiHandLandmarks[index];
          drawConnectors(contextRef.current, landmarks, HAND_CONNECTIONS, {
            color: isRightHand ? '#00FF00' : '#FF0000',
          });
          drawLandmarks(contextRef.current, landmarks, {
            color: isRightHand ? '#00FF00' : '#FF0000',
            fillColor: isRightHand ? '#FF0000' : '#00FF00',
            radius: (data: Data) => {
              return lerp(data.from!.z!, -0.15, 0.1, 10, 1);
            },
          });

          // compare with previous results to detect if change
          const normlandmarks = results.multiHandWorldLandmarks[index];
          if (isRightHand) {
            if (prevRightLandmarks.current) {
              let diff = 0;
              for (let i = 0; i < prevRightLandmarks.current.length; i++) {
                const prevLandmark = prevRightLandmarks.current[i];
                const landmark = normlandmarks[i];
                diff += Math.abs(prevLandmark.x - landmark.x);
                diff += Math.abs(prevLandmark.y - landmark.y);
                diff += Math.abs(prevLandmark.z - landmark.z);
              }
              totalDiff += diff;
            }
            prevRightLandmarks.current = normlandmarks;
          } else {
            if (prevLeftLandmarks.current) {
              let diff = 0;
              for (let i = 0; i < prevLeftLandmarks.current.length; i++) {
                const prevLandmark = prevLeftLandmarks.current[i];
                const landmark = normlandmarks[i];
                diff += Math.abs(prevLandmark.x - landmark.x);
                diff += Math.abs(prevLandmark.y - landmark.y);
                diff += Math.abs(prevLandmark.z - landmark.z);
              }
              totalDiff += diff;
            }
            prevLeftLandmarks.current = normlandmarks;

          }
        }
        prevFrame.current = currentFrame.current;
        let avgDiff = totalDiff / results.multiHandLandmarks.length;
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
  };

  return (
    <div>
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
      {currentlySigning ? (
        <div className='absolute top-0 left-0 right-0 bottom-0 bg-green-800 bg-opacity-50 flex justify-center items-center'>
          <div className='text-white text-4xl'>Signing</div>
        </div>
      ) : (
        <div className='absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='text-white text-4xl'>Not Signing</div>
        </div>
      )}
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
};

export default Hand;