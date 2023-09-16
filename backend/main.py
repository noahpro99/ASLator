import logging
import pandas as pd
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

origins = ["*"]

# setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# setup fast api
app = FastAPI(
    title="FastAPI AI Inference Server",
    description="FastAPI AI Inference Server",
    version="0.1.0",
    docs_url="/",
    redoc_url=None,
)

# make fastapi load the model only once
# https://fastapi.tiangolo.com/advanced/on-startup-events/
@app.on_event("startup")
def load_model():
    global model
    model = None
    logger.info("Loading model")
    # model = pd.read_pickle("model.pkl")
    logger.info("Model loaded")
    
# endpoint for inference
@app.post("/predict")
async def predict(data):
    prediction = model
    return {"prediction": data}