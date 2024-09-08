import React, { useEffect, useState } from 'react';

const VehicleCount = () => {
  const [counts, setCounts] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false); // State to track if refresh animation is active

  useEffect(() => {
    fetchData(); // Fetch data initially
  }, []);

  const fetchData = () => {
    setIsRefreshing(true); // Activate refresh animation
    // Make API call to fetch data
    fetch('http://210.212.165.87:8000/get_counts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(jsonData => {
        // Preprocess data to organize it by class
        const classData = {};
        jsonData.forEach(item => {
          const { Datetime, Class, 'In Count': inCount, 'Out Count': outCount } = item;
          if (!classData[Class]) {
            classData[Class] = [];
          }
          classData[Class].push({ Datetime, inCount, outCount });
        });
        setCounts(classData);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      })
      .finally(() => {
        setIsRefreshing(false); // Deactivate refresh animation
      });
  };

  const handleRefresh = () => {
    fetchData(); // Call the fetchData function to refresh data
  };

  return (
    <div className="container mx-auto mt-4 px-4 max-h-80 overflow-y-auto">
      <div className="bg-white rounded-lg overflow-hidden w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-600">Number of Vehicles in Last 24 Hours</h2>
          <button
            onClick={handleRefresh}
            className={`w-10 h-10 bg-transparent border border-blue-500 rounded-full flex items-center justify-center focus:outline-none ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <img src="refresh.png" alt="Refresh Icon" className="w-6 h-6 text-blue-500" />
          </button>
        </div>
        {counts && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-center">Class</th>
                  <th className="text-center">Date Time</th>
                  <th className="text-center">In Count</th>
                  <th className="text-center">Out Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(counts).map(([className, classCounts], classIndex) => (
                  <React.Fragment key={className}>
                    {classCounts.map(({ Datetime, inCount, outCount }, index) => (
                      <tr key={`${className}-${index}`}>
                        {index === 0 && (
                          <td className="text-center" rowSpan={classCounts.length}>
                            {className}
                          </td>
                        )}
                        <td className="text-center">{Datetime}</td>
                        <td className="text-center">{inCount}</td>
                        <td className="text-center">{outCount}</td>
                      </tr>
                    ))}
                    {/* Add empty rows for the remaining counts of the class */}
                    {[...Array(classCounts.length - 1)].map((_, i) => (
                      <tr key={`empty-${classIndex}-${i + 1}`}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
  
export default VehicleCount;




// import React, { useEffect, useState } from 'react';

// const VehicleCount = () => {
//   const [counts, setCounts] = useState(null);
//   const [isRefreshing, setIsRefreshing] = useState(false); // State to track if refresh animation is active

//   useEffect(() => {
//     fetchData(); // Fetch data initially
//   }, []);

//   const fetchData = () => {
//     setIsRefreshing(true); // Activate refresh animation
//     // Make API call to fetch data
//     fetch('http://127.0.0.1:8000/get_counts')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(jsonData => {
//         setCounts(jsonData);
//       })
//       .catch(error => {
//         console.error('There was a problem with the fetch operation:', error);
//       })
//       .finally(() => {
//         setIsRefreshing(false); // Deactivate refresh animation
//       });
//   };

//   const handleRefresh = () => {
//     fetchData(); // Call the fetchData function to refresh data
//   };

//   return (
//     <div className="container mx-auto mt-4 px-4 max-h-80 overflow-y-auto">
//       <div className="bg-white rounded-lg overflow-hidden w-full p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-blue-600">Number of Vehicles in Last 24 Hours</h2>
//           <button
//             onClick={handleRefresh}
//             className={`w-10 h-10 bg-transparent border border-blue-500 rounded-full flex items-center justify-center focus:outline-none ${isRefreshing ? 'animate-spin' : ''}`}
//           >
//             <img src="refresh.png" alt="Refresh Icon" className="w-6 h-6 text-blue-500" />
//           </button>
//         </div>
//         {counts && (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr>
//                   <th>Date Time</th>
//                   {Object.keys(counts[0]).filter(key => key !== 'Datetime').map(classKey => (
//                     <th key={classKey}>{classKey}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {counts.map(({ Datetime, ...countData }) => (
//                   <tr key={Datetime}>
//                     <td>{Datetime}</td>
//                     {Object.values(countData).map((count, index) => (
//                       <td key={index}>{count}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
  
// export default VehicleCount;








// import React, { useEffect, useState } from 'react';

// const VehicleCount = () => {
//   const [counts, setCounts] = useState(null);

//   useEffect(() => {
//     fetchData(); // Fetch data initially
//   }, []);

//   const fetchData = () => {
//     // Make API call to fetch data
//     fetch('http://127.0.0.1:8000/get_counts')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(jsonData => {
//         setCounts(jsonData);
//       })
//       .catch(error => {
//         console.error('There was a problem with the fetch operation:', error);
//       });
//   };

//   const handleRefresh = () => {
//     fetchData(); // Call the fetchData function to refresh data
//   };
//   return (
//     <div className="container mx-auto mt-4 px-4 max-h-80 overflow-y-auto">
//       <div className="bg-white rounded-lg overflow-hidden w-full p-6">
//       <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-blue-600">Number of Vehicles in Last 24 Hours</h2>
//           <button onClick={handleRefresh} className="w-10 h-10 bg-transparent border border-blue-500 rounded-full flex items-center justify-center focus:outline-none">
//             <img src="refresh.png" alt="Refresh Icon" className="w-6 h-6 text-blue-500" />
//           </button>
//         </div>
//         {/* <h2 className="text-xl font-bold mb-4 text-blue-600">Number of Vehicles in Last 24 Hours</h2> */}
//         {counts && (
//           <div>
//             <div className="flex flex-wrap justify-between">
//               <div className="w-full sm:w-1/2">
//                 <h3 className="text-lg font-semibold mb-2">Up Counts</h3>
//                 <ul>
//                   {Object.entries(counts.up_counts).map(([vehicle, count]) => (
//                     <li key={vehicle}>
//                       {vehicle}: {count}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
//                 <h3 className="text-lg font-semibold mb-2">Down Counts</h3>
//                 <ul>
//                   {Object.entries(counts.down_counts).map(([vehicle, count]) => (
//                     <li key={vehicle}>
//                       {vehicle}: {count}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
  
// export default VehicleCount;
