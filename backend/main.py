import os
import openai
import numpy as np
import logging
import pandas as pd
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from detect import TFLiteModel, Point, TranscribeReq
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
    THRESHOLD = 3
    outputs = []
    WINDOW_SIZE = 10
    STRIDE = 2
    print(len(data))
    # data = data[:: -1]

    # if len(data) < WINDOW_SIZE:
    model_predict, confidence = model.predict(np.array(data))
    print(f"all frames: {model_predict}, {confidence}")
    # write data to csv with file name of prediction
    # if not os.path.exists("predictions"): os.makedirs("predictions")
    # with open(f"predictions/{model_predict}.csv", "w") as f:
    #     for p in data.rightHand:
    #         for d in data:
    #             f.write(f"{p.x},{p.y}\n")
        
    # return {"transcript": f"{model_predict}"}
    
    for i in range(0, len(data) - WINDOW_SIZE + 1, STRIDE):
        model_predict, confidence = model.predict(np.array(data[i:i+WINDOW_SIZE]))
        print(f"window of {i} to {i+WINDOW_SIZE}: {model_predict}, {confidence}")
        if (len(outputs) == 0 or (len(outputs) > 0 and outputs[len(outputs) - 1] != model_predict)) \
                and confidence > THRESHOLD:
            outputs.append(model_predict)
        
        WINDOW_SIZE = 5
        model_predict, confidence = model.predict(np.array(data[i:i+WINDOW_SIZE]))
        print(f"window of {i} to {i+WINDOW_SIZE}: {model_predict}, {confidence}")
        if (len(outputs) == 0 or (len(outputs) > 0 and outputs[len(outputs) - 1] != model_predict)) \
                and confidence > THRESHOLD:
            outputs.append(model_predict)
        WINDOW_SIZE = 10

    # ask openai to interpret the outputs into what the sign language means in an english sentence
    print(f"outputs: {outputs}")

    if len(outputs) == 0:
        return {"transcript": "unsure"}
    if len(outputs) == 1:
        return {"transcript": f"{outputs[0]}"}

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "Your role is to transcribe a list of sign language gestures into an english sentence"
            },
            {
                "role": "user",
                "content": "Hi there, I am trying to transcribe the following sign language gestures into an english sentence: " + " ".join(outputs) + "\n\n please output only the english phrase"
            },
        ],
    )
    response_text = response.choices[0].message.content
    print(response_text)
    return {"transcript": f"{response_text}"}
