// components/TableContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface TableContextType {
  data: { timestamp: string; eventValue: string }[];
  addRow: (eventValue: string) => void;
}

export const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<{ timestamp: string; eventValue: string }[]>([]);

  const addRow = (eventValue: string) => {
    const newRow = {
      timestamp: new Date().toLocaleTimeString(), // This will only run in the client
      eventValue,
    };
    setData((prevData) => [newRow, ...prevData]); // Add new row at the top
  };

  return (
    <TableContext.Provider value={{ data, addRow }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTable must be used within a TableProvider");
  }
  return context;
};
