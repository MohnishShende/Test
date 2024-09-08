import pandas as pd
import matplotlib
matplotlib.use('agg')
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from fastapi import Response, APIRouter


LineOut = APIRouter()

@LineOut.get("/line_update_graph_out")
def line_update_graph_out():
    # Read CSV data
    df = pd.read_csv("./object_counts.csv")
    df['Datetime'] = pd.to_datetime(df['Datetime'])

    # Group the DataFrame by class and time and sum the counts for "Out Count"
    class_time_counts_out = df.groupby(['Class', pd.Grouper(key='Datetime', freq='H')])['Out Count'].sum().unstack(fill_value=0)

    # Plot the line graph for "Out Count"
    plt.figure(figsize=(12, 8))
    for class_name, counts in class_time_counts_out.iterrows():
        plt.plot(counts.index, counts.values, label=class_name)
    plt.xlabel('Time')
    plt.ylabel('Out Count')
    plt.title('Out Count by Class Over Time')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.legend()

    # Save the plot to a BytesIO buffer
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)

    # Convert the image to base64
    image_base64 = base64.b64encode(buffer.getvalue()).decode()

    # Close the plot
    plt.close()

    # Return the base64 encoded image as a JSON response
    return {"image": image_base64}


# import pandas as pd
# import matplotlib
# matplotlib.use('agg')
# import matplotlib.pyplot as plt
# from io import BytesIO
# from fastapi import Response, APIRouter


# LineOut = APIRouter()

# @LineOut.get("/line_update_graph_out")
# def line_update_graph_out():
#     # Read CSV data
#     df = pd.read_csv("./object_counts.csv")
#     df['Datetime'] = pd.to_datetime(df['Datetime'])

#     # Group the DataFrame by class and time and sum the counts for "Out Count"
#     class_time_counts_out = df.groupby(['Class', pd.Grouper(key='Datetime', freq='H')])['Out Count'].sum().unstack(fill_value=0)

#     # Plot the line graph for "Out Count"
#     plt.figure(figsize=(12, 8))
#     for class_name, counts in class_time_counts_out.iterrows():
#         plt.plot(counts.index, counts.values, label=class_name)
#     plt.xlabel('Time')
#     plt.ylabel('Out Count')
#     plt.title('Out Count by Class Over Time')
#     plt.xticks(rotation=45)
#     plt.tight_layout()
#     plt.legend()

#     # Save the plot to a BytesIO buffer
#     buffer = BytesIO()
#     plt.savefig(buffer, format='png')
#     buffer.seek(0)
#     plt.close()

#     # Return the contents of the buffer as a response
#     return Response(content=buffer.getvalue(), media_type="image/png")