from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from ultralytics.solutions import object_counter
import os
from graph_routes.line_graph_in import LineIn
from graph_routes.box_graph_out import BoxPlotOut
from graph_routes.box_graph_in import BoxPlotIN
from graph_routes.line_graph_out import LineOut
from Vehicle_count_routes.count_vehicles import TotalCounts
from video_display.detection_model import Streamer



os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"


app = FastAPI()
model = YOLO("yolov8n.pt")  # Load YOLOv8 model

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*","http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return{"message": "The Backend is created by AIR RESOURCE DEPARTMENT"}

app.include_router(Streamer)
app.include_router(TotalCounts, tags=["Total Vehicles"])
app.include_router(LineIn,tags=["Graphs"])
app.include_router(BoxPlotOut, tags=["Graphs"])
app.include_router(BoxPlotIN, tags=["Graphs"])
app.include_router(LineOut, tags=["Graphs"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
