"use client";

import { shopColumns } from "@/app/components/tables/shop-columns";
import { DataTable } from "@/components/ui/data-table";
import { dummyShops } from "@/lib/data";

const page = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold pb-6">Shops</h1>

      <DataTable data={dummyShops} columns={shopColumns} />
    </div>
  );
};

export default page;
