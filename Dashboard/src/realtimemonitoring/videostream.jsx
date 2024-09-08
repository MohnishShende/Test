import React, { useEffect, useState } from "react";

const VideoStream = () => {
    const [imageSrc, setImageSrc] = useState("");
    const [socket, setSocket] = useState(null);
  
    // Function to connect WebSocket
    const connectWebSocket = () => {
        const newSocket = new WebSocket("ws://210.212.165.87:8000/cam");
        console.log("WebSocket connection opened");

        newSocket.onmessage = function(event) {
            setImageSrc("data:image/jpeg;base64," + event.data);
        };

        newSocket.onclose = function() {
            setImageSrc("");
        };

        newSocket.onerror = function(event) {
            console.error("WebSocket error:", event);
        };

        setSocket(newSocket);
    };

    
  
    const handleStartClick = () => {
        if (!socket) {
            connectWebSocket();
        }
    };
    

    const handleStopClick = async () => {
        if (socket) {
            try {
                // Send GET request to close the camera
                const response = await fetch("http://210.212.165.87:8000/close_cam");
                
                // Check if the request was successful (status code 200)
                if (response.ok) {
                    console.log("WebSocket connection closed and camera released successfully");
                } else {
                    console.error("Failed to close camera:", response.statusText);
                }
            } catch (error) {
                console.error("An error occurred while closing the camera:", error);
            }
    
            // Close WebSocket connection and reset state
            socket.close();
            setSocket(null);
            setImageSrc("");
        }
    };
    
    
    return(
        <div className="flex-grow bg-transparent p-6">
            <div className="bg-gray-100 rounded-lg overflow-hidden w-full h-full p-6">
                <h2 className="text-xl font-bold mb-4 text-blue-600">Live CCTV Feed</h2>
                <div className="text-center h-96 mb-4">
                    {imageSrc && <img src={imageSrc} alt="Live feed" />}
                </div>
                {/* Start and Stop buttons */}
                <div className="flex justify-center">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={handleStartClick}
                        aria-label="Start video stream"
                    >
                        Start
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleStopClick}
                        aria-label="Stop video stream"
                    >
                        Stop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoStream;
