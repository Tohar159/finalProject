import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import timm

# שימוש במעבד גרפי אם קיים
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

# נתיבים
TRAIN_DIR = "dataset1_split/train"
VAL_DIR = "dataset1_split/val"

# טרנספורמציות לתמונות
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# טעינת הדאטה
train_dataset = datasets.ImageFolder(TRAIN_DIR, transform=transform)
val_dataset = datasets.ImageFolder(VAL_DIR, transform=transform)

print("Classes:", train_dataset.classes)
print("Class to index:", train_dataset.class_to_idx)
print("Train images:", len(train_dataset))
print("Validation images:", len(val_dataset))

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)

# טעינת EfficientNet-B0
model = timm.create_model("efficientnet_b0", pretrained=True, num_classes=2)
model.to(device)

# פונקציית איבוד ואופטימיזציה
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# אימון
epochs = 5

for epoch in range(epochs):
    model.train()

    running_loss = 0.0
    correct = 0
    total = 0

    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()

        outputs = model(images)
        loss = criterion(outputs, labels)

        loss.backward()
        optimizer.step()

        running_loss += loss.item()

        _, predicted = torch.max(outputs, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

    train_accuracy = 100 * correct / total

    # בדיקה על validation
    model.eval()
    val_correct = 0
    val_total = 0

    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)

            outputs = model(images)
            _, predicted = torch.max(outputs, 1)

            val_total += labels.size(0)
            val_correct += (predicted == labels).sum().item()

    val_accuracy = 100 * val_correct / val_total

    print(f"Epoch {epoch + 1}/{epochs}")
    print(f"Loss: {running_loss:.4f}")
    print(f"Train Accuracy: {train_accuracy:.2f}%")
    print(f"Validation Accuracy: {val_accuracy:.2f}%")
    print("-" * 30)

print("Training completed!")

# שמירת המודל
torch.save(model.state_dict(), "deepfake_model.pth")

print("Model saved!")