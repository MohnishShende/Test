import React from "react";
import GraphSection from "./graphs";
import VehicleCount from "./vehicle_display";
import VideoStream from "./videostream";

const Display = () => {
  return (
    <div className="mt-4 min-h-screen flex flex-col">
      <div className="py-4 px-6"></div>
      <div className="flex-grow overflow-y-auto"> 
        <div className="md:flex">
          <div className="md:w-3/5">
            <VideoStream />
            <VehicleCount />
          </div>
          <div className="md:w-2/5">
            <GraphSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Display;
