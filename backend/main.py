from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np
from keras.models import load_model
from starlette.responses import JSONResponse

app = FastAPI()

#load pretrained model
model = load_model('C:/Users/jason/projects/hopperhacks2025/backend/models/face_model.h5')

#emotion labels via the FER2013 data set
emotion_labels = ['Anger', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

#possible solutions
rec = {
    "high": [
        "Take a 5-minute deep breathing break",
    ],
    "medium": [
        "Drink a glass of water and take a break from the screen",
    ],
    "low": [
        "Keep up the good work, stay positive!",
    ]
}

def predict_stress(image_np):
    
    #FER2013 uses a gray scale, need to convert image to grey
    gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")    
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    
    if len(faces) == 0:
        return {"error": "No face detected"}

    # Process the first detected face
    (x, y, w, h) = faces[0]
    face = image_np[y:y + h, x:x + w]

    #preprocess to fit into the FER2013 dataset
    face_resized = cv2.resize(face, (48, 48))
    face_resized = cv2.cvtColor(face_resized, cv2.COLOR_BGR2GRAY)
    face_resized = face_resized.astype("float32") / 255
    face_resized = np.reshape(face_resized, (1, 48, 48, 1))

    #predictions
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

@app.post("/analyze-stress/")
async def analyze_stress(file: UploadFile = File(...)):
    """API endpoint to analyze stress from an uploaded image."""
    
    #uploaded image
    contents = await file.read()
    image_np = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    if image is None:
        return JSONResponse(content={"error": "Invalid image"}, status_code=400)

    #process the uploaded imag
    result = predict_stress(image)

    return result

@app.get("/")
async def root():
    return {"message": "Stress Level Detector API is running!"}
