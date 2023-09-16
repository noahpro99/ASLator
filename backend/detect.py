import tensorflow as tf
import numpy as np
from pydantic import BaseModel
from typing import Optional
import json
import pandas as pd
# print(tf.__version__)

class Point(BaseModel):
    x: float
    y: float
    z: float
    visibility: Optional[float] = None

class TranscribeReq(BaseModel):
    pose: Optional[list[Point]] = None
    face: Optional[list[Point]] = None
    leftHand: Optional[list[Point]] = None
    rightHand: Optional[list[Point]] = None

class TFLiteModel:
    def __init__(self, model_path=None):
        """
        Initialize the TensorFlow Lite model.

        Args:
            model_path (str): The path to the TFLite model file.
        """
        
        self.interpreter = tf.lite.Interpreter(model_path="./model.tflite")
        self.interpreter.allocate_tensors()
        self.predict_fn = self.interpreter.get_signature_runner()
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()
        
        with open(r"./sign_to_prediction_index_map.json", "r") as f:
            j = json.load(f)
            self.sign_to_prediction_index_map = {int(v): k for k, v in j.items()}

    def process_frame(self, frame: TranscribeReq) -> pd.DataFrame:
        df = pd.DataFrame(columns=['x', 'y', 'z'])
        
        if frame.face:
            # first clip the face to 468 points
            if len(frame.face) > 468:
                frame.face = frame.face[:468]
            df = pd.concat([df, pd.DataFrame([[p.x, p.y, p.z] for p in frame.face], columns=['x', 'y', 'z'])])
        else:
            df = pd.concat([df, pd.DataFrame([[np.nan, np.nan, np.nan] for _ in range(468)], columns=['x', 'y', 'z'])])
            
        if frame.leftHand:
            df = pd.concat([df, pd.DataFrame([[p.x, p.y, p.z] for p in frame.leftHand], columns=['x', 'y', 'z'])])
        else:
            df = pd.concat([df, pd.DataFrame([[np.nan, np.nan, np.nan] for _ in range(21)], columns=['x', 'y', 'z'])])
        
        if frame.pose:
            df = pd.concat([df, pd.DataFrame([[p.x, p.y, p.z] for p in frame.pose], columns=['x', 'y', 'z'])])
        else:
            df = pd.concat([df, pd.DataFrame([[np.nan, np.nan, np.nan] for _ in range(33)], columns=['x', 'y', 'z'])])
            
        if frame.rightHand:
            df = pd.concat([df, pd.DataFrame([[p.x, p.y, p.z] for p in frame.rightHand], columns=['x', 'y', 'z'])])
        else:
            df = pd.concat([df, pd.DataFrame([[np.nan, np.nan, np.nan] for _ in range(21)], columns=['x', 'y', 'z'])])
        
        return df
    
    def predict(self, input_data: list[TranscribeReq]) -> tuple[int, float]:
        data_columns = ['x', 'y', 'z']
        df = pd.DataFrame(columns=data_columns)
        for frame in input_data:
            df = pd.concat([df, self.process_frame(frame)])
        
        ROWS_PER_FRAME = 543
        n_frames = int(len(df) / ROWS_PER_FRAME)
        data = df.values.reshape(n_frames, ROWS_PER_FRAME, len(data_columns))
        data = data.astype(np.float32)
        
        output = self.predict_fn(inputs=data)
        p = output['outputs'].reshape(-1)
        predict = np.argsort(-p, -1)[0]
        
        word = self.sign_to_prediction_index_map[predict]
        confidence = p[predict]
        return word, confidence