import os
import torch
from PIL import Image
from torchvision import transforms
import timm
from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

BASE_IMAGE_FOLDER = "dataset1_split/test"

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

idx_to_label = {
    0: "fake",
    1: "real"
}

model = timm.create_model("efficientnet_b0", pretrained=False, num_classes=2)
model.load_state_dict(torch.load("deepfake_model.pth", map_location=device))
model.to(device)
model.eval()

with engine.connect() as conn:
    images = conn.execute(text("""
        SELECT image_id, image_path, image_type
        FROM images
    """)).fetchall()

    print("Images from DB:", len(images))

    for row in images:
        image_id = row.image_id
        db_image_path = row.image_path
        true_type = row.image_type

        full_image_path = os.path.join(BASE_IMAGE_FOLDER, db_image_path)

        image = Image.open(full_image_path).convert("RGB")
        image_tensor = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            confidence_value, prediction = torch.max(probabilities, 1)

        model_prediction = idx_to_label[prediction.item()]
        model_confidence = round(confidence_value.item() * 100, 2)
        model_correct = model_prediction == true_type

        conn.execute(text("""
            UPDATE images
            SET
                model_prediction = :model_prediction,
                model_confidence = :model_confidence,
                model_correct = :model_correct
            WHERE image_id = :image_id
        """), {
            "model_prediction": model_prediction,
            "model_confidence": model_confidence,
            "model_correct": model_correct,
            "image_id": image_id
        })

    conn.commit()

print("Model predictions updated successfully!")