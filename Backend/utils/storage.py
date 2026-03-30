import uuid

def upload_image_to_supabase(
    supabase,
    bucket_name: str,
    image_bytes: bytes,
    user_id: str,
    content_type: str = "image/jpeg",
) -> str:
    """Upload an image file to Supabase Storage and return the public URL."""
    file_ext = "png" if "png" in content_type else "jpg"
    file_name = f"{user_id}/{uuid.uuid4().hex}.{file_ext}"

    # Upload to Supabase Storage
    supabase.storage.from_(bucket_name).upload(
        path=file_name,
        file=image_bytes,
        file_options={"content-type": content_type, "upsert": "true"},
    )

    # Get the public URL
    public_url = supabase.storage.from_(bucket_name).get_public_url(file_name)
    return public_url
