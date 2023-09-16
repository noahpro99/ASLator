import logging
import pandas as pd
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from detect import TFLiteModel, Point, TranscribeReq
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
import numpy as np

app = FastAPI(
    title="FastAPI AI Inference Server",
    description="FastAPI AI Inference Server",
    version="0.1.0",
    docs_url="/",
    redoc_url=None,
)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# make fastapi load the model only once
# https://fastapi.tiangolo.com/advanced/on-startup-events/
@app.on_event("startup")
def load_model():
    global model
    logger.info("Loading model")
    model = TFLiteModel()
    # model = pd.read_pickle("model.pkl")
    logger.info("Model loaded")

# endpoint for inference
@app.post("/transcribe")
async def predict(data: list[TranscribeReq]):
    THRESHOLD = 4
    outputs = []
    WINDOW_SIZE = 10
    STRIDE = 5
    print(len(data))
    
    if len(data) < WINDOW_SIZE:
        arr = np.array(data)
        model_predict, confidence  = model.predict(arr)
        return {"transcript": f"{model_predict}" }
    
    for i in range(0, len(data) - WINDOW_SIZE + 1, STRIDE):
        new_data = data[i:i+WINDOW_SIZE]
        arr = np.array(new_data)
        model_predict, confidence  = model.predict(arr)
        print(model_predict, confidence)
        
        if (len(outputs) == 0 or (len(outputs) > 0 and outputs[len(outputs) - 1] != model_predict)) \
            and confidence > THRESHOLD:
            outputs.append(model_predict)
    return {"transcript": f"{outputs}" }