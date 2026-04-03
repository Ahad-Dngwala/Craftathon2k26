from ai_service.ocr import extract_text

images = [
    "ai_service/test_images/1.jpeg",
    "ai_service/test_images/2.jpeg",
    "ai_service/test_images/3.jpeg",
    "ai_service/test_images/4.jpg",
    "ai_service/test_images/5.jpg",
]

for img in images:
    text = extract_text(img)
    print(f"{img} -> {text}")