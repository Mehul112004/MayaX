import requests

def run_design_inference(original_image_url: str, prompt: str, mode: str = "flexible") -> bytes:
    url = "https://aba4-34-50-177-234.ngrok-free.app/generate"
    
    payload = {
        "image_url": original_image_url,
        "prompt": prompt,
        "mode": mode
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, json=payload, headers=headers, timeout=120)

    if response.status_code != 200:
        raise Exception(f"API Error {response.status_code}: {response.text}")
    
    if response.headers.get("Content-Type", "").startswith("application/json"):
        error = response.json()
        raise Exception(f"API returned error: {error.get('message', 'Unknown error')}")
    
    return response.content