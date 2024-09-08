from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from ultralytics import YOLO
from ultralytics.solutions import object_counter
import cv2
import numpy as np

app = FastAPI()

# Initialize YOLO model and object counter
model = YOLO("yolov8n.pt")
counter = object_counter.ObjectCounter()

# Define region points as a polygon with 5 points
region_points = [(20, 400), (1080, 404), (1080, 360), (20, 360), (20, 400)]
classes_to_count = [0, 2]  # person and car classes for count

# Init Object Counter
counter.set_args(view_img=True,
                 reg_pts=region_points,
                 classes_names=model.names,
                 draw_tracks=True,
                 line_thickness=2)

@app.get("/stream_video/")
async def stream_video():
    cap = cv2.VideoCapture("rtsp://admin:admin@123@192.168.50.101:554/cam/realmonitor?channel=1&subtype=1")
    if not cap.isOpened():
        raise HTTPException(status_code=500, detail="Error opening RTSP stream")

    # Get video properties
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))

    def generate_frames():
        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                break

            # Perform object detection and counting here
            tracks = model.track(frame, persist=True, show=False, classes=classes_to_count)
            frame = counter.start_counting(frame, tracks)

            # Encode frame to jpeg format
            ret, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace;boundary=frame")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
