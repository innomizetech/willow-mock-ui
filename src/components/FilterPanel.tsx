import React, { useMemo, useState } from "react";
import Select, { SelectOption } from "./Select";
import Button from "./Button";
import Checkbox from "./Checkbox";
import DatePicker from "./DatePicker";

type Props = {
  clients: string[];
  statuses: string[];
  filters: any;
  setFilters: (f: any) => void;
  onSearch: () => void;
  onClear: () => void;
};

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
  const selectOptions: SelectOption[] = useMemo(
    () => options.map((opt) => ({ value: opt, label: opt })),
    [options],
  );

  const selectedOptions = useMemo(
    () => selectOptions.filter((opt) => value.includes(opt.value)),
    [selectOptions, value],
  );

  const handleChange = (newValue: SelectOption[] | null) => {
    if (newValue) {
      onChange(newValue.map((opt) => opt.value));
    } else {
      onChange([]);
    }
  };

  return (
    <Select
      options={selectOptions}
      value={selectedOptions}
      onChange={handleChange as any}
      placeholder={placeholder || "Select..."}
      multiple={true}
      searchable={true}
      clearable={true}
      fullWidth={true}
    />
  );
}

export default function FilterPanel({
  clients,
  statuses,
  filters,
  setFilters,
  onSearch,
  onClear,
}: Props) {
  const handleDateChange = (type: "start" | "end") => (date: Date | null) => {
    if (type === "start") {
      setFilters({
        ...filters,
        startDate: date ? date.toISOString().slice(0, 10) : "",
      });
    } else {
      setFilters({
        ...filters,
        endDate: date ? date.toISOString().slice(0, 10) : "",
      });
    }
  };

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-xtnd-dark mb-1">
            Client(s):
          </label>
          <MultiSelect
            options={clients}
            value={filters.clients}
            onChange={(v) => setFilters({ ...filters, clients: v })}
            placeholder="Select Client(s)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-xtnd-dark mb-1">
            Status(s):
          </label>
          <MultiSelect
            options={statuses}
            value={filters.statuses}
            onChange={(v) => setFilters({ ...filters, statuses: v })}
            placeholder="Select Status(s)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-xtnd-dark mb-1">
            Generated Date:
          </label>
          <div className="flex gap-2 items-center">
            <DatePicker
              mode="single"
              value={parseDate(filters.startDate)}
              onChange={handleDateChange("start")}
              placeholder="Start Date"
              format="MM/dd/yyyy"
              buttonClassName="text-sm py-1.5"
            />
            <span className="text-gray-500">-</span>
            <DatePicker
              mode="single"
              value={parseDate(filters.endDate)}
              onChange={handleDateChange("end")}
              placeholder="End Date"
              format="MM/dd/yyyy"
              buttonClassName="text-sm py-1.5"
            />
            <button
              onClick={() =>
                setFilters({
                  ...filters,
                  startDate: "",
                  endDate: "",
                })
              }
              className="text-gray-400 hover:text-xtnd-dark transition-colors p-1"
              title="Clear dates"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-xtnd-dark mb-1">
            Associate Attorney(s):
          </label>
          <MultiSelect
            options={[]}
            value={[]}
            onChange={() => {}}
            placeholder="Select Associate Attorney(s)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-xtnd-dark mb-1">
            Responsible Attorney(s):
          </label>
          <MultiSelect
            options={[]}
            value={[]}
            onChange={() => {}}
            placeholder="Select Responsible Attorney(s)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-xtnd-dark mb-1">
            Biller(s):
          </label>
          <MultiSelect
            options={[]}
            value={[]}
            onChange={() => {}}
            placeholder="Select Biller(s)"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-xtnd-dark mb-1">
            Hold Type(s):
          </label>
          <MultiSelect
            options={[]}
            value={[]}
            onChange={() => {}}
            placeholder="Select Hold Type(s)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-xtnd-dark mb-1">
            Keyword:
          </label>
          <input
            placeholder="Keyword Search..."
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6"></div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-xtnd-dark mb-2">
          Options:
        </label>
        <div className="flex gap-6">
          <Checkbox
            checked={filters.includeLocked}
            onChange={(e) =>
              setFilters({ ...filters, includeLocked: e.target.checked })
            }
            label="Include Locked Invoices"
          />

          <Checkbox
            checked={filters.includeDeleted}
            onChange={(e) =>
              setFilters({ ...filters, includeDeleted: e.target.checked })
            }
            label="Include Deleted Invoices"
          />

          <Checkbox
            checked={filters.onHoldOnly}
            onChange={(e) =>
              setFilters({ ...filters, onHoldOnly: e.target.checked })
            }
            label="On Hold Bills Only"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="text-sm text-xtnd-dark">
          <span className="font-semibold">Total invoices:</span> 204
          <span className="ml-6 font-semibold">Total amount:</span> $436,042.13
        </div>
        <div className="flex gap-3">
          <Button onClick={onClear} variant="secondary" size="md">
            Clear
          </Button>
          <Button onClick={onSearch} variant="primary" size="md">
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
