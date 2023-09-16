# fast api ai inference server
import os
import sys
import uvicorn
import logging
import pandas as pd

from fastapi import FastAPI, File, UploadFile

# setup cors
from fastapi.middleware.cors import CORSMiddleware
# allow all 
origins = [
    "*"
]

# setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# setup fast api
app = FastAPI()

# make fastapi load the model only once
# https://fastapi.tiangolo.com/advanced/on-startup-events/
@app.on_event("startup")
def load_model():
    global model
    model = None
    logger.info("Loading model")
    # model = pd.read_pickle("model.pkl")
    logger.info("Model loaded")
    
# endpoint for health check
@app.get("/")
def health_check():
    return {"status": "ok"}

# endpoint for inference
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # save file to disk
    # with open(file.filename, "wb") as buffer:
    #     buffer.write(file.file.read())
    # # read file
    # data = pd.read_csv(file.filename)
    # # make prediction
    prediction = model
    return {"prediction": prediction}


