import pandas as pd
import matplotlib
matplotlib.use('agg')
import matplotlib.pyplot as plt
import io
from fastapi import Response, APIRouter
import base64

BoxPlotOut = APIRouter()

# Function to update and return the stacked bar graph for "Out Count"
@BoxPlotOut.get("/update_graphs_out")
def update_graphs_out():
    # Read CSV data
    df = pd.read_csv("./object_counts.csv")

    # Group the DataFrame by class and time and sum the counts for "Out Count"
    class_time_counts_out = df.groupby(['Class', 'Datetime'])['Out Count'].sum().unstack(fill_value=0)

    # Plot the stacked bar graph for "Out Count"
    plt.figure(figsize=(12, 8))
    class_time_counts_out.plot(kind='bar', stacked=True)
    plt.xlabel('Class')
    plt.ylabel('Out Count')
    plt.title('Out Count by Class Over Time')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.legend().set_visible(False)
    # plt.legend(title='Time')

    # Convert plot to BytesIO buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)

    # Read image content as bytes
    image_bytes = buffer.getvalue()

    # Encode image bytes to base64
    image_base64 = base64.b64encode(image_bytes).decode()

    # Return the base64 encoded image as a JSON response
    return {"image": image_base64}


# import pandas as pd
# import matplotlib
# matplotlib.use('agg')
# import matplotlib.pyplot as plt
# from io import BytesIO
# from fastapi import  Response, APIRouter


# BoxPlotOut = APIRouter()


# # Function to update and return the stacked bar graph for "Out Count"
# @BoxPlotOut.get("/update_graphs_out")
# def update_graphs_out():
#     # Read CSV data
#     df = pd.read_csv("./object_counts.csv")

#     # Group the DataFrame by class and time and sum the counts for "Out Count"
#     class_time_counts_out = df.groupby(['Class', 'Datetime'])['Out Count'].sum().unstack(fill_value=0)

#     # Plot the stacked bar graph for "Out Count"
#     plt.figure(figsize=(12, 8))
#     class_time_counts_out.plot(kind='bar', stacked=True)
#     plt.xlabel('Class')
#     plt.ylabel('Out Count')
#     plt.title('Out Count by Class Over Time')
#     plt.xticks(rotation=45)
#     plt.tight_layout()
#     plt.legend(title='Time')

#     # Save plot to BytesIO buffer
#     buffer = BytesIO()
#     plt.savefig(buffer, format='png')
#     buffer.seek(0)

#     # Return the contents of the buffer as a response
#     return Response(content=buffer.getvalue(), media_type="image/png")
