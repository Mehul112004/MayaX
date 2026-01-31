import os
import requests
from tqdm import tqdm

PEXELS_API_KEY = "GGEAmx64twsOnDd5KWYtJpepcaPotsHBmq3SVV3gEFZV3Z1O7KlqFUql" 

STYLES = {
    "modern_indian": "Modern Indian Interior Design Living Room",
    "scandinavian": "Scandinavian Living Room Interior",
    "industrial": "Industrial Loft Living Room",
    "bohemian": "Bohemian Living Room Decor",
    "luxury": "Luxury Contemporary Living Room"
}

TARGET_COUNT = 100
OUTPUT_DIR = "../training_data/raw_downloads"

def get_current_count(directory):
    if not os.path.exists(directory):
        return 0
    return len([f for f in os.listdir(directory) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])

def download_image(url, save_path):
    try:
        response = requests.get(url, stream=True, timeout=10)
        response.raise_for_status()
        with open(save_path, 'wb') as file:
            for chunk in response.iter_content(1024):
                file.write(chunk)
        return True
    except Exception as e:
        return False

def fill_gaps_with_pexels():
    if not PEXELS_API_KEY or "YOUR_PEXELS_KEY" in PEXELS_API_KEY:
        print("❌ Error: Please paste your Pexels Access Key in the script!")
        return

    headers = {"Authorization": PEXELS_API_KEY}

    for style_key, query in STYLES.items():
        save_folder = os.path.join(OUTPUT_DIR, style_key)
        os.makedirs(save_folder, exist_ok=True)
        
        # 1. CHECK: How many do we have?
        current_count = get_current_count(save_folder)
        needed = TARGET_COUNT - current_count
        
        print(f"\n🔎 Checking {style_key}...")
        print(f"   Current: {current_count} | Target: {TARGET_COUNT}")
        
        if needed <= 0:
            print(f"   ✅ Sufficient images found. Skipping.")
            continue
            
        print(f"   📉 Need {needed} more images. Fetching from Pexels...")

        # 2. DOWNLOAD: Fill the gap
        page = 1
        downloaded_this_session = 0
        pbar = tqdm(total=needed, desc=f"Filling {style_key}", unit="img")

        while downloaded_this_session < needed:
            # Pexels allows max 80 per page. We request 80 to minimize API calls.
            params = {
                "query": query,
                "per_page": 80, 
                "page": page,
                "orientation": "square" 
            }
            
            response = requests.get("https://api.pexels.com/v1/search", headers=headers, params=params)
            
            if response.status_code == 429:
                print("⚠️ Rate Limit Hit! Pexels allows 200 requests/hour.")
                break
            if response.status_code != 200:
                print(f"❌ API Error: {response.text}")
                break

            data = response.json()
            photos = data.get('photos', [])
            
            if not photos:
                print("⚠️ No more results on Pexels.")
                break

            for photo in photos:
                if downloaded_this_session >= needed:
                    break
                
                # Check if we already downloaded this specific image (to prevent duplicates)
                img_id = photo['id']
                filename = f"pexels_{style_key}_{img_id}.jpg"
                save_path = os.path.join(save_folder, filename)

                if not os.path.exists(save_path):
                    # Use 'large2x' or 'large' for best quality
                    img_url = photo['src']['large2x']
                    
                    if download_image(img_url, save_path):
                        downloaded_this_session += 1
                        pbar.update(1)
            
            page += 1

        pbar.close()
        final_count = get_current_count(save_folder)
        print(f"   🎉 {style_key} Final Count: {final_count}/{TARGET_COUNT}")

if __name__ == "__main__":
    fill_gaps_with_pexels()