import pandas as pd
import matplotlib
matplotlib.use('agg')
import matplotlib.pyplot as plt
from io import BytesIO
from fastapi import Response, APIRouter
import base64

LineIn = APIRouter()

@LineIn.get("/line_update_graph_in")
def line_update_graph_in():
    # Read CSV data
    df = pd.read_csv("./object_counts.csv")
    df['Datetime'] = pd.to_datetime(df['Datetime'])

    # Group the DataFrame by class and time and sum the counts for "In Count"
    class_time_counts_in = df.groupby(['Class', pd.Grouper(key='Datetime', freq='H')])['In Count'].sum().unstack(fill_value=0)

    # Plot the line graph for "In Count"
    plt.figure(figsize=(12, 8))
    for class_name, counts in class_time_counts_in.iterrows():
        plt.plot(counts.index, counts.values, label=class_name)
    plt.xlabel('Time')
    plt.ylabel('In Count')
    plt.title('In Count by Class Over Time')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.legend()

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
