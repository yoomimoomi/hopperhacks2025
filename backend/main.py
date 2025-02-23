from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np
from keras.models import load_model
from starlette.responses import JSONResponse

app = FastAPI()

# Load pretrained model
model = load_model("C:/Users/jason/projects/hopperhacks2025/backend/models/face_model.h5")

# Emotion labels via the FER2013 dataset
emotion_labels = ['Anger', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Possible solutions
rec = {
    "high": ["Take a 5-minute deep breathing break"],
    "medium": ["Drink a glass of water and take a break from the screen"],
    "low": ["Keep up the good work, stay positive!"]
}

latest_result = {}

def predict_stress(image_np):
    """Processes image, detects face, and predicts stress level."""

    gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    if len(faces) == 0:
        return {"error": "No face detected"}

    (x, y, w, h) = faces[0]
    face = gray[y:y + h, x:x + w]  # Use grayscale directly

    face_resized = cv2.resize(face, (48, 48))
    face_resized = face_resized.astype("float32") / 255
    face_resized = np.reshape(face_resized, (1, 48, 48, 1))

    emotion_probabilities = model.predict(face_resized)
    emotion_index = np.argmax(emotion_probabilities)
    predicted_emotion = emotion_labels[emotion_index]

    if predicted_emotion in ["Anger", "Fear", "Disgust"]:
        stress_level = 70.0
        recommendation = rec["high"]
    elif predicted_emotion == "Sad":
        stress_level = 50.0
        recommendation = rec["medium"]
    else:
        stress_level = 20.0
        recommendation = rec["low"]

    return {
        "emotion": predicted_emotion,
        "stress_level": stress_level,
        "recommendations": recommendation
    }

@app.on_event("startup")
async def startup_event():
    """Start the background task when the application starts."""
    background_tasks = BackgroundTasks()
    asyncio.create_task(capture_and_process(background_tasks))

@app.get("/")
async def root():
    return {"message": "Stress Level Detector API is running!"}