import os
from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

TEST_FOLDER = "dataset1_split/test"

with engine.connect() as conn:

    for image_type in ["AI", "Real"]:

        type_folder = os.path.join(TEST_FOLDER, image_type)

        for category in os.listdir(type_folder):

            category_folder = os.path.join(type_folder, category)

            if not os.path.isdir(category_folder):
                continue

            for file_name in os.listdir(category_folder):

                image_path = os.path.join(
                    image_type,
                    category,
                    file_name
                )

                conn.execute(
                    text("""
                        INSERT INTO images
                        (image_path, image_type, category)
                        VALUES
                        (:path, :type, :category)
                    """),
                    {
                        "path": image_path,
                        "type": "fake" if image_type == "AI" else "real",
                        "category": category
                    }
                )

    conn.commit()

print("Images inserted successfully!")