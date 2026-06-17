import os
import shutil
import random

SOURCE_DIR = "dataset1"
OUTPUT_DIR = "dataset1_split"

SPLIT = {
    "train": 0.70,
    "val": 0.15,
    "test": 0.15
}

classes = ["AI", "Real"]
categories = ["peoples", "animals", "views", "flowers"]

random.seed(42)

image_extensions = (".jpg", ".jpeg", ".png", ".webp")

for class_name in classes:
    for category in categories:
        source_category_dir = os.path.join(SOURCE_DIR, class_name, category)

        images = [
            file for file in os.listdir(source_category_dir)
            if file.lower().endswith(image_extensions)
        ]

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
            output_category_dir = os.path.join(
                OUTPUT_DIR,
                split_name,
                class_name,
                category
            )

            os.makedirs(output_category_dir, exist_ok=True)

            for file_name in files:
                src = os.path.join(source_category_dir, file_name)
                dst = os.path.join(output_category_dir, file_name)

                for file_name in files:
                    src = os.path.join(source_category_dir, file_name)
                    dst = os.path.join(output_category_dir, file_name)

                    print("Copying:", src)

                    try:
                        shutil.copy2(src, dst)
                    except FileNotFoundError:
                        print("File not found:", src)

print("Dataset split completed successfully!")