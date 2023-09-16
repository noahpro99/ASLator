# ASL Detection App

This is a simple app that detects ASL using the camera of your device. It uses the [MediaPipe](https://google.github.io/mediapipe/) framework to detect the hand landmarks and then uses a simple neural network to classify the hand gestures.

## Run with Docker
Local:
```
docker compose up --d --build --remove-orphans
```
Deploy:
```
docker compose -f docker-compose.prod.yml up --d --build --remove-orphans
```