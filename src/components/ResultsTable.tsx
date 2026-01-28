import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import Select, { SelectOption } from "./Select";
import { Invoice } from "../mock-data";

type Props = {
  invoices: Invoice[];
  perPage: number;
  sortBy?: string | null;
  sortDir?: "asc" | "desc";
  onRequestSort?: (col: string) => void;
  groupByClient?: boolean;
  onGroupingChange?: (grouped: boolean) => void;
  filterButton?: React.ReactNode;
  filterChips?: React.ReactNode;
};

const statusColor: Record<string, string> = {
  New: "bg-blue-500",
  Posted: "bg-xtnd-blue",
  Paid: "bg-gray-500",
  "Collaboration Edits": "bg-yellow-400",
  "Review Complete": "bg-yellow-400",
  "Ready for Final Review": "bg-purple-600",
  "Ready to Process": "bg-purple-600",
  "Error on Upload": "bg-red-500",
};

export default function ResultsTable({
  invoices,
  perPage,
  sortBy,
  sortDir,
  onRequestSort,
  groupByClient = true,
  onGroupingChange,
  filterButton,
  filterChips,
}: Props) {
  const [expandedClients, setExpandedClients] = useState<
    Record<string, boolean>
  >({});
  const [page, setPage] = useState(1);

  const viewOptions: SelectOption[] = [
    { value: "grouped", label: "Group by Client" },
    { value: "all", label: "No Grouping" },
  ];

  const handleViewChange = (option: SelectOption | null) => {
    if (onGroupingChange) {
      onGroupingChange(option?.value === "grouped");
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("prebill_expanded");
      if (raw) setExpandedClients(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("prebill_expanded", JSON.stringify(expandedClients));
  }, [expandedClients]);

  const sorted = React.useMemo(() => {
    if (!sortBy) return invoices.slice();
    const copy = invoices.slice();
    copy.sort((a, b) => {
      const get = (inv: Invoice) => {
        switch (sortBy) {
          case "client":
            return inv.matter.client.name;
          case "billNum":
            return Number(inv.billNum || 0);
          case "createdAt":
            return new Date(inv.createdAt).getTime();
          case "billDate":
            return new Date(inv.billDate).getTime();
          case "responsible":
            return inv.matter.billAttorney.name;
          case "total":
            return Number(inv.total);
          case "status":
            return inv.status;
          default:
            return "";
        }
      };
      const va = get(a);
      const vb = get(b);
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [invoices, sortBy, sortDir]);

  const grouped = sorted.reduce<Record<string, Invoice[]>>((acc, inv) => {
    const client = inv.matter.client.name;
    acc[client] = acc[client] || [];
    acc[client].push(inv);
    return acc;
  }, {});

  const clientNames = Object.keys(grouped).sort();
  const visibleClients = clientNames.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  const toggle = (c: string) =>
    setExpandedClients((prev) => ({ ...prev, [c]: !prev[c] }));

  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((s, i) => s + Number(i.total), 0);

  const header = (label: string, colKey: string) => (
    <th
      className="cursor-pointer text-left text-xs text-xtnd-dark font-semibold uppercase px-4"
      onClick={() => onRequestSort && onRequestSort(colKey)}
    >
      <div className="flex items-center gap-1 h-12">
        {label}
        <span className="text-gray-400 text-[10px]">
          {sortBy === colKey ? (sortDir === "asc" ? "▲" : "▼") : ""}
        </span>
      </div>
    </th>
  );

  if (!groupByClient) {
    // Show all matters in a flat table
    const visibleInvoices = sorted.slice((page - 1) * perPage, page * perPage);

    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-xtnd-dark">
              Prebilling Management
            </h2>
            <div className="flex items-center gap-4">
              {filterButton}
              <div className="w-48">
                <Select
                  options={viewOptions}
                  value={viewOptions.find((opt) => opt.value === "all")}
                  onChange={handleViewChange}
                  placeholder="Select View"
                  size="sm"
                  fullWidth={true}
                />
              </div>
            </div>
          </div>
          {filterChips && <div>{filterChips}</div>}
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full">
            <thead className="bg-xtnd-light border-b-2 border-xtnd-blue sticky top-0">
              <tr>
                {header("Matter", "client")}
                {header("Bill Num", "billNum")}
                {header("Date Generated", "createdAt")}
                {header("Bill Date", "billDate")}
                {header("Responsible Attorney", "responsible")}
                <th className="text-right px-4">
                  <div
                    className="cursor-pointer text-xs text-xtnd-dark font-semibold uppercase flex items-center justify-end gap-1 h-12"
                    onClick={() => onRequestSort && onRequestSort("total")}
                  >
                    Total
                    <span className="text-gray-400 text-[10px]">
                      {sortBy === "total"
                        ? sortDir === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </span>
                  </div>
                </th>
                {header("Status", "status")}
                <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                  <div className="h-12 flex items-center">Hold Type</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleInvoices.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-gray-500">
                    No pre-bills found. Try adjusting your filters.
                  </td>
                </tr>
              )}
              {visibleInvoices.map((inv, idx) => (
                <tr
                  key={inv.invoiceId}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                >
                  <td className="py-3 px-4">
                    <Link
                      to={`/prebills/${inv.invoiceId}`}
                      className="text-xtnd-blue hover:underline font-medium"
                    >
                      {inv.matter.displayNumber} - {inv.matter.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-sm text-xtnd-dark">
                    {inv.billNum}
                  </td>
                  <td className="py-3 px-4 text-sm text-xtnd-dark">
                    {new Date(inv.createdAt).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 text-sm text-xtnd-dark">
                    {new Date(inv.billDate).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 text-sm text-xtnd-dark">
                    {inv.matter.billAttorney.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-xtnd-dark font-medium">
                    $
                    {Number(inv.total).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-medium ${
                        statusColor[inv.status] || "bg-gray-400"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-xtnd-dark"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center p-4 border-t border-gray-200">
          <div className="text-sm text-xtnd-dark">
            Showing {Math.min(visibleInvoices.length, perPage)} of{" "}
            {totalInvoices} invoices
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="outline"
              size="sm"
            >
              Prev
            </Button>
            <div className="px-3 text-sm text-xtnd-dark">{page}</div>
            <Button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * perPage >= totalInvoices}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Grouped view by client
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-xtnd-dark">
            Prebilling Management
          </h2>
          <div className="flex items-center gap-4">
            {filterButton}
            <div className="w-48">
              <Select
                options={viewOptions}
                value={viewOptions.find((opt) => opt.value === "grouped")}
                onChange={handleViewChange}
                placeholder="Select View"
                fullWidth={true}
              />
            </div>
          </div>
        </div>
        {filterChips && <div>{filterChips}</div>}
      </div>

      <div className="overflow-x-auto p-4">
        <table className="w-full">
          <thead className="bg-xtnd-light border-b-2 border-xtnd-blue sticky top-0">
            <tr>
              {header("Matter", "client")}
              {header("Bill Num", "billNum")}
              {header("Date Generated", "createdAt")}
              {header("Bill Date", "billDate")}
              {header("Responsible Attorney", "responsible")}
              <th className="text-right px-4">
                <div
                  className="cursor-pointer text-xs text-xtnd-dark font-semibold uppercase flex items-center justify-end gap-1 h-12"
                  onClick={() => onRequestSort && onRequestSort("total")}
                >
                  Total
                  <span className="text-gray-400 text-[10px]">
                    {sortBy === "total" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </span>
                </div>
              </th>
              {header("Status", "status")}
              <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                <div className="h-12 flex items-center">Hold Type</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleClients.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No pre-bills found. Try adjusting your filters.
                </td>
              </tr>
            )}
            {visibleClients.map((client) => {
              const clientInvoices = grouped[client];
              return (
                <React.Fragment key={client}>
                  {/* Client Row */}
                  <tr className="bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                    <td className="py-3 px-4" onClick={() => toggle(client)}>
                      <div className="flex items-center gap-2">
                        <button className="text-xtnd-blue hover:text-xtnd-dark transition-colors">
                          {expandedClients[client] ? (
                            <svg
                              className="w-4 h-4 transform rotate-90"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          )}
                        </button>
                        <span className="font-semibold text-xtnd-blue">
                          {client}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4"></td>
                  </tr>

                  {/* Matter Rows (shown when expanded) */}
                  {expandedClients[client] &&
                    clientInvoices.map((inv, idx) => (
                      <tr
                        key={inv.invoiceId}
                        className={`border-b border-gray-100 hover:bg-gray-50 ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                        }`}
                      >
                        <td className="py-3 px-4 pl-12">
                          <Link
                            to={`/prebills/${inv.invoiceId}`}
                            className="text-xtnd-blue hover:underline"
                          >
                            {inv.matter.displayNumber} - {inv.matter.name}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-sm text-xtnd-dark">
                          {inv.billNum}
                        </td>
                        <td className="py-3 px-4 text-sm text-xtnd-dark">
                          {new Date(inv.createdAt).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4 text-sm text-xtnd-dark">
                          {new Date(inv.billDate).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4 text-sm text-xtnd-dark">
                          {inv.matter.billAttorney.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-xtnd-dark font-medium">
                          $
                          {Number(inv.total).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-white text-xs font-medium ${
                              statusColor[inv.status] || "bg-gray-400"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-4"></td>
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center p-4 border-t border-gray-200">
        <div className="text-sm text-xtnd-dark">
          Showing {visibleClients.length} of {clientNames.length} clients
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            variant="outline"
            size="sm"
          >
            Prev
          </Button>
          <div className="px-3 text-sm text-xtnd-dark">{page}</div>
          <Button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * perPage >= clientNames.length}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
