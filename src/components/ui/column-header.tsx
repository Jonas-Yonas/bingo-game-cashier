"use client";

import { ArrowUpDown } from "lucide-react";
import { flexRender, Header } from "@tanstack/react-table";

interface ColumnHeaderProps<TData> {
  header: Header<TData, unknown>;
}

export function ColumnHeader<TData>({ header }: ColumnHeaderProps<TData>) {
  if (!header.column.getCanSort()) {
    return (
      <div className="text-gray-900 dark:text-gray-200">
        {flexRender(header.column.columnDef.header, header.getContext())}
      </div>
    );
  }

  return (
    <button
      onClick={() => header.column.toggleSorting()}
      className="flex items-center gap-1 hover:text-primary dark:hover:text-primary-300 transition-colors text-gray-900 dark:text-gray-200"
    >
      {flexRender(header.column.columnDef.header, header.getContext())}
      <ArrowUpDown className="h-4 w-4" />
    </button>
  );
}
