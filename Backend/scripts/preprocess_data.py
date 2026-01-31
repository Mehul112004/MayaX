import os
from PIL import Image
from tqdm import tqdm

# CONFIGURATION
INPUT_DIR = "../training_data/raw_downloads"  # Put your downloaded images here first
OUTPUT_DIR = "../training_data/img/10_modern_indian"
TARGET_SIZE = (512, 512)

def process_images():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    files = [f for f in os.listdir(INPUT_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
    
    print(f"🔄 Processing {len(files)} images...")

    for i, filename in enumerate(tqdm(files)):
        try:
            img_path = os.path.join(INPUT_DIR, filename)
            img = Image.open(img_path).convert("RGB")
            
            # Smart Resize & Center Crop
            # This aspect ratio logic ensures we don't stretch the furniture
            width, height = img.size
            aspect_ratio = width / height
            
            if aspect_ratio > 1:
                # Landscape: Resize height to 512, crop width
                new_height = TARGET_SIZE[1]
                new_width = int(new_height * aspect_ratio)
            else:
                # Portrait: Resize width to 512, crop height
                new_width = TARGET_SIZE[0]
                new_height = int(new_width / aspect_ratio)
                
            img = img.resize((new_width, new_height), Image.LANCZOS)
            
            # Center Crop
            left = (new_width - TARGET_SIZE[0]) / 2
            top = (new_height - TARGET_SIZE[1]) / 2
            right = (new_width + TARGET_SIZE[0]) / 2
            bottom = (new_height + TARGET_SIZE[1]) / 2
            
            img = img.crop((left, top, right, bottom))
            
            # Save
            save_name = f"modern_indian_{i+1:03d}.jpg"
            img.save(os.path.join(OUTPUT_DIR, save_name), quality=95)
            
        except Exception as e:
            print(f"❌ Error processing {filename}: {e}")

    print("✅ Done! Images ready for captioning.")

if __name__ == "__main__":
    process_images()