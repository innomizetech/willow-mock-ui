import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardBody } from "./Card";
import Button from "./Button";
import Badge from "./Badge";
import Modal from "./Modal";
import {
  HiPlus,
  HiChatAlt,
  HiPaperAirplane,
  HiLink,
  HiRefresh as HiSync,
  HiClock,
  HiCheckCircle,
  HiPlusCircle,
  HiPencil,
  HiTrash,
  HiChevronDown,
  HiChevronRight,
  HiSearch,
  HiDotsVertical,
} from "react-icons/hi";
import { AiOutlineSwap } from "react-icons/ai";

import { invoicesMockData } from "../mock-data";

// Mock fee entry data
interface FeeEntry {
  id: string;
  date: string;
  services: string;
  attorney: string;
  activityCode: string;
  taskCode: string;
  eventCode: string;
  ratePerHour: number;
  hours: number;
  amount: number;
  noCharge: boolean;
}

const mockFeeEntries: FeeEntry[] = [
  {
    id: "1",
    date: "05/05/2025",
    services:
      "Nam libero tempore, cum soluta nobis est eligendi optio cumque. 1",
    attorney: "ATT3",
    activityCode: "A106",
    taskCode: "L140",
    eventCode: "7988125540",
    ratePerHour: 200.73,
    hours: 7.5,
    amount: 1505.48,
    noCharge: false,
  },
];

type TabKey =
  | "fees"
  | "expenses"
  | "notes"
  | "summary"
  | "attachments"
  | "matterMaintenance"
  | "clientMaintenance"
  | "general";

export default function PrebillDetail() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>("fees");
  const [showMore, setShowMore] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [activeCommentsTab, setActiveCommentsTab] = useState<
    "comments" | "activities"
  >("comments");
  const [comment, setComment] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FeeEntry | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteEntry, setNoteEntry] = useState<FeeEntry | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle edit entry
  const handleEditEntry = (entry: FeeEntry) => {
    setEditingEntry({ ...entry });
    setIsEditModalOpen(true);
  };

  // Handle save edited entry
  const handleSaveEdit = () => {
    if (editingEntry) {
      // Here you would typically update the entry in your data source
      console.log("Saving edited entry:", editingEntry);
      setIsEditModalOpen(false);
      setEditingEntry(null);
    }
  };

  // Handle close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingEntry(null);
  };

  // Handle add note
  const handleAddNote = (entry: FeeEntry) => {
    setNoteEntry(entry);
    setNoteContent("");
    setIsNoteModalOpen(true);
  };

  // Handle save note
  const handleSaveNote = () => {
    if (noteEntry && noteContent.trim()) {
      // Here you would typically save the note to your data source
      console.log("Saving note for entry:", noteEntry.id, "Note:", noteContent);
      setIsNoteModalOpen(false);
      setNoteEntry(null);
      setNoteContent("");
    }
  };

  // Handle close note modal
  const handleCloseNoteModal = () => {
    setIsNoteModalOpen(false);
    setNoteEntry(null);
    setNoteContent("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMoreActionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Find the invoice from mock data
  const invoice = invoicesMockData.find(
    (inv) => inv.invoiceId.toString() === invoiceId,
  );

  if (!invoice) {
    return (
      <div className="p-6">
        <p className="text-red-600">Invoice not found</p>
      </div>
    );
  }

  const tabs = [
    { key: "fees" as TabKey, label: "Fees" },
    { key: "expenses" as TabKey, label: "Expenses" },
    { key: "notes" as TabKey, label: "Notes" },
    { key: "summary" as TabKey, label: "Summary" },
    { key: "attachments" as TabKey, label: "Attachments" },
    { key: "matterMaintenance" as TabKey, label: "Matter Maintenance" },
    { key: "clientMaintenance" as TabKey, label: "Client Maintenance" },
    { key: "general" as TabKey, label: "General" },
  ];

  const statusVariant = (status: string) => {
    switch (status) {
      case "New":
        return "primary";
      case "Posted":
        return "primary";
      case "Paid":
        return "secondary";
      case "Collaboration Edits":
        return "warning";
      case "Review Complete":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Page Title */}
      <div className="mb-6 bg">
        <h1 className="text-2xl font-bold text-xtnd-dark dark:text-xtnd-white">
          Prebilling Reports
        </h1>
      </div>

      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Bill Number */}
            <div className="min-h-12 flex items-center gap-2 px-4 py-2 rounded-lg bg-xtnd-light/60 dark:bg-xtnd-dark-700 border border-xtnd-light dark:border-xtnd-dark-600">
              <span className="text-xs font-medium uppercase tracking-wide text-xtnd-dark-400">
                Bill Num:
              </span>
              <span className="text-sm font-bold text-xtnd-dark dark:text-xtnd-white">
                #{invoice.billNum}
              </span>
            </div>

            {/* Bill Code */}
            <div className="min-h-12 flex items-center gap-2 px-4 py-2 rounded-lg bg-xtnd-light/60 dark:bg-xtnd-dark-700 border border-xtnd-light dark:border-xtnd-dark-600">
              <span className="text-xs font-medium uppercase tracking-wide text-xtnd-dark-400">
                Bill Code:
              </span>
              <span className="text-sm font-bold text-xtnd-dark dark:text-xtnd-white">
                {invoice.billCode}
              </span>
            </div>

            {/* Status */}
            <div className="min-h-12 flex items-center gap-2 px-4 py-2 rounded-lg bg-xtnd-white dark:bg-xtnd-dark-800 border border-xtnd-light dark:border-xtnd-dark-600">
              <span className="text-xs font-medium uppercase tracking-wide text-xtnd-dark-400">
                Status:
              </span>
              <Badge
                variant={statusVariant(invoice.status)}
                className="px-3 py-1 text-xs font-bold"
              >
                {invoice.status}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              className="!px-4"
              title="Add Fee"
            >
              <HiPlusCircle className="h-4 w-4 mr-2" />
              Add Fee
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="!px-4"
              title="Submit"
            >
              <HiPaperAirplane className="h-4 w-4 mr-2" />
              Submit
            </Button>

            {/* More Actions Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="primary"
                size="sm"
                className="!p-2"
                onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
                title="More Actions"
              >
                <HiDotsVertical className="h-5 w-5 text-xtnd-white" />
              </Button>

              {isMoreActionsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      // Handle Link action
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-xtnd-dark hover:bg-xtnd-light transition-colors flex items-center gap-2"
                  >
                    <HiLink className="h-4 w-4 text-xtnd-blue" />
                    Link
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      // Handle Move Status action
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-xtnd-dark hover:bg-xtnd-light transition-colors flex items-center gap-2"
                  >
                    <AiOutlineSwap className="h-4 w-4 text-xtnd-blue" />
                    Move Status
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      // Handle Sync action
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-xtnd-dark hover:bg-xtnd-light transition-colors flex items-center gap-2"
                  >
                    <HiSync className="h-4 w-4 text-xtnd-blue" />
                    Sync
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      // Handle Refresh action
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-xtnd-dark hover:bg-xtnd-light transition-colors flex items-center gap-2"
                  >
                    <HiClock className="h-4 w-4 text-xtnd-blue" />
                    Refresh
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.key
                  ? "border-xtnd-blue text-xtnd-blue"
                  : "border-transparent text-xtnd-dark-500 hover:text-xtnd-dark hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "fees" && (
        <div className="space-y-6">
          {/* Matter Information Card */}
          <Card variant="outlined" padding="lg">
            <CardBody>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-xtnd-dark-500 mb-1">
                    Matter:
                  </label>
                  <p className="text-sm text-xtnd-dark">
                    {invoice.matter.displayNumber} - {invoice.matter.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-xtnd-dark-500 mb-1">
                    Billing Address:
                  </label>
                  <p className="text-sm text-xtnd-dark">
                    {invoice.matter.billAttorney.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-xtnd-dark-500 mb-1">
                    Client Deductible:
                  </label>
                  <p className="text-sm text-xtnd-dark">$0.00</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-xtnd-dark-500 mb-1">
                    Matter Trust Bal:
                  </label>
                  <p className="text-sm text-xtnd-dark">$0.00</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-xtnd-dark-500 mb-1">
                    Main Rate Agreement:
                  </label>
                  <p className="text-sm text-xtnd-dark">-</p>
                </div>
              </div>

              {/* See More Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="flex items-center gap-2 text-sm text-xtnd-blue transition-colors"
                >
                  <span>See More</span>
                  {showMore ? (
                    <HiChevronDown className="h-4 w-4" />
                  ) : (
                    <HiChevronRight className="h-4 w-4" />
                  )}
                </button>
                {showMore && (
                  <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <label className="block text-sm font-medium text-xtnd-dark-500 mb-1">
                        Client:
                      </label>
                      <p className="text-sm text-xtnd-dark">
                        {invoice.matter.client.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-xtnd-dark-500 mb-1">
                        Billing Method:
                      </label>
                      <p className="text-sm text-xtnd-dark capitalize">
                        {invoice.matter.metadata.billingMethod}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Billable Time Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-6">
                <h3 className="text-base font-semibold text-xtnd-dark">
                  Billable Time (1)
                </h3>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-xtnd-dark-500">
                    Pending Time Entry Edits:
                  </span>
                  <span className="text-sm font-medium px-2 py-0.5 bg-xtnd-blue text-white rounded">
                    0/1
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-xtnd-dark-500">
                    Pending Billing Edits:
                  </span>
                  <span className="text-sm font-medium px-2 py-0.5 bg-xtnd-blue text-white rounded">
                    0/1
                  </span>
                </div>
              </div>

              {/* Search Box */}
              <div className="relative w-64">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent"
                />
              </div>
            </div>

            {/* Fee Entries Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-xtnd-light border-b-2 border-xtnd-blue">
                    <tr>
                      <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                        <div className="h-12 flex items-center">Date</div>
                      </th>
                      <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                        <div className="h-12 flex items-center">Services</div>
                      </th>
                      <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                        <div className="h-12 flex items-center">Attorney</div>
                      </th>
                      <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                        <div className="h-12 flex items-center">
                          Activity Code
                        </div>
                      </th>
                      <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                        <div className="h-12 flex items-center">Task Code</div>
                      </th>
                      <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                        <div className="h-12 flex items-center">Event Code</div>
                      </th>
                      <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                        <div className="h-12 flex items-center">Rate/Hr.</div>
                      </th>
                      <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                        <div className="h-12 flex items-center">Hours</div>
                      </th>
                      <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                        <div className="h-12 flex items-center">Amount</div>
                      </th>
                      <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                        <div className="h-12 flex items-center">No Charge</div>
                      </th>
                      <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                        <div className="h-12 flex items-center">Actions</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockFeeEntries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-sm text-xtnd-dark">
                          {entry.date}
                        </td>
                        <td className="py-3 px-4 text-sm text-xtnd-dark max-w-xs">
                          <div className="line-clamp-2">{entry.services}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-xtnd-dark">
                          {entry.attorney}
                        </td>
                        <td className="py-3 px-4 text-sm text-xtnd-dark">
                          {entry.activityCode}
                        </td>
                        <td className="py-3 px-4 text-sm text-xtnd-dark">
                          {entry.taskCode}
                        </td>
                        <td className="py-3 px-4 text-sm text-xtnd-dark">
                          {entry.eventCode}
                        </td>
                        <td className="py-3 px-4 text-sm text-xtnd-dark">
                          {entry.ratePerHour.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm text-xtnd-dark">
                          {entry.hours}
                        </td>
                        <td className="py-3 px-4 text-sm text-xtnd-dark font-medium">
                          {entry.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={entry.noCharge}
                            readOnly
                            className="h-4 w-4 text-xtnd-blue rounded border-gray-300 focus:ring-xtnd-blue"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditEntry(entry)}
                              className="text-xtnd-blue hover:text-xtnd-dark transition-colors"
                              title="Edit"
                            >
                              <HiPencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleAddNote(entry)}
                              className="text-xtnd-blue hover:text-xtnd-dark transition-colors"
                              title="Add Note"
                            >
                              <HiChatAlt className="h-4 w-4" />
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete"
                            >
                              <HiTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs - placeholder content */}
      {activeTab !== "fees" && (
        <div className="py-12 text-center">
          <p className="text-xtnd-dark-500">
            {tabs.find((t) => t.key === activeTab)?.label} content coming soon
          </p>
        </div>
      )}

      {/* Collapsible Comments & Activities Section */}
      <div className="mt-6 border-t border-gray-200">
        <button
          onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
          className="w-full flex items-center justify-between py-4 px-2 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-xtnd-blue italic">
              Comments & Activities
            </span>
            <span className="text-xs text-gray-500 italic">
              (2 comments, 5 events)
            </span>
          </div>
          {isCommentsExpanded ? (
            <HiChevronDown className="h-5 w-5 text-xtnd-dark-500" />
          ) : (
            <HiChevronRight className="h-5 w-5 text-xtnd-dark-500" />
          )}
        </button>

        {isCommentsExpanded && (
          <div className="pb-6 px-2">
            {/* Tabs for Comments and Activities */}
            <div className="mb-4 border-b border-gray-200">
              <button
                onClick={() => setActiveCommentsTab("comments")}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeCommentsTab === "comments"
                    ? "text-xtnd-blue border-b-2 border-xtnd-blue"
                    : "text-xtnd-dark-500 hover:text-xtnd-dark"
                }`}
              >
                Comments
              </button>
              <button
                onClick={() => setActiveCommentsTab("activities")}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeCommentsTab === "activities"
                    ? "text-xtnd-blue border-b-2 border-xtnd-blue"
                    : "text-xtnd-dark-500 hover:text-xtnd-dark"
                }`}
              >
                Activities
              </button>
            </div>

            {/* Comments Tab Content */}
            {activeCommentsTab === "comments" && (
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-semibold">
                    AS
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-xtnd-dark">
                      Alan Shore
                    </span>
                  </div>
                  <textarea
                    placeholder="Write a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent resize-none"
                    rows={4}
                  />
                  <div className="mt-3">
                    <Button variant="primary" size="sm">
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Activities Tab Content */}
            {activeCommentsTab === "activities" && (
              <div className="py-6 text-center">
                <p className="text-sm text-xtnd-dark-500">
                  No activities recorded yet
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Fee Entry Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Edit Fee Entry"
        size="xl"
      >
        {editingEntry && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-xtnd-dark mb-2">
                  Date:
                </label>
                <input
                  type="text"
                  value={editingEntry.date}
                  onChange={(e) =>
                    setEditingEntry({ ...editingEntry, date: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent"
                />
              </div>

              {/* Attorney */}
              <div>
                <label className="block text-sm font-medium text-xtnd-dark mb-2">
                  Attorney:
                </label>
                <input
                  type="text"
                  value={editingEntry.attorney}
                  onChange={(e) =>
                    setEditingEntry({
                      ...editingEntry,
                      attorney: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent"
                />
              </div>

              {/* Activity Code */}
              <div>
                <label className="block text-sm font-medium text-xtnd-dark mb-2">
                  Activity Code:
                </label>
                <input
                  type="text"
                  value={editingEntry.activityCode}
                  onChange={(e) =>
                    setEditingEntry({
                      ...editingEntry,
                      activityCode: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent"
                />
              </div>

              {/* Task Code */}
              <div>
                <label className="block text-sm font-medium text-xtnd-dark mb-2">
                  Task Code:
                </label>
                <input
                  type="text"
                  value={editingEntry.taskCode}
                  onChange={(e) =>
                    setEditingEntry({
                      ...editingEntry,
                      taskCode: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent"
                />
              </div>

              {/* Event Code */}
              <div>
                <label className="block text-sm font-medium text-xtnd-dark mb-2">
                  Event Code:
                </label>
                <input
                  type="text"
                  value={editingEntry.eventCode}
                  readOnly
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Rate Per Hour */}
              <div>
                <label className="block text-sm font-medium text-xtnd-dark mb-2">
                  Rate/Hour:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingEntry.ratePerHour}
                  onChange={(e) =>
                    setEditingEntry({
                      ...editingEntry,
                      ratePerHour: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent"
                />
              </div>

              {/* Hours */}
              <div>
                <label className="block text-sm font-medium text-xtnd-dark mb-2">
                  Hours:
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={editingEntry.hours}
                  onChange={(e) =>
                    setEditingEntry({
                      ...editingEntry,
                      hours: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-xtnd-dark mb-2">
                  Amount:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingEntry.amount}
                  readOnly
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium text-xtnd-dark mb-2">
                Services:
              </label>
              <textarea
                value={editingEntry.services}
                onChange={(e) =>
                  setEditingEntry({
                    ...editingEntry,
                    services: e.target.value,
                  })
                }
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent resize-none"
              />
            </div>

            {/* No Charge */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="noCharge"
                checked={editingEntry.noCharge}
                onChange={(e) =>
                  setEditingEntry({
                    ...editingEntry,
                    noCharge: e.target.checked,
                  })
                }
                className="h-4 w-4 text-xtnd-blue rounded border-gray-300 focus:ring-xtnd-blue"
              />
              <label
                htmlFor="noCharge"
                className="text-sm font-medium text-xtnd-dark"
              >
                No Charge
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="ghost" onClick={handleCloseEditModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={handleCloseNoteModal}
        title="Add Note"
        size="md"
      >
        {noteEntry && (
          <div className="space-y-4">
            {/* Entry Information */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Date:</span>
                  <span className="ml-2 font-medium text-xtnd-dark">
                    {noteEntry.date}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Attorney:</span>
                  <span className="ml-2 font-medium text-xtnd-dark">
                    {noteEntry.attorney}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Services:</span>
                  <p className="mt-1 text-xtnd-dark line-clamp-2">
                    {noteEntry.services}
                  </p>
                </div>
              </div>
            </div>

            {/* Note Content */}
            <div>
              <label className="block text-sm font-medium text-xtnd-dark mb-2">
                Note:
              </label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Enter your note here..."
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="ghost" onClick={handleCloseNoteModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveNote}
                disabled={!noteContent.trim()}
              >
                Save Note
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
