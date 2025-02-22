from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np
from starlette.responses import JSONResponse

app = FastAPI()

@app.post("/analyze-stress/")
async def analyze_stress(file: UploadFile = File(...)):
    contents = await file.read()
    image_np = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    if image is None:
        return JSONResponse(content={"error": "Invalid image"}, status_code=400)

    #need to add stress level logic for this
    #temporary stress level 
    stress_level = 50.0  

    return {"stress_level": stress_level}

@app.get("/")
async def root():
    return {"message": "Stress Level Detector is working!"}
