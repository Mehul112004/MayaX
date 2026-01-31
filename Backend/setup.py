import platform
import subprocess
import sys

def install(package_command):
    """Runs a pip install command."""
    subprocess.check_call([sys.executable, "-m", "pip", "install"] + package_command.split())

def main():
    system = platform.system()
    print(f"🔄 Detected OS: {system}")
    print("--------------------------------------")

    # 1. Install PyTorch based on OS
    print("📦 Installing PyTorch...")
    
    if system == "Windows":
        print("   -> Windows detected. Installing CUDA-enabled PyTorch...")
        # Installs PyTorch with CUDA 11.8 support
        try:
            install("torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118")
        except Exception as e:
            print(f"❌ Error installing PyTorch for Windows: {e}")
            sys.exit(1)
            
    elif system == "Darwin": # Darwin is the internal name for macOS
        print("   -> macOS detected. Installing MPS-enabled PyTorch...")
        # Installs standard PyTorch (ARM64 support is built-in)
        try:
            install("torch torchvision torchaudio")
        except Exception as e:
            print(f"❌ Error installing PyTorch for Mac: {e}")
            sys.exit(1)
            
    elif system == "Linux":
        print("   -> Linux detected. Installing CUDA-enabled PyTorch...")
        try:
            install("torch torchvision torchaudio")
        except Exception as e:
            print(f"❌ Error installing PyTorch for Linux: {e}")
            sys.exit(1)
            
    else:
        print(f"⚠️ Unknown OS: {system}. Attempting standard install...")
        install("torch torchvision torchaudio")

    print("✅ PyTorch installed successfully.")
    print("--------------------------------------")

    # 2. Install the rest of the dependencies
    print("📦 Installing requirements.txt...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed.")
    except Exception as e:
        print(f"❌ Error installing requirements: {e}")

    print("\n🎉 MayaX Setup Complete! You are ready to build.")

if __name__ == "__main__":
    main()