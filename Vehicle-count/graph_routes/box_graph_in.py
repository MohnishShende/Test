import pandas as pd
import matplotlib
matplotlib.use('agg')
import matplotlib.pyplot as plt
from io import BytesIO
from fastapi import Response, APIRouter
import base64

BoxPlotIN = APIRouter()

# Read CSV data once when the application starts

@BoxPlotIN.get("/update_graphs_in")
def update_graphs_in():
    
    df = pd.read_csv("./object_counts.csv")
    # Group the DataFrame by class and time and sum the counts for "In Count"
    class_time_counts_in = df.groupby(['Class', 'Datetime'])['In Count'].sum().unstack(fill_value=0)

    # Clear previous plot
    plt.clf()

    # Plot the stacked bar graph for "In Count"
    plt.figure(figsize=(12, 8))
    class_time_counts_in.plot(kind='bar', stacked=True)
    plt.xlabel('Class')
    plt.ylabel('In Count')
    plt.title('In Count by Class Over Time')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.legend().set_visible(False)
    # Encode plot to PNG format
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)

    # Read image content as bytes
    image_bytes = buffer.getvalue()

    # Encode image bytes to base64
    image_base64 = base64.b64encode(image_bytes).decode()

    # Return the base64 encoded image as a JSON response
    return {"image": image_base64}
