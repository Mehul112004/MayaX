import io
import uuid

from PIL import Image, ImageDraw, ImageFont
from supabase import Client


# Warm, design-oriented palette for avatar backgrounds
AVATAR_COLORS = [
    "#D48B95",  # Rose
    "#A34E5D",  # Burgundy
    "#DAA06D",  # Gold
    "#6B8F71",  # Sage
    "#5B7FA5",  # Steel Blue
    "#8B6FB0",  # Lavender
    "#C97B4B",  # Terracotta
    "#4A8F8F",  # Teal
]


def _get_initials(name: str) -> str:
    """Extract initials from a full name. E.g. 'Mehul Sharma' -> 'MS'."""
    if not name or not name.strip():
        return "?"
    parts = name.strip().split()
    if len(parts) == 1:
        return parts[0][0].upper()
    return (parts[0][0] + parts[-1][0]).upper()


def _pick_color(name: str) -> str:
    """Deterministically pick a color based on the name."""
    return AVATAR_COLORS[sum(ord(c) for c in name) % len(AVATAR_COLORS)]


def generate_initials_avatar(name: str, size: int = 256) -> bytes:
    """Generate a PNG avatar image with the user's initials."""
    initials = _get_initials(name)
    bg_color = _pick_color(name)

    img = Image.new("RGB", (size, size), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Try to use a nice font, fall back to default
    font_size = size // 2
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except (IOError, OSError):
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
        except (IOError, OSError):
            font = ImageFont.load_default()

    # Center the text
    bbox = draw.textbbox((0, 0), initials, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) / 2
    y = (size - text_height) / 2 - bbox[1]  # Adjust for font baseline

    draw.text((x, y), initials, fill="white", font=font)

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer.getvalue()


def upload_avatar_to_supabase(
    supabase: Client,
    image_bytes: bytes,
    user_id: str,
    content_type: str = "image/png",
) -> str:
    """Upload an avatar image to Supabase Storage and return the public URL."""
    file_ext = "png" if "png" in content_type else "jpg"
    file_name = f"avatars/{user_id}/{uuid.uuid4().hex}.{file_ext}"

    # Upload to Supabase Storage
    supabase.storage.from_("avatars").upload(
        path=file_name,
        file=image_bytes,
        file_options={"content-type": content_type, "upsert": "true"},
    )

    # Get the public URL
    public_url = supabase.storage.from_("avatars").get_public_url(file_name)
    return public_url
