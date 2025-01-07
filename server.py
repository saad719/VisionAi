import os
import uuid  # for generating unique processed file names
import base64  # <-- Add this import
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import cv2
import numpy as np
from datetime import datetime  # For adding timestamp
import datetime  # for timedelta

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Load YOLO model
net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")
with open("coco.names", "r") as f:
    classes = [line.strip() for line in f.readlines()]

# For YOLO outputs
output_layers = net.getUnconnectedOutLayersNames()

# ------------------------------
# 1) POST /upload
#    - Upload the video. Store its filename server-side
# ------------------------------
@app.route("/upload", methods=["POST"])
def upload_video():
    try:
        file = request.files.get("file")
        if not file:
            return jsonify({"error": "No file provided"}), 400

        # Save uploaded video
        filename = file.filename
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)

        # Return some token or just the filename so client can reference
        return jsonify({
            "message": "Upload successful",
            "filename": filename
        })

    except Exception as e:
        print("Error in /upload:", str(e))
        return jsonify({"error": "Upload failed"}), 500

# ------------------------------
# 2) POST /process
#    - Accepts a JSON or form data with the
#      'filename' (uploaded video) and 'prompts' (list of objects)
#    - Runs YOLO detection for each prompt
# ------------------------------
@app.route("/process", methods=["POST"])
def process_video():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON payload"}), 400

        filename = data.get("filename", "")
        prompts = data.get("prompts", [])  # e.g., ["person", "dog"]

        if not filename or not prompts:
            return jsonify({"error": "Missing filename or prompts"}), 400

        video_path = os.path.join(UPLOAD_FOLDER, filename)
        if not os.path.exists(video_path):
            return jsonify({"error": "Uploaded video not found"}), 404

        # Open video
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return jsonify({"error": "Could not open the video file."}), 400
        fps = cap.get(cv2.CAP_PROP_FPS)  # Get video frame rate (fps)
        processed_frames = []
        frame_count = 0
        skip_interval = 5
        frame_data = []  # To store base64-encoded frames
        selected_frames = 0  # To track how many frames we have processed
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        # Calculate the step size to pick 10 evenly distributed frames
        
        frame_step = total_frames // 10

        frame_data = []  # To store base64-encoded frames
        selected_frames = 0  # To count the selected frames

# Process frames
        frame_count = 0
        while cap.isOpened() and selected_frames < 10:
            ret, frame = cap.read()
            if not ret:
                break
            frame_count += 1

            # For speed, only detect on every nth frame
            if frame_count % frame_step == 0:
                # DETECT for MULTIPLE PROMPTS
                detections = detect_objects_multi_prompts(frame, prompts)
                for (x, y, w, h) in detections:
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

                # Calculate timestamp based on frame number and fps
                timestamp_sec = frame_count / fps  # seconds
                timestamp = str(datetime.timedelta(seconds=timestamp_sec))

                # Add timestamp text on the frame
                font = cv2.FONT_HERSHEY_SIMPLEX
                cv2.putText(frame, timestamp, (10, 30), font, 1, (255, 255, 255), 2, cv2.LINE_AA)

                # Convert frame to base64
                _, buffer = cv2.imencode('.jpg', frame)
                encoded_frame = base64.b64encode(buffer).decode('utf-8')  # Base64-encoded frame
                frame_data.append(f"data:image/jpeg;base64,{encoded_frame}")
                selected_frames += 1

            # Skip some frames to ensure we're selecting 10 in total
            if selected_frames >= 10:
                break

        cap.release()

        # Create a unique output filename
        out_name = f"processed_{uuid.uuid4().hex[:8]}_{filename}"
        out_path = os.path.join(OUTPUT_FOLDER, out_name)
        save_video(processed_frames, out_path)

        return jsonify({
            "message": "Processing complete",
            "download_url": f"http://localhost:5000/output/{out_name}",
            "frames": frame_data  # Return base64 frames
        })

    except Exception as e:
        print("Error in /process:", str(e))
        return jsonify({"error": "An error occurred"}), 500

def detect_objects_multi_prompts(frame, prompts):
    """
    Runs YOLO detection on a single frame and returns bounding boxes
    for ANY of the specified prompts (e.g. ["person", "dog"]).
    """
    detections = []
    height, width = frame.shape[:2]

    # Convert to blob
    blob = cv2.dnn.blobFromImage(
        frame, scalefactor=0.00392, size=(416, 416), swapRB=True, crop=False
    )
    net.setInput(blob)
    outputs = net.forward(output_layers)

    for out in outputs:
        for detection in out:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]

            if confidence > 0.5:
                class_name = classes[class_id]
                # If the detected class is in our prompt list
                if class_name.lower() in [p.lower() for p in prompts]:
                    center_x, center_y, w, h = (
                        detection[:4] * [width, height, width, height]
                    ).astype(int)
                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)
                    detections.append((x, y, w, h))

    return detections


def save_video(frames, path, fps=10):
    if not frames:
        return
    height, width, _ = frames[0].shape
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(path, fourcc, fps, (width, height))
    for f in frames:
        out.write(f)
    out.release()


@app.route("/output/<path:filename>")
def get_video(filename):
    return send_from_directory(OUTPUT_FOLDER, filename)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
