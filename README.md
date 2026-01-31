# MayaX: AI Interior Design Platform

## Setup Instructions

### Installation (One-Step)
1. Create the environment:
   ```bash
   conda create -n mayax python=3.10 -y
   conda activate mayax
   ```
2. Install dependencies:
   ```bash
   python setup.py
   ```

## Data Pipeline Scripts

Location: `Backend/scripts/`

These scripts are used to gather and prepare the dataset for training.

### 1. Image Data Collection
- **`download_raw_images_from_pexels.py`**
  - **Purpose**: Downloads high-quality interior design images from Pexels API.
  - **Functionality**:
    - Searches for 5 defined styles: *Modern Indian, Scandinavian, Industrial, Bohemian, Luxury*.
    - Downloads up to 100 images per style to `../training_data/raw_downloads`.
    - Handles pagination and API rate limits.
    - **Usage**: Requires `PEXELS_API_KEY` to be set in the script.

- **`download_raw_images_from_unsplash.py`**
  - **Purpose**: Downloads additional images from Unsplash API to supplement the dataset.
  - **Functionality**:
    - Similar search criteria as the Pexels script.
    - Saves images `../training_data/raw_downloads`.
    - **Usage**: Requires `UNSPLASH_ACCESS_KEY` to be set in the script.

### 2. Data Preprocessing
- **`preprocess_data.py`**
  - **Purpose**: Standardizes raw images for model training.
  - **Functionality**:
    - **Smart Cropping**: Resizes images to `512x512` pixels while maintaining the aspect ratio of the furniture/room.
    - **Format Conversion**: Converts images to commonly used formats (JPEG/PNG).
    - **Output**: Saves processed images to `../training_data/img/`.

### 3. Automated Annotation
- **`auto_caption.py`**
  - **Purpose**: Generates descriptive captions for the training images.
  - **Functionality**:
    - Uses a local **Ollama** instance with the `llava:13b` model.
    - Generates detailed descriptions covering style, furniture, textures, and lighting.
    - **Trigger Words**: Prefixes captions with specific style tokens (e.g., `modern_indian style`) for fine-tuning.
    - **Output**: Creates a corresponding `.txt` caption file for each image in the `img` directory.