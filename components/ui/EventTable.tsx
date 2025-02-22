"use client";

import { useTable } from "../TableContext";

const EventTable = () => {
  const { data } = useTable();

  return (
    <div className="p-4">
      <div className="overflow-y-auto max-h-60 border border-gray-400 rounded-md">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gray-300">
            <tr>
              <th className="border border-gray-400 p-2">Timestamp</th>
              <th className="border border-gray-400 p-2">Event</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="border border-gray-400 p-2">{row.timestamp}</td>
                <td className="border border-gray-400 p-2">{row.eventValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventTable;
