import os
import base64
import requests
import json
from tqdm import tqdm

IMAGE_ROOT_DIR = "../training_data/img" 
OLLAMA_API_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llava:13b"

STYLE_MAPPING = {
    "10_modern_indian": "modern_indian style",
    "10_scandinavian": "scandinavian style",
    "10_industrial": "industrial style",
    "10_bohemian": "bohemian style",
    "10_luxury": "luxury_contemporary style"
}

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def generate_caption(base64_image, trigger_word):
    prompt = (
        f"You are an expert interior designer. Describe this image in a single, detailed paragraph. "
        f"Start your description with EXACTLY these words: '{trigger_word}, '. "
        f"Describe the furniture style, material textures (wood, glass, fabric), "
        f"color palette, lighting conditions, and key decor elements. "
        f"Do not mention people or the camera angle."
    )

    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "images": [base64_image],
        "stream": False,
        "options": {
            "temperature": 0.2  # Low temperature = less hallucination, more factual
        }
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload)
        response.raise_for_status()
        return response.json()['response'].strip()
    except Exception as e:
        print(f"❌ API Error: {e}")
        return None

def main():
    print(f"🚀 Starting Auto-Annotation with {MODEL_NAME}...")
    
    for root, dirs, files in os.walk(IMAGE_ROOT_DIR):
        folder_name = os.path.basename(root)
        
        if folder_name in STYLE_MAPPING:
            trigger_word = STYLE_MAPPING[folder_name]
            print(f"\n📂 Processing Group: {folder_name}")
            
            image_files = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            
            for img_file in tqdm(image_files, desc="Captioning"):
                img_path = os.path.join(root, img_file)
                txt_path = os.path.splitext(img_path)[0] + ".txt"
                
                if os.path.exists(txt_path):
                    continue
                
                b64_img = encode_image(img_path)
                caption = generate_caption(b64_img, trigger_word)
                
                if caption:
                    with open(txt_path, "w", encoding="utf-8") as f:
                        f.write(caption)

    print("\n✅ All styles annotated.")

if __name__ == "__main__":
    main()