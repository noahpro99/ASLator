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
    # print(data)

    arr = np.array(data)

    print("Shape of data is ",arr.shape)
    print("Type of data is", type(data[0]))
    prediction = model.predict(data)
    
    # print("pose data length", len(data[0].pose))
    # print("pose data index 0" , data[0].pose[0])
    # print('\n\n')
    # print("face data length", len(data[0].face))
    # print("face data index 0" , data[0].face[0])
    # print('\n\n')
    if (data[0].leftHand):
        print("left hand data length", len(data[0].leftHand))
        print("left hand data index 0" , data[0].leftHand[0])
        print('\n\n')
    if (data[0].rightHand):
        print("right hand data length", len(data[0].rightHand))
        print("right hand data index 0" , data[0].rightHand[0])
        print('\n\n')

    # return da
    return {"transcript": f"some asl prediction that came from the backend: {prediction}" }