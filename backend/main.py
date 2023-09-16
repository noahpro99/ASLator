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
    THRESHOLD = 0.4
    outputs = []
    for i in range(int(len(data)/250)):
        new_data = data[i*250:(i+1)*250]
        arr = np.array(new_data)
        model_predict, confidence  = model.predict(arr)
        last_word_in_output = None  if len(outputs) == 0 else outputs[len(outputs) - 1]
        if (last_word_in_output != model_predict ) and confidence > THRESHOLD:
            outputs.append((last_word_in_output))

        
    prediction = None   #TODO
    return {"transcript": f"some asl prediction that came from the backend: {prediction}" }