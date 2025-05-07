import { Shop } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const shopColumns: ColumnDef<Shop>[] = [
  {
    accessorKey: "name",
    header: "Shop Name",
    cell: ({ row }) => (
      <div className="max-w-[180px]">
        <div className="font-medium truncate">{row.original.name}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.cashierName}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="max-w-[180px]">
        <div className="font-medium truncate">
          {row.original.location.split(",")[0].trim()}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {row.original.location.split(",")[1].trim()}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "cashierName",
    header: "Cashier",
  },
  {
    accessorKey: "shopCommission",
    header: "Shop Commission",
    cell: ({ row }) => `${row.original.shopCommission}%`,
  },
  {
    accessorKey: "systemCommission",
    header: "System Commission",
    cell: ({ row }) => `${row.original.systemCommission}%`,
  },
  {
    accessorKey: "walletBalance",
    header: "Wallet Balance",
    cell: ({ row }) => (
      <span className="font-medium">
        $
        {row.original.walletBalance.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    accessorKey: "shopId",
    header: "Shop ID",
  },
];
