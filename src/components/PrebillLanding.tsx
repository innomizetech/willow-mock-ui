import { useMemo, useState } from "react";
import ResultsTable from "./ResultsTable";
import { invoicesMockData } from "../mock-data";
import { FilterProvider, useFilters } from "./filter/FilterProvider";
import { FilterButton } from "./filter/FilterButton";
import { FilterChips } from "./filter/FilterChips";
import { FilterDrawer } from "./filter/FilterDrawer";
import Select from "./Select";
import Checkbox from "./Checkbox";
import DatePicker from "./DatePicker";

interface Filters {
  clients: string[];
  statuses: string[];
  startDate: string;
  endDate: string;
  keyword: string;
  associateAttorneys: string[];
  responsibleAttorneys: string[];
  billers: string[];
  holdTypes: string[];
  includeLocked: boolean;
  includeDeleted: boolean;
  onHoldOnly: boolean;
  [key: string]: unknown;
}

function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const selectOptions = useMemo(
    () => options.map((opt) => ({ value: opt, label: opt })),
    [options],
  );

  const selectedOptions = useMemo(
    () => selectOptions.filter((opt) => value.includes(opt.value)),
    [selectOptions, value],
  );

  const handleChange = (newValue: any) => {
    if (newValue) {
      onChange(newValue.map((opt: any) => opt.value));
    } else {
      onChange([]);
    }
  };

  return (
    <Select
      options={selectOptions}
      value={selectedOptions}
      onChange={handleChange}
      placeholder={placeholder || "Select..."}
      multiple={true}
      searchable={true}
      clearable={true}
      fullWidth={true}
    />
  );
}

// Filter content component for the drawer
function FilterContent({
  clients,
  statuses,
}: {
  clients: string[];
  statuses: string[];
}) {
  const { draft, setDraft } = useFilters();
  const filters = draft as unknown as Filters;

  const handleDateChange = (type: "start" | "end") => (date: Date | null) => {
    if (type === "start") {
      setDraft({
        ...filters,
        startDate: date ? date.toISOString().slice(0, 10) : "",
      });
    } else {
      setDraft({
        ...filters,
        endDate: date ? date.toISOString().slice(0, 10) : "",
      });
    }
  };

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  // Placeholder data - you should replace with actual data from your backend
  const associateAttorneys: string[] = [];
  const responsibleAttorneys: string[] = [];
  const billers: string[] = [];
  const holdTypes: string[] = [];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-xtnd-dark mb-2">
          Client(s):
        </label>
        <MultiSelect
          options={clients}
          value={filters.clients || []}
          onChange={(v) => setDraft({ ...filters, clients: v })}
          placeholder="Select Client(s)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-xtnd-dark mb-2">
          Status(s):
        </label>
        <MultiSelect
          options={statuses}
          value={filters.statuses || []}
          onChange={(v) => setDraft({ ...filters, statuses: v })}
          placeholder="Select Status(s)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-xtnd-dark mb-2">
          Generated Date:
        </label>
        <div className="flex flex-col gap-2">
          <DatePicker
            mode="single"
            value={parseDate(filters.startDate || "")}
            onChange={handleDateChange("start")}
            placeholder="Start Date"
            format="MM/dd/yyyy"
            buttonClassName="text-sm py-1.5"
          />
          <DatePicker
            mode="single"
            value={parseDate(filters.endDate || "")}
            onChange={handleDateChange("end")}
            placeholder="End Date"
            format="MM/dd/yyyy"
            buttonClassName="text-sm py-1.5"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-xtnd-dark mb-2">
          Associate Attorney(s):
        </label>
        <MultiSelect
          options={associateAttorneys}
          value={filters.associateAttorneys || []}
          onChange={(v) => setDraft({ ...filters, associateAttorneys: v })}
          placeholder="Select Associate Attorney(s)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-xtnd-dark mb-2">
          Responsible Attorney(s):
        </label>
        <MultiSelect
          options={responsibleAttorneys}
          value={filters.responsibleAttorneys || []}
          onChange={(v) => setDraft({ ...filters, responsibleAttorneys: v })}
          placeholder="Select Responsible Attorney(s)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-xtnd-dark mb-2">
          Biller(s):
        </label>
        <MultiSelect
          options={billers}
          value={filters.billers || []}
          onChange={(v) => setDraft({ ...filters, billers: v })}
          placeholder="Select Biller(s)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-xtnd-dark mb-2">
          Hold Type(s):
        </label>
        <MultiSelect
          options={holdTypes}
          value={filters.holdTypes || []}
          onChange={(v) => setDraft({ ...filters, holdTypes: v })}
          placeholder="Select Hold Type(s)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-xtnd-dark mb-2">
          Keyword:
        </label>
        <input
          placeholder="Keyword Search..."
          value={filters.keyword || ""}
          onChange={(e) => setDraft({ ...filters, keyword: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-xtnd-dark mb-2">
          Options:
        </label>
        <div className="space-y-3">
          <Checkbox
            checked={filters.includeLocked || false}
            onChange={(e) =>
              setDraft({ ...filters, includeLocked: e.target.checked })
            }
            label="Include Locked Invoices"
          />

          <Checkbox
            checked={filters.includeDeleted || false}
            onChange={(e) =>
              setDraft({ ...filters, includeDeleted: e.target.checked })
            }
            label="Include Deleted Invoices"
          />

          <Checkbox
            checked={filters.onHoldOnly || false}
            onChange={(e) =>
              setDraft({ ...filters, onHoldOnly: e.target.checked })
            }
            label="On Hold Bills Only"
          />
        </div>
      </div>
    </div>
  );
}

function PrebillLandingContent() {
  const { applied, setDraft, setApplied } = useFilters();
  const filters = applied as unknown as Filters;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const allClients = Array.from(
    new Set(invoicesMockData.map((i) => i.matter.client.name)),
  );
  const allStatuses = Array.from(
    new Set(invoicesMockData.map((i) => i.status)),
  );

  const onRequestSort = (col: string) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    return invoicesMockData.filter((inv) => {
      if (
        filters.clients?.length &&
        !filters.clients.includes(inv.matter.client.name)
      )
        return false;
      if (filters.statuses?.length && !filters.statuses.includes(inv.status))
        return false;
      if (filters.startDate && filters.endDate) {
        const created = new Date(inv.createdAt);
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        if (created < start || created > end) return false;
      }
      if (filters.keyword) {
        const k = filters.keyword.toLowerCase();
        const hay =
          `${inv.matter.name} ${inv.matter.displayNumber} ${inv.billNum} ${inv.matter.client.name}`.toLowerCase();
        if (!hay.includes(k)) return false;
      }
      return true;
    });
  }, [filters]);

  const filterLabels = {
    clients: "Client",
    statuses: "Status",
    startDate: "Start Date",
    endDate: "End Date",
    keyword: "Keyword",
    associateAttorneys: "Associate Attorney",
    responsibleAttorneys: "Responsible Attorney",
    billers: "Biller",
    holdTypes: "Hold Type",
    includeLocked: "Include Locked",
    includeDeleted: "Include Deleted",
    onHoldOnly: "On Hold Only",
  };

  return (
    <>
      <FilterDrawer
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Pre-Bills"
      >
        <FilterContent clients={allClients} statuses={allStatuses} />
      </FilterDrawer>

      <ResultsTable
        invoices={filtered}
        perPage={25}
        sortBy={sortBy || undefined}
        sortDir={sortDir}
        onRequestSort={onRequestSort}
        groupByClient={filters.groupByClient !== false}
        onGroupingChange={(grouped) => {
          const newFilters = { ...filters, groupByClient: grouped };
          setDraft(newFilters);
          setApplied(newFilters);
        }}
        filterButton={<FilterButton onClick={() => setIsFilterOpen(true)} />}
        filterChips={<FilterChips labels={filterLabels} />}
      />
    </>
  );
}

export default function PrebillLanding() {
  const defaultStart = new Date();
  defaultStart.setDate(1);

  return (
    <FilterProvider initialFilters={undefined}>
      <PrebillLandingContent />
    </FilterProvider>
  );
}
