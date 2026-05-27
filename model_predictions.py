import torch
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import timm
import pandas as pd

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# כרגע נבדוק על test
dataset = datasets.ImageFolder("dataset/test", transform=transform)
loader = DataLoader(dataset, batch_size=32, shuffle=False)

class_names = dataset.classes
print("Classes:", class_names)

model = timm.create_model("efficientnet_b0", pretrained=False, num_classes=2)
model.load_state_dict(torch.load("deepfake_model.pth", map_location=device))
model.to(device)
model.eval()

results = []

with torch.no_grad():
    for images, labels in loader:
        images = images.to(device)
        labels = labels.to(device)

        outputs = model(images)
        probabilities = torch.softmax(outputs, dim=1)

        confidence_values, predictions = torch.max(probabilities, 1)

        for i in range(len(images)):
            true_label = class_names[labels[i].item()]
            predicted_label = class_names[predictions[i].item()]
            confidence = round(confidence_values[i].item() * 100, 2)
            is_correct = true_label == predicted_label

            image_path = dataset.samples[len(results)][0]

            results.append({
                "image_path": image_path,
                "true_label": true_label,
                "model_prediction": predicted_label,
                "model_confidence": confidence,
                "model_correct": is_correct
            })

df = pd.DataFrame(results)
df.to_csv("model_predictions.csv", index=False, encoding="utf-8-sig")

print("Saved model_predictions.csv")
print(df.head())
