"use client";

import { transactionColumns } from "@/app/components/tables/wallet-columns";
import { DataTable } from "@/components/ui/data-table";
import { dummyTransactions } from "@/lib/data";

const page = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold pb-6">Transactions</h1>

      <DataTable data={dummyTransactions} columns={transactionColumns} />
    </div>
  );
};

export default page;
