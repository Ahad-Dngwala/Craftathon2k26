from ai_service.nsfw import detect_nsfw

images = [
    "ai_service/test_images/1.jpeg",
    "ai_service/test_images/2.jpeg",
    "ai_service/test_images/3.jpeg",
    "ai_service/test_images/4.jpeg",
    "ai_service/test_images/5.jpeg",
]

for img in images:
    result = detect_nsfw(img)
    print(f"{img} -> {result}")