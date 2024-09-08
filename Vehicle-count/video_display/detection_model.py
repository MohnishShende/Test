from fastapi import WebSocket, APIRouter
from starlette.websockets import WebSocketState
import cv2
import base64
from ultralytics import YOLO
from ultralytics.solutions import object_counter


Streamer = APIRouter()

# Dictionary to hold camera objects for each WebSocket connection
cameras = {}
# Async function to send images over WebSocket with YOLOv8 object detection
async def send_images(websocket: WebSocket):
    model = YOLO("yolov8n.pt")  # Load YOLOv8 model
    
    cap = cv2.VideoCapture("rtsp://admin:admin@123@192.168.50.101:554/cam/realmonitor?channel=1&subtype=1")  # Capture video from webcam
    # cap = cv2.VideoCapture(0)  # Capture video from webcam
    assert cap.isOpened(), "Error reading video file"
    w, h, fps = (int(cap.get(x)) for x in (cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT, cv2.CAP_PROP_FPS))

    region_points = [(260, 235), (190, 231), (350, 340), (350, 340), (450, 325)]
    classes_to_count = [2,3,5,7]  # person and car classes for count

    # Init Object Counter
    
    counter = object_counter.ObjectCounter()
    counter.set_args(view_img=False,
                 reg_pts=region_points,
                 classes_names=model.names,
                 draw_tracks=True,
                 line_thickness=2)

    try:
        while cap.isOpened():
            success, im0 = cap.read()
            if not success:
                print("Video frame is empty or video processing has been successfully completed.")
                break

            # Perform object detection with YOLOv8
            tracks = model.track(im0, persist=True, verbose = False, show=False, classes=classes_to_count)

            # Draw counts on the frame
            im0 = counter.start_counting(im0, tracks)

            # Convert the frame to base64 encoding
            retval, buffer = cv2.imencode('.jpg', im0)
            jpg_as_text = base64.b64encode(buffer).decode('utf-8')
            await websocket.send_text(jpg_as_text)  # Send the frame over WebSocket

    finally:
        # Cleanup
        cap.release()
        cameras.pop(websocket, None)
        # video_writer.release()

# WebSocket endpoint
@Streamer.websocket("/cam")
async def websocket_endpoint(websocket: WebSocket):
    print("Client connected to the WebSocket")
    await websocket.accept()
    await send_images(websocket)  # Start streaming video
    try:
        # Listen for messages from the frontend
        while True:
            message = await websocket.receive_text()
            print(f"Message received from client: {message}")
            if message.lower() == "stop":
                await websocket.close()
                print("Stopping the camera")
                break
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Clean up resources
        if websocket.client_state != WebSocketState.DISCONNECTED:
            await websocket.close()