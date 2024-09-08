import os
import pandas as pd
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse


TotalCounts = APIRouter()


@TotalCounts.get("/get_counts")
def get_counts():
    csv_path = "./object_counts.csv"
    if os.path.exists(csv_path):
        # Read the CSV file
        df = pd.read_csv(csv_path)
        
        # Prepare response data
        response_data = []
        for _, row in df.iterrows():
            count_data = {
                "Datetime": row['Datetime'],
                "Class": row['Class'],
                "In Count": row['In Count'],
                "Out Count": row['Out Count']
            }
            response_data.append(count_data)

        return JSONResponse(content=response_data)
    else:
        raise HTTPException(status_code=404, detail="CSV file not found")