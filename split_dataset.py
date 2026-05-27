import os
import shutil
import random

SOURCE_DIR = "dataset_raw"
OUTPUT_DIR = "dataset"

SPLIT = {
    "train": 0.70,
    "val": 0.15,
    "test": 0.15
}

classes = ["real", "fake"]

for class_name in classes:
    source_class_dir = os.path.join(SOURCE_DIR, class_name)
    images = os.listdir(source_class_dir)
    random.shuffle(images)

    total = len(images)
    train_end = int(total * SPLIT["train"])
    val_end = train_end + int(total * SPLIT["val"])

    split_images = {
        "train": images[:train_end],
        "val": images[train_end:val_end],
        "test": images[val_end:]
    }

    for split_name, files in split_images.items():
        output_class_dir = os.path.join(OUTPUT_DIR, split_name, class_name)
        os.makedirs(output_class_dir, exist_ok=True)

        for file_name in files:
            src = os.path.join(source_class_dir, file_name)
            dst = os.path.join(output_class_dir, file_name)
            shutil.copy2(src, dst)

print("Dataset split completed successfully!")