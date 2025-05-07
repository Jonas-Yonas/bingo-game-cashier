"use client";

import { cashierColumns } from "@/app/components/tables/cashier-columns";
import { DataTable } from "@/components/ui/data-table";
import { dummyCashiers } from "@/lib/data";

const page = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold pb-6">Cashiers</h1>

      <DataTable data={dummyCashiers} columns={cashierColumns} />
    </div>
  );
};

export default page;
