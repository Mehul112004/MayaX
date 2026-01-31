import os
import requests
from tqdm import tqdm

UNSPLASH_ACCESS_KEY = "ACCESS_KEY"  

STYLES = {
    "modern_indian": "Modern Indian Interior Design Living Room",
    "scandinavian": "Scandinavian Living Room Interior",
    "industrial": "Industrial Loft Living Room",
    "bohemian": "Bohemian Living Room Decor",
    "luxury": "Luxury Contemporary Living Room"
}

ORIENTATION = "squarish" 

IMAGES_PER_STYLE = 100
OUTPUT_DIR = "../training_data/raw_downloads"

def download_image(url, save_path):
    try:
        response = requests.get(url, stream=True, timeout=10)
        response.raise_for_status()
        with open(save_path, 'wb') as file:
            for chunk in response.iter_content(1024):
                file.write(chunk)
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def search_and_download():
    if not UNSPLASH_ACCESS_KEY or "YOUR_ACCESS_KEY" in UNSPLASH_ACCESS_KEY:
        print("❌ Error: Please paste your Unsplash Access Key in the script!")
        return

    headers = {"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"}

    for style_key, query in STYLES.items():
        print(f"\n🔎 Searching for: '{query}' ({style_key})...")
        
        save_folder = os.path.join(OUTPUT_DIR, style_key)
        os.makedirs(save_folder, exist_ok=True)
        
        downloaded_count = 0
        page = 1
        
        pbar = tqdm(total=IMAGES_PER_STYLE, desc=style_key, unit="img")

        while downloaded_count < IMAGES_PER_STYLE:
            params = {
                "query": query,
                "orientation": ORIENTATION,
                "per_page": 30,
                "page": page
            }
            
            response = requests.get("https://api.unsplash.com/search/photos", headers=headers, params=params)
            
            if response.status_code != 200:
                print(f"❌ API Error: {response.text}")
                break

            data = response.json()
            results = data.get('results', [])
            
            if not results:
                print("⚠️ No more results found.")
                break

            for photo in results:
                if downloaded_count >= IMAGES_PER_STYLE:
                    break
                
                img_url = photo['urls']['regular']
                img_id = photo['id']
                filename = f"{style_key}_{img_id}.jpg"
                save_path = os.path.join(save_folder, filename)

                if not os.path.exists(save_path):
                    if download_image(img_url, save_path):
                        downloaded_count += 1
                        pbar.update(1)
            
            page += 1

        pbar.close()
        print(f"✅ Completed {style_key}: {downloaded_count} images.")

if __name__ == "__main__":
    search_and_download()