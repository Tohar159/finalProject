import os
from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:159357@localhost:5432/deepfake_experiment"
)

engine = create_engine(DATABASE_URL)

TEST_FOLDER = "dataset/test"

with engine.connect() as conn:

    # real
    real_folder = os.path.join(TEST_FOLDER, "real")

    for file_name in os.listdir(real_folder):

        image_path = os.path.join(real_folder, file_name)

        conn.execute(
            text("""
                INSERT INTO images
                (image_path, image_type, category)
                VALUES
                (:path, :type, :category)
            """),
            {
                "path": image_path,
                "type": "real",
                "category": "face"
            }
        )

    # fake
    fake_folder = os.path.join(TEST_FOLDER, "fake")

    for file_name in os.listdir(fake_folder):

        image_path = os.path.join(fake_folder, file_name)

        conn.execute(
            text("""
                INSERT INTO images
                (image_path, image_type, category)
                VALUES
                (:path, :type, :category)
            """),
            {
                "path": image_path,
                "type": "fake",
                "category": "face"
            }
        )

    conn.commit()

print("Images inserted successfully!")