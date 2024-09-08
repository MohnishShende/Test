import React, { useState, useEffect } from 'react';

const GraphSection = () => {
    const [selectedPlot, setSelectedPlot] = useState('line'); // 'line' or 'box'
    const [lineGraphData, setLineGraphData] = useState(null);
    const [boxGraphData, setBoxGraphData] = useState(null);

    useEffect(() => {
        fetchGraphData(); // Fetch graph data initially
    }, []);

    const fetchLineGraphData = async () => {
        try {
            const responseIn = await fetch('http://210.212.165.87:8000/line_update_graph_in');
            const responseOut = await fetch('http://210.212.165.87:8000/line_update_graph_out');
            
            if (!responseIn.ok || !responseOut.ok) {
                throw new Error('Network response for line graph data was not ok');
            }

            const dataIn = await responseIn.json();
            const dataOut = await responseOut.json();

            setLineGraphData({ inData: dataIn.image, outData: dataOut.image });
        } catch (error) {
            console.error('Error fetching line graph data:', error);
        }
    };

    const fetchBoxGraphData = async () => {
        try {
            const responseIn = await fetch('http://210.212.165.87:8000/update_graphs_in');
            const responseOut = await fetch('http://210.212.165.87:8000/update_graphs_out');
            
            if (!responseIn.ok || !responseOut.ok) {
                throw new Error('Network response for box graph data was not ok');
            }

            const dataIn = await responseIn.json();
            const dataOut = await responseOut.json();

            setBoxGraphData({ inData: dataIn.image, outData: dataOut.image });
        } catch (error) {
            console.error('Error fetching box graph data:', error);
        }
    };

    const fetchGraphData = () => {
        if (selectedPlot === 'line') {
            fetchLineGraphData();
        } else {
            fetchBoxGraphData();
        }
    };

    const handlePlotChange = (event) => {
        setSelectedPlot(event.target.value);
        fetchGraphData(); // Fetch new graph data when plot type changes
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden w-full p-6 mt-4">
            <h2 className="text-xl font-bold mb-4 text-blue-600">Graphs</h2>
            <div className="flex space-x-4">
                <label>
                    <input
                        type="radio"
                        value="line"
                        checked={selectedPlot === 'line'}
                        onChange={handlePlotChange}
                    />
                    Line Plot
                </label>
                <label>
                    <input
                        type="radio"
                        value="box"
                        checked={selectedPlot === 'box'}
                        onChange={handlePlotChange}
                    />
                    Box Plot
                </label>
            </div>
            {/* Render line graph if selected plot is line */}
            {selectedPlot === 'line' && lineGraphData && (
                <div>
                    <h3 className="text-lg font-bold mb-2">Line Graph - In Count</h3>
                    <img src={`data:image/png;base64,${lineGraphData.inData}`} alt="Line Graph In Count" />
                    <h3 className="text-lg font-bold mt-4 mb-2">Line Graph - Out Count</h3>
                    <img src={`data:image/png;base64,${lineGraphData.outData}`} alt="Line Graph Out Count" />
                </div>
            )}
            {/* Render box plot if selected plot is box */}
            {selectedPlot === 'box' && boxGraphData && (
                <div>
                    <h3 className="text-lg font-bold mb-2">Box Plot - In Count</h3>
                    <img src={`data:image/png;base64,${boxGraphData.inData}`} alt="Box Plot In Count" />
                    <h3 className="text-lg font-bold mt-4 mb-2">Box Plot - Out Count</h3>
                    <img src={`data:image/png;base64,${boxGraphData.outData}`} alt="Box Plot Out Count" />
                </div>
            )}
        </div>
    );
};

export default GraphSection;
