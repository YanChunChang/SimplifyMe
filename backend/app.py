from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline # type: ignore
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import io
from typing import List

# App starten
app = FastAPI()

# CORS erlauben
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# KI-Modelle vorbereiten (beim Start laden)
explainer = pipeline("summarization", model="facebook/bart-large-cnn")
sentiment_analyzer = pipeline("text-classification", model="tabularisai/multilingual-sentiment-analysis")
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# Eingabemodell
class TextInput(BaseModel):
    text: str

# Endpunkt 1: Text zusammenfassen
@app.post("/api/explain")
def explain_text(input: TextInput):
    # prompt = "paraphrase: " + input.text
    input_length = len(input.text.split())
    token_limit = 200 if input_length > 100 else 60
    result = explainer(input.text, max_new_tokens=token_limit)[0]['summary_text']
    return {"simplified": result}

# Endpunkt 2: Stimmung erkennen
@app.post("/api/sentiment")
def detect_sentiment(input: TextInput):
    result = sentiment_analyzer(input.text)[0]
    return {
        "label": result["label"],
        "score": round(result["score"], 2)
    }

@app.post("/api/caption")
async def generate_caption(files: List[UploadFile] = File(...)):
    results = []
    for file in files:
        # Bildinhalt lesen
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Vorverarbeitung
        inputs = processor(images=image, return_tensors="pt") # type: ignore

        # Modellvorhersage
        out = model.generate(**inputs) # type: ignore
        caption = processor.decode(out[0], skip_special_tokens=True) # type: ignore
        results.append({
            "filename": file.filename,
            "caption": caption
        })
    return results
