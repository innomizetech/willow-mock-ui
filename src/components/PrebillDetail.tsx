import React, { useState, useRef, useEffect, act } from "react";
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
  HiCurrencyDollar,
  HiDocumentText,
  HiCalendar,
  HiUsers,
  HiCloudUpload,
  HiPhotograph,
  HiDownload,
  HiEye,
  HiViewGrid,
  HiViewList,
} from "react-icons/hi";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { AiOutlineSwap } from "react-icons/ai";

import { invoicesMockData } from "../mock-data";
import DatePicker from "./DatePicker";
import Select from "./Select";

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

// Mock comment data
interface Comment {
  id: string;
  author: string;
  authorInitials: string;
  avatarColor: string;
  content: string;
  date: string;
  time: string;
}

// Mock activity data
interface Activity {
  id: string;
  type: "status_change" | "edit" | "comment" | "attachment" | "assignment";
  description: string;
  user: string;
  userInitials: string;
  date: string;
  time: string;
  details?: string;
}

const mockComments: Comment[] = [
  {
    id: "1",
    author: "Jane Smith",
    authorInitials: "JS",
    avatarColor: "bg-blue-500",
    content:
      "Please review the fee entries for accuracy before finalizing. Some hours seem higher than usual for this type of work.",
    date: "01/25/2026",
    time: "2:30 PM",
  },
  {
    id: "2",
    author: "John Doe",
    authorInitials: "JD",
    avatarColor: "bg-green-500",
    content:
      "I've verified the hours with the timekeeper. All entries are correct and match the project scope.",
    date: "01/26/2026",
    time: "9:15 AM",
  },
];

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "status_change",
    description: "Status changed from Draft to Under Review",
    user: "Alan Shore",
    userInitials: "AS",
    date: "01/27/2026",
    time: "10:00 AM",
  },
  {
    id: "2",
    type: "edit",
    description: "Fee entry modified",
    user: "Jane Smith",
    userInitials: "JS",
    date: "01/26/2026",
    time: "3:45 PM",
    details: "Updated hours from 6.0 to 7.5 for entry #1",
  },
  {
    id: "3",
    type: "attachment",
    description: "Attachment added",
    user: "Alan Shore",
    userInitials: "AS",
    date: "01/26/2026",
    time: "11:30 AM",
    details: "IMG_8406.JPG",
  },
  {
    id: "4",
    type: "comment",
    description: "Comment added",
    user: "John Doe",
    userInitials: "JD",
    date: "01/26/2026",
    time: "9:15 AM",
  },
  {
    id: "5",
    type: "assignment",
    description: "Assigned to billing team",
    user: "System",
    userInitials: "SY",
    date: "01/25/2026",
    time: "8:00 AM",
    details: "Assigned to Jane Smith for review",
  },
];

// Expense attachment interface
interface ExpenseAttachment {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

// Expense entry interface (matches ExpenseDetailPanel)
interface ExpenseEntry {
  id: string;
  date: string;
  description: string;
  type: string;
  originalAmount: number;
  adjustedAmount?: number;
  noCharge: boolean;
  status: "Normal" | "No Charge" | "Edited";
  attachments: ExpenseAttachment[];
  createdBy: string;
  createdAt: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

const mockExpenseEntries: ExpenseEntry[] = [
  {
    id: "1",
    date: "05/02/2025",
    description: "Court filing fees for motion to dismiss",
    type: "Filing Fees",
    originalAmount: 150.0,
    noCharge: false,
    status: "Normal",
    attachments: [
      {
        id: "att-1",
        name: "filing_receipt.pdf",
        size: "245 KB",
        uploadedAt: "05/02/2025",
      },
    ],
    createdBy: "Alan Shore",
    createdAt: "05/02/2025 09:30 AM",
  },
  {
    id: "2",
    date: "05/03/2025",
    description: "Document copying and printing services",
    type: "Copies/Printing",
    originalAmount: 37.5,
    noCharge: false,
    status: "Normal",
    attachments: [],
    createdBy: "Jane Smith",
    createdAt: "05/03/2025 02:15 PM",
  },
  {
    id: "3",
    date: "05/04/2025",
    description: "Expert witness consultation fee - Dr. James Wilson",
    type: "Expert Fees",
    originalAmount: 500.0,
    adjustedAmount: 450.0,
    noCharge: false,
    status: "Edited",
    attachments: [
      {
        id: "att-2",
        name: "expert_invoice.pdf",
        size: "1.2 MB",
        uploadedAt: "05/04/2025",
      },
    ],
    createdBy: "Alan Shore",
    createdAt: "05/04/2025 11:00 AM",
    lastModifiedBy: "Jane Smith",
    lastModifiedAt: "05/05/2025 03:30 PM",
  },
  {
    id: "4",
    date: "05/05/2025",
    description: "Travel expenses - client meeting downtown",
    type: "Travel",
    originalAmount: 45.34,
    noCharge: true,
    status: "No Charge",
    attachments: [],
    createdBy: "Alan Shore",
    createdAt: "05/05/2025 06:00 PM",
  },
  {
    id: "5",
    date: "05/05/2025",
    description: "Overnight delivery of legal documents to opposing counsel",
    type: "Delivery/Courier",
    originalAmount: 68.0,
    noCharge: false,
    status: "Normal",
    attachments: [
      {
        id: "att-3",
        name: "fedex_tracking.pdf",
        size: "156 KB",
        uploadedAt: "05/05/2025",
      },
    ],
    createdBy: "Jane Smith",
    createdAt: "05/05/2025 04:45 PM",
  },
];

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
  const [isAddFeeModalOpen, setIsAddFeeModalOpen] = useState(false);
  const [newFee, setNewFee] = useState({
    date: new Date().toISOString().slice(0, 10),
    services: "",
    attorney: "",
    activityCode: "",
    taskCode: "",
    eventCode: "",
    hours: 0,
    ratePerHour: 0,
    amount: 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Attachments tab state
  const [attachmentSearch, setAttachmentSearch] = useState("");
  const [attachmentViewMode, setAttachmentViewMode] = useState<"list" | "grid">(
    "list",
  );

  // Expenses tab state
  const [expenseSearchText, setExpenseSearchText] = useState("");
  const [selectedExpense, setSelectedExpense] = useState<ExpenseEntry | null>(
    null,
  );
  const [isExpenseDetailOpen, setIsExpenseDetailOpen] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(mockExpenseEntries);
  const [isExpenseAttachmentsModalOpen, setIsExpenseAttachmentsModalOpen] =
    useState(false);
  const [isEditExpenseDescModalOpen, setIsEditExpenseDescModalOpen] =
    useState(false);
  const [editingExpenseDesc, setEditingExpenseDesc] = useState("");

  // Mock attachment data
  const mockAttachments = [
    {
      id: "1",
      name: "IMG_8406.JPG",
      type: "image",
      uploadedBy: "Alan Shore",
      uploadedByInitials: "AS",
      date: "01/27/2026",
      size: "582.0 KB",
    },
    {
      id: "2",
      name: "SIMPLE - NOI DUNG KHOA B1 2.pdf",
      type: "pdf",
      uploadedBy: "Alan Shore",
      uploadedByInitials: "AS",
      date: "01/27/2026",
      size: "134.5 KB",
    },
  ];

  // Filter attachments based on search
  const filteredAttachments = mockAttachments.filter((attachment) =>
    attachment.name.toLowerCase().includes(attachmentSearch.toLowerCase()),
  );

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

  // Handle open add fee modal
  const handleOpenAddFeeModal = () => {
    setNewFee({
      date: new Date().toISOString().slice(0, 10),
      services: "",
      attorney: "",
      activityCode: "",
      taskCode: "",
      eventCode: "",
      hours: 0,
      ratePerHour: 0,
      amount: 0,
    });
    setIsAddFeeModalOpen(true);
  };

  // Handle close add fee modal
  const handleCloseAddFeeModal = () => {
    setIsAddFeeModalOpen(false);
  };

  // Handle save new fee
  const handleSaveNewFee = () => {
    // Here you would typically save the new fee to your data source
    console.log("Saving new fee:", newFee);
    setIsAddFeeModalOpen(false);
  };

  // Parse date string to Date object for DatePicker
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  // Handle date change from DatePicker
  const handleDateChange = (date: Date | null) => {
    setNewFee({
      ...newFee,
      date: date ? date.toDateString().slice(0, 10) : "",
    });
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
              onClick={handleOpenAddFeeModal}
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
          <Card variant="elevated" padding="lg">
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

      {/* Expenses Tab */}
      {activeTab === "expenses" && (
        <div className="space-y-6">
          {/* Matter Information Card */}
          <Card variant="elevated" padding="lg">
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
                    Total Expenses:
                  </label>
                  <p className="text-sm text-xtnd-dark font-medium">
                    $
                    {expenses
                      .reduce(
                        (sum, e) =>
                          sum + (e.adjustedAmount ?? e.originalAmount),
                        0,
                      )
                      .toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-xtnd-dark-500 mb-1">
                    Billable Expenses:
                  </label>
                  <p className="text-sm text-xtnd-dark font-medium">
                    $
                    {expenses
                      .filter((e) => !e.noCharge)
                      .reduce(
                        (sum, e) =>
                          sum + (e.adjustedAmount ?? e.originalAmount),
                        0,
                      )
                      .toFixed(2)}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Search and Actions */}
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-4">
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={expenseSearchText}
                  onChange={(e) => setExpenseSearchText(e.target.value)}
                  className="pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent"
                />
              </div>
            </div>

            {/* Expense Entries Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-xtnd-light border-b-2 border-xtnd-blue">
                    <tr>
                      <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                        <div className="h-12 flex items-center">Date</div>
                      </th>
                      <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                        <div className="h-12 flex items-center">Expenses</div>
                      </th>

                      <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                        <div className="h-12 flex items-center">Amount</div>
                      </th>

                      <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                        <div className="h-12 flex items-center">
                          Attachments
                        </div>
                      </th>
                      <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                        <div className="h-12 flex items-center">Actions</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses
                      .filter(
                        (expense) =>
                          expense.description
                            .toLowerCase()
                            .includes(expenseSearchText.toLowerCase()) ||
                          expense.type
                            .toLowerCase()
                            .includes(expenseSearchText.toLowerCase()),
                      )
                      .map((expense) => (
                        <tr
                          key={expense.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                          onClick={() => {
                            setSelectedExpense(expense);
                            setIsExpenseDetailOpen(true);
                          }}
                        >
                          <td className="py-3 px-4 text-sm text-xtnd-dark">
                            {expense.date}
                          </td>
                          <td className="py-3 px-4 text-sm text-xtnd-dark max-w-xs">
                            <div className="line-clamp-2">
                              {expense.description}
                            </div>
                          </td>

                          <td className="py-3 px-4 text-sm text-xtnd-dark font-medium">
                            <div>
                              $
                              {(
                                expense.adjustedAmount ?? expense.originalAmount
                              ).toFixed(2)}
                              {expense.adjustedAmount &&
                                expense.adjustedAmount !==
                                  expense.originalAmount && (
                                  <span className="text-xs text-gray-400 line-through ml-2">
                                    ${expense.originalAmount.toFixed(2)}
                                  </span>
                                )}
                            </div>
                          </td>

                          <td className="py-3 px-4 text-sm text-xtnd-dark">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedExpense(expense);
                                setIsExpenseAttachmentsModalOpen(true);
                              }}
                              className="flex items-center gap-1 text-xtnd-blue hover:text-xtnd-dark transition-colors"
                              title="View/Upload Attachments"
                            >
                              <HiLink className="h-4 w-4" />
                              {expense.attachments.length > 0 ? (
                                <span>{expense.attachments.length}</span>
                              ) : (
                                <span className="text-gray-400">0</span>
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedExpense(expense);
                                  setEditingExpenseDesc(expense.description);
                                  setIsEditExpenseDescModalOpen(true);
                                }}
                                className="text-xtnd-blue hover:text-xtnd-dark transition-colors"
                                title="Edit Description"
                              >
                                <HiPencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => e.stopPropagation()}
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

              {/* Table Footer with Totals */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="flex justify-end gap-8">
                  <div className="text-sm">
                    <span className="text-gray-500">Billable Total:</span>{" "}
                    <span className="font-semibold text-xtnd-dark">
                      $
                      {expenses
                        .filter((e) => !e.noCharge)
                        .reduce(
                          (sum, e) =>
                            sum + (e.adjustedAmount ?? e.originalAmount),
                          0,
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense Attachments Modal */}
      <Modal
        isOpen={isExpenseAttachmentsModalOpen}
        onClose={() => {
          setIsExpenseAttachmentsModalOpen(false);
          setSelectedExpense(null);
        }}
        title="Expense Attachments"
        size="lg"
      >
        {selectedExpense && (
          <div className="space-y-4">
            {/* Expense Info */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-xtnd-dark">
                  {selectedExpense.type}
                </span>{" "}
                - {selectedExpense.description}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                $
                {(
                  selectedExpense.adjustedAmount ??
                  selectedExpense.originalAmount
                ).toFixed(2)}{" "}
                • {selectedExpense.date}
              </p>
            </div>

            {/* Uploaded Files List */}
            <div>
              <h4 className="text-sm font-medium text-xtnd-dark mb-3">
                Uploaded Files ({selectedExpense.attachments.length})
              </h4>
              {selectedExpense.attachments.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <HiCloudUpload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No files uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedExpense.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-xtnd-blue/10 rounded-lg flex items-center justify-center">
                          <HiDocumentText className="h-5 w-5 text-xtnd-blue" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-xtnd-dark">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {attachment.size} • Uploaded {attachment.uploadedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="text-xtnd-blue hover:text-xtnd-dark transition-colors p-1"
                          title="View"
                        >
                          <HiEye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-xtnd-blue hover:text-xtnd-dark transition-colors p-1"
                          title="Download"
                        >
                          <HiDownload className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            const updatedExpense = {
                              ...selectedExpense,
                              attachments: selectedExpense.attachments.filter(
                                (a) => a.id !== attachment.id,
                              ),
                            };
                            setSelectedExpense(updatedExpense);
                            setExpenses(
                              expenses.map((e) =>
                                e.id === updatedExpense.id ? updatedExpense : e,
                              ),
                            );
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="Delete"
                        >
                          <HiTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Section */}
            <div className="border-t border-gray-200 pt-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-xtnd-blue transition-colors cursor-pointer">
                <HiCloudUpload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  PDF, JPG, PNG up to 10MB
                </p>
                <input
                  type="file"
                  className="hidden"
                  id="expense-file-upload"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const newAttachments = Array.from(files).map(
                        (file, index) => ({
                          id: `att-new-${Date.now()}-${index}`,
                          name: file.name,
                          size: `${(file.size / 1024).toFixed(1)} KB`,
                          uploadedAt: new Date().toLocaleDateString(),
                        }),
                      );
                      const updatedExpense = {
                        ...selectedExpense,
                        attachments: [
                          ...selectedExpense.attachments,
                          ...newAttachments,
                        ],
                      };
                      setSelectedExpense(updatedExpense);
                      setExpenses(
                        expenses.map((exp) =>
                          exp.id === updatedExpense.id ? updatedExpense : exp,
                        ),
                      );
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() =>
                    document.getElementById("expense-file-upload")?.click()
                  }
                >
                  <HiCloudUpload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="primary"
                onClick={() => {
                  setIsExpenseAttachmentsModalOpen(false);
                  setSelectedExpense(null);
                }}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Expense Description Modal */}
      <Modal
        isOpen={isEditExpenseDescModalOpen}
        onClose={() => {
          setIsEditExpenseDescModalOpen(false);
          setSelectedExpense(null);
          setEditingExpenseDesc("");
        }}
        title="Edit Expense Description"
        size="md"
      >
        {selectedExpense && (
          <div className="space-y-4">
            {/* Expense Info */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-xtnd-dark">
                    {selectedExpense.type}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedExpense.date} • $
                    {(
                      selectedExpense.adjustedAmount ??
                      selectedExpense.originalAmount
                    ).toFixed(2)}
                  </p>
                </div>
                <Badge
                  variant={
                    selectedExpense.status === "No Charge"
                      ? "warning"
                      : selectedExpense.status === "Edited"
                        ? "default"
                        : "success"
                  }
                  size="sm"
                >
                  {selectedExpense.status}
                </Badge>
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-xtnd-dark mb-2">
                Expenses
              </label>
              <textarea
                value={editingExpenseDesc}
                onChange={(e) => setEditingExpenseDesc(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent resize-none"
                placeholder="Enter expense description..."
              />
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditExpenseDescModalOpen(false);
                  setSelectedExpense(null);
                  setEditingExpenseDesc("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (selectedExpense) {
                    const updatedExpense = {
                      ...selectedExpense,
                      description: editingExpenseDesc,
                      status: "Edited" as const,
                      lastModifiedBy: "Alan Shore",
                      lastModifiedAt: new Date().toLocaleString(),
                    };
                    setExpenses(
                      expenses.map((e) =>
                        e.id === updatedExpense.id ? updatedExpense : e,
                      ),
                    );
                    setIsEditExpenseDescModalOpen(false);
                    setSelectedExpense(null);
                    setEditingExpenseDesc("");
                  }
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Summary Tab */}
      {activeTab === "summary" && (
        <div className="space-y-6">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Invoice Amount */}
            <Card variant="filled">
              <CardBody className="p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-xtnd-dark rounded-lg mb-4">
                  <HiCurrencyDollar className="h-6 w-6 text-xtnd-light" />
                </div>
                <p className="text-sm font-medium text-xtnd-dark mb-1">
                  Total Invoice Amount
                </p>
                <p className="text-3xl font-bold mb-2">
                  ${(1505.48 + 400.84).toFixed(2)}
                </p>
                <p className="text-xs text-xtnd-dark">
                  Includes Fees + Expenses
                </p>
              </CardBody>
            </Card>

            {/* Total Billable Time */}
            <Card className="border-gray-200">
              <CardBody className="p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-xtnd-light rounded-lg mb-4">
                  <HiClock className="h-6 w-6 text-xtnd-blue" />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Billable Time
                </p>
                <p className="text-3xl font-bold text-xtnd-dark mb-2">
                  7.50 Hours
                </p>
                <p className="text-xs text-gray-500">Amount: $1,505.48</p>
              </CardBody>
            </Card>

            {/* Previous Balance */}
            <Card className="border-gray-200">
              <CardBody className="p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                  <RxCounterClockwiseClock className="h-6 w-6 text-orange-500" />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Previous Balance
                </p>
                <p className="text-3xl font-bold text-xtnd-dark mb-2">
                  $2,568.78
                </p>
                <p className="text-xs text-gray-500">Last Paid: 01/21/2026</p>
              </CardBody>
            </Card>
          </div>

          {/* Invoice Summary and History Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Invoice Summary */}
            <Card className="border-gray-200">
              <CardBody className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <HiDocumentText className="h-5 w-5 text-xtnd-blue" />
                  <h3 className="text-lg font-semibold text-xtnd-dark">
                    Invoice Summary
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b-2 border-gray-200">
                      <tr>
                        <th className="text-left text-xs font-semibold text-gray-600 uppercase pb-3">
                          Description
                        </th>
                        <th className="text-right text-xs font-semibold text-gray-600 uppercase pb-3 px-4">
                          Hours
                        </th>
                        <th className="text-right text-xs font-semibold text-gray-600 uppercase pb-3">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-xtnd-dark">Billable Time</td>
                        <td className="py-3 text-right text-xtnd-dark px-4">
                          7.50
                        </td>
                        <td className="py-3 text-right text-xtnd-dark">
                          $1,505.48
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-xtnd-dark">
                          Non-billable Time
                        </td>
                        <td className="py-3 text-right text-xtnd-dark px-4">
                          0.00
                        </td>
                        <td className="py-3 text-right text-xtnd-dark">
                          $0.00
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-xtnd-dark">Suppressed Time</td>
                        <td className="py-3 text-right text-xtnd-dark px-4">
                          0.00
                        </td>
                        <td className="py-3 text-right text-xtnd-dark">
                          $0.00
                        </td>
                      </tr>
                      <tr className="border-b-2 border-gray-200">
                        <td className="py-3 font-semibold text-xtnd-dark">
                          Expenses
                        </td>
                        <td className="py-3 text-right text-xtnd-dark px-4">
                          —
                        </td>
                        <td className="py-3 text-right font-semibold text-xtnd-dark">
                          $400.84
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>

            {/* Invoice History To Date */}
            <Card className="border-gray-200">
              <CardBody className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <HiCalendar className="h-5 w-5 text-xtnd-blue" />
                  <h3 className="text-lg font-semibold text-xtnd-dark">
                    Invoice History To Date
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      Total Invoiced:
                    </span>
                    <span className="text-sm font-semibold text-xtnd-blue">
                      $2,168.33
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Expenses:</span>
                    <span className="text-sm font-semibold text-xtnd-blue">
                      $400.45
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      Total Written Off:
                    </span>
                    <span className="text-sm font-semibold text-xtnd-blue">
                      $0.00
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b-2 border-gray-200">
                    <span className="text-sm text-gray-600">Total A/R:</span>
                    <span className="text-sm font-semibold text-xtnd-blue">
                      $0.00
                    </span>
                  </div>
                </div>

                {/* Previous Invoice Details */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-xtnd-dark mb-4">
                    Previous Invoice Details
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                        Last Billing
                      </span>
                      <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                        Amount
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-xtnd-dark">
                        01/01/2026
                      </span>
                      <span className="text-sm font-semibold text-xtnd-dark">
                        $2,568.78
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Billable Time by Attorney */}

          {/* A/R Aging Summary and Billable Time by Task Code Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* A/R Aging Summary */}
            <Card className="border-gray-200">
              <CardBody className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <HiUsers className="h-5 w-5 text-xtnd-blue" />
                  <h3 className="text-lg font-semibold text-xtnd-dark">
                    Billable Time by Attorney
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-xtnd-light border-b-2 border-xtnd-blue">
                      <tr>
                        <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                          <div className="h-12 flex items-center">Attorney</div>
                        </th>
                        <th className="text-left text-xs text-xtnd-dark font-semibold uppercase px-4">
                          <div className="h-12 flex items-center">Code</div>
                        </th>
                        <th className="text-right text-xs text-xtnd-dark font-semibold uppercase px-4">
                          <div className="h-12 flex items-center justify-end">
                            Avg Rate
                          </div>
                        </th>
                        <th className="text-right text-xs text-xtnd-dark font-semibold uppercase px-4">
                          <div className="h-12 flex items-center justify-end">
                            Hrs Billed
                          </div>
                        </th>
                        <th className="text-right text-xs text-xtnd-dark font-semibold uppercase px-4">
                          <div className="h-12 flex items-center justify-end">
                            Total
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-xtnd-dark">Alan Shore</td>
                        <td className="py-3 px-4 text-xtnd-dark">ASH</td>
                        <td className="py-3 px-4 text-right text-xtnd-dark">
                          $200.00
                        </td>
                        <td className="py-3 px-4 text-right text-xtnd-dark">
                          4.50
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-xtnd-dark">
                          $900.00
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-xtnd-dark">
                          Denny Crane
                        </td>
                        <td className="py-3 px-4 text-xtnd-dark">DCR</td>
                        <td className="py-3 px-4 text-right text-xtnd-dark">
                          $201.83
                        </td>
                        <td className="py-3 px-4 text-right text-xtnd-dark">
                          3.00
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-xtnd-dark">
                          $605.48
                        </td>
                      </tr>
                      <tr className="bg-gray-50 border-t-2 border-gray-200">
                        <td className="py-3 px-4 font-bold text-xtnd-dark">
                          Total
                        </td>
                        <td className="py-3 px-4"></td>
                        <td className="py-3 px-4"></td>
                        <td className="py-3 px-4 text-right font-bold text-xtnd-dark">
                          7.50
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-xtnd-blue">
                          $1,505.48
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
            <Card className="border-gray-200">
              <CardBody className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <HiClock className="h-5 w-5 text-xtnd-blue" />
                  <h3 className="text-lg font-semibold text-xtnd-dark">
                    A/R Aging Summary
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b-2 border-gray-200">
                      <tr>
                        <th className="text-left text-xs font-semibold text-gray-600 uppercase pb-3">
                          Period
                        </th>
                        <th className="text-right text-xs font-semibold text-gray-600 uppercase pb-3">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-xtnd-dark">Current</td>
                        <td className="py-3 text-right text-xtnd-dark">
                          $0.00
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-xtnd-dark">1-30 Days</td>
                        <td className="py-3 text-right text-xtnd-dark">
                          $0.00
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-xtnd-dark">31-60 Days</td>
                        <td className="py-3 text-right text-xtnd-dark">
                          $0.00
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-xtnd-dark">61-90 Days</td>
                        <td className="py-3 text-right text-xtnd-dark">
                          $0.00
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-xtnd-dark">Over 90 Days</td>
                        <td className="py-3 text-right text-xtnd-dark">
                          $0.00
                        </td>
                      </tr>
                      <tr className="border-t-2 border-gray-200 bg-gray-50">
                        <td className="py-3 font-semibold text-xtnd-dark">
                          Total A/R
                        </td>
                        <td className="py-3 text-right font-semibold text-xtnd-blue">
                          $0.00
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>

            {/* Billable Time Summary by Task Code */}
          </div>
          <Card className="border-gray-200">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <HiDocumentText className="h-5 w-5 text-xtnd-blue" />
                <h3 className="text-lg font-semibold text-xtnd-dark">
                  Billable Time Summary by Task Code
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-600 uppercase py-3 px-3">
                        Task Code
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-600 uppercase py-3 px-3">
                        Description
                      </th>
                      <th className="text-right text-xs font-semibold text-gray-600 uppercase py-3 px-3">
                        Hours Billed
                      </th>
                      <th className="text-right text-xs font-semibold text-gray-600 uppercase py-3 px-3">
                        Current Amount
                      </th>
                      <th className="text-right text-xs font-semibold text-gray-600 uppercase py-3 px-3">
                        Previous Amount
                      </th>
                      <th className="text-right text-xs font-semibold text-gray-600 uppercase py-3 px-3">
                        Budget
                      </th>
                      <th className="text-right text-xs font-semibold text-gray-600 uppercase py-3 px-3">
                        Difference
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 text-xtnd-blue font-medium">
                        L110
                      </td>
                      <td className="py-3 px-3 text-xtnd-dark">
                        Fact Investigation/Development
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 text-xtnd-blue font-medium">
                        L120
                      </td>
                      <td className="py-3 px-3 text-xtnd-dark">
                        Analysis/Strategy
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 text-xtnd-blue font-medium">
                        L130
                      </td>
                      <td className="py-3 px-3 text-xtnd-dark">
                        Experts/Consultants
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 text-xtnd-blue font-medium">
                        L140
                      </td>
                      <td className="py-3 px-3 text-xtnd-dark">
                        Document/File Management
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        7.50
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        1,505.48
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-red-600">
                        -1,505.48
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 text-xtnd-blue font-medium">
                        L150
                      </td>
                      <td className="py-3 px-3 text-xtnd-dark">Budgeting</td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 text-xtnd-blue font-medium">
                        L160
                      </td>
                      <td className="py-3 px-3 text-xtnd-dark">
                        Settlement/Non-Binding ADR
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 text-xtnd-blue font-medium">
                        L190
                      </td>
                      <td className="py-3 px-3 text-xtnd-dark">
                        Other Case Assessment, Development and Administration
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        361.76
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-red-600">
                        -361.76
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 text-xtnd-blue font-medium">
                        L210
                      </td>
                      <td className="py-3 px-3 text-xtnd-dark">Pleadings</td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 text-xtnd-blue font-medium">
                        L220
                      </td>
                      <td className="py-3 px-3 text-xtnd-dark">
                        Preliminary Injunctions/Provisional Remedies
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3 text-xtnd-blue font-medium">
                        L230
                      </td>
                      <td className="py-3 px-3 text-xtnd-dark">
                        Court Mandated Conferences
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                      <td className="py-3 px-3 text-right text-xtnd-dark">
                        0.00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === "notes" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Hold Specifications */}
          <Card className="border-gray-200">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-600 text-sm font-bold">!</span>
                </div>
                <h3 className="text-lg font-semibold text-xtnd-dark">
                  Hold Specifications
                </h3>
              </div>

              <div className="space-y-4">
                {/* Hold Type */}
                <div>
                  <Select
                    label="Hold Type"
                    options={[
                      { value: "client-request", label: "Client Request" },
                      { value: "billing-review", label: "Billing Review" },
                      { value: "dispute", label: "Dispute" },
                      { value: "collection", label: "Collection" },
                    ]}
                    placeholder="Select hold type"
                    onChange={() => {}}
                    fullWidth
                  />
                </div>

                {/* Reason for Holding */}
                <div>
                  <label className="block text-sm font-medium text-xtnd-dark mb-2">
                    Reason for Holding
                  </label>
                  <textarea
                    placeholder="Please enter detailed reason for holding this prebill..."
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent resize-none"
                  />
                </div>

                {/* Assigned Biller */}
                <div>
                  <div>
                    <Select
                      label=" Assigned Biller"
                      options={[
                        { value: "client-request", label: "John Doe" },
                        { value: "billing-review", label: "Jane Smith" },
                        { value: "dispute", label: "Alan Shore" },
                        { value: "collection", label: "Michael Scott" },
                      ]}
                      placeholder="Select biller"
                      onChange={() => {}}
                      fullWidth
                    />
                  </div>
                </div>

                {/* Update Button */}
                <div className="pt-4">
                  <Button
                    variant="primary"
                    className="w-full !py-3"
                    onClick={() => console.log("Update Note Status")}
                  >
                    <HiDocumentText className="h-5 w-5 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Right Side - Matter Notes History */}
          <Card className="border-gray-200">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <HiChatAlt className="h-5 w-5 text-xtnd-blue" />
                  <h3 className="text-lg font-semibold text-xtnd-dark">
                    Matter Notes History
                  </h3>
                </div>
                <button
                  className="flex items-center gap-2 text-sm text-xtnd-blue hover:text-xtnd-dark transition-colors font-medium"
                  onClick={() => console.log("Add Internal Note")}
                >
                  <HiPlusCircle className="h-4 w-4" />
                  Add Internal Note
                </button>
              </div>

              {/* System Log Entry */}
              <div className="mb-4 border-l-4 border-blue-400 bg-blue-50 rounded-r-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    System Log
                  </span>
                  <span className="text-xs text-gray-500">
                    10:45 AM, Jan 28, 2026
                  </span>
                </div>
                <p className="text-sm text-gray-700 italic">
                  "No matter notes available for this record yet. Please use the
                  form on the left to add a hold reason or assign a biller to
                  start tracking."
                </p>
              </div>

              {/* Empty State */}
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <HiDocumentText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Historical notes and audit logs will appear here.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Attachments Tab */}
      {activeTab === "attachments" && (
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-xtnd-blue transition-colors cursor-pointer bg-white">
            <div className="flex flex-col items-center">
              <label
                htmlFor="expense-upload"
                className="w-full cursor-pointer p-6 flex flex-col items-center text-center"
              >
                <input
                  id="expense-upload"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.txt"
                  className="hidden"
                />

                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <HiCloudUpload className="h-7 w-7 text-xtnd-blue" />
                </div>

                <h3 className="text-lg font-semibold text-xtnd-dark mb-2">
                  Upload Expense Documents
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop files here, or click to browse
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="font-medium text-xtnd-blue">PDF</span>
                  <span>•</span>
                  <span className="font-medium text-xtnd-blue">JPG</span>
                  <span>•</span>
                  <span className="font-medium text-xtnd-blue">PNG</span>
                  <span>•</span>
                  <span className="font-medium text-xtnd-blue">TXT</span>
                </div>
              </label>
            </div>
          </div>

          {/* Document List Section */}
          <div>
            {/* Header with title, search, and view toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-xtnd-dark">
                  Expense Documents
                </h3>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {filteredAttachments.length} Files
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Search Input */}
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={attachmentSearch}
                    onChange={(e) => setAttachmentSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 w-48 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent"
                  />
                </div>
                {/* View Toggle */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setAttachmentViewMode("grid")}
                    className={`p-2 transition-colors ${
                      attachmentViewMode === "grid"
                        ? "bg-xtnd-blue text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <HiViewGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setAttachmentViewMode("list")}
                    className={`p-2 transition-colors ${
                      attachmentViewMode === "list"
                        ? "bg-xtnd-blue text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <HiViewList className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Documents Table (List View) */}
            {attachmentViewMode === "list" && (
              <Card className="border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left text-xs font-semibold text-gray-600 uppercase py-3 px-4">
                          Document Name
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-600 uppercase py-3 px-4">
                          Uploaded By
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-600 uppercase py-3 px-4">
                          Date
                        </th>
                        <th className="text-left text-xs font-semibold text-gray-600 uppercase py-3 px-4">
                          Size
                        </th>
                        <th className="text-right text-xs font-semibold text-gray-600 uppercase py-3 px-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttachments.map((attachment) => (
                        <tr
                          key={attachment.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  attachment.type === "image"
                                    ? "bg-blue-100"
                                    : "bg-red-100"
                                }`}
                              >
                                {attachment.type === "image" ? (
                                  <HiPhotograph className="h-5 w-5 text-blue-600" />
                                ) : (
                                  <HiDocumentText className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                              <span className="text-sm font-medium text-xtnd-blue">
                                {attachment.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-xtnd-blue text-white flex items-center justify-center text-xs font-medium">
                                {attachment.uploadedByInitials}
                              </div>
                              <span className="text-sm text-xtnd-dark">
                                {attachment.uploadedBy}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-xtnd-blue">
                            {attachment.date}
                          </td>
                          <td className="py-3 px-4 text-sm text-xtnd-blue">
                            {attachment.size}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                className="p-1.5 text-gray-400 hover:text-xtnd-blue hover:bg-gray-100 rounded transition-colors"
                                title="Preview"
                              >
                                <HiEye className="h-4 w-4" />
                              </button>
                              <button
                                className="p-1.5 text-gray-400 hover:text-xtnd-blue hover:bg-gray-100 rounded transition-colors"
                                title="Download"
                              >
                                <HiDownload className="h-4 w-4" />
                              </button>
                              <button
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded transition-colors"
                                title="Delete"
                              >
                                <HiTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredAttachments.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-12 text-center text-gray-500"
                          >
                            No documents found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Documents Grid View */}
            {attachmentViewMode === "grid" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAttachments.map((attachment) => (
                  <Card key={attachment.id} className="border-gray-200 group">
                    <CardBody className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-16 h-16 rounded-lg flex items-center justify-center mb-3 ${
                            attachment.type === "image"
                              ? "bg-blue-100"
                              : "bg-red-100"
                          }`}
                        >
                          {attachment.type === "image" ? (
                            <HiPhotograph className="h-8 w-8 text-blue-600" />
                          ) : (
                            <HiDocumentText className="h-8 w-8 text-red-600" />
                          )}
                        </div>
                        <p
                          className="text-sm font-medium text-xtnd-dark truncate w-full mb-1"
                          title={attachment.name}
                        >
                          {attachment.name}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          {attachment.size}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <div className="w-5 h-5 rounded-full bg-xtnd-blue text-white flex items-center justify-center text-[10px] font-medium">
                            {attachment.uploadedByInitials}
                          </div>
                          <span>{attachment.date}</span>
                        </div>
                        {/* Hover Actions */}
                        <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-gray-400 hover:text-xtnd-blue hover:bg-gray-100 rounded transition-colors">
                            <HiEye className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-xtnd-blue hover:bg-gray-100 rounded transition-colors">
                            <HiDownload className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded transition-colors">
                            <HiTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
                {filteredAttachments.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-500">
                    No documents found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Document Lifecycle */}
          <Card className="border-gray-200">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <HiClock className="h-5 w-5 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Document Lifecycle
                </h3>
              </div>

              <div className="space-y-0">
                {/* Generated Date */}
                <div className="flex items-start gap-4 py-4 border-l-2 border-gray-200 pl-4 relative">
                  <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                    <HiCalendar className="h-2.5 w-2.5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Generated Date
                    </p>
                    <p className="text-base font-semibold text-xtnd-dark">
                      January 21st 2026, 1:01 am
                    </p>
                    <p className="text-xs text-xtnd-blue font-mono mt-0.5">
                      UTC Offset (-05:00)
                    </p>
                  </div>
                </div>

                {/* Assigned Date */}
                <div className="flex items-start gap-4 py-4 border-l-2 border-gray-200 pl-4 relative">
                  <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                    <HiUsers className="h-2.5 w-2.5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Assigned Date
                    </p>
                    <p className="text-base font-semibold text-xtnd-dark">
                      January 21st 2026, 1:30 am
                    </p>
                    <p className="text-xs text-xtnd-blue font-mono mt-0.5">
                      UTC Offset (-05:00)
                    </p>
                  </div>
                </div>

                {/* Last Updated Date */}
                <div className="flex items-start gap-4 py-4 border-l-2 border-transparent pl-4 relative">
                  <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-white border-2 border-xtnd-blue flex items-center justify-center">
                    <RxCounterClockwiseClock className="h-2.5 w-2.5 text-xtnd-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Last Updated Date
                    </p>
                    <p className="text-base font-semibold text-xtnd-dark">
                      January 27th 2026, 10:03 pm
                    </p>
                    <p className="text-xs text-xtnd-blue font-mono mt-0.5">
                      UTC Offset (-05:00)
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Right Side - Responsibility */}
          <Card className="border-gray-200">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <HiUsers className="h-5 w-5 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Responsibility
                </h3>
              </div>

              {/* Last Updated By */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-xtnd-blue text-white flex items-center justify-center text-lg font-semibold">
                  AS
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-0.5">
                    Last Updated By
                  </p>
                  <p className="text-lg font-semibold text-xtnd-dark">
                    Alan Shore
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <HiCheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                      Verified Senior Biller
                    </span>
                  </div>
                </div>
              </div>

              {/* Department and Employee ID */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Department
                  </p>
                  <p className="text-sm font-semibold text-xtnd-dark">
                    Billing & Finance
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Employee ID
                  </p>
                  <p className="text-sm font-semibold text-xtnd-dark font-mono">
                    #EMP-9902
                  </p>
                </div>
              </div>

              {/* Info Banner */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">i</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    This report is finalized for the current billing cycle. Any
                    further modifications will be logged as a separate revision
                    in the audit trail.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Other tabs - placeholder content */}
      {activeTab !== "fees" &&
        activeTab !== "summary" &&
        activeTab !== "notes" &&
        activeTab !== "attachments" &&
        activeTab !== "expenses" &&
        activeTab !== "general" && (
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
              <div className="space-y-6">
                {/* Existing Comments */}
                {mockComments.map((c) => (
                  <div key={c.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`h-10 w-10 rounded-full ${c.avatarColor} flex items-center justify-center text-white font-semibold text-sm`}
                      >
                        {c.authorInitials}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-xtnd-dark">
                          {c.author}
                        </span>
                        <span className="text-xs text-gray-400">
                          {c.date} at {c.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        {c.content}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Divider */}
                <div className="border-t border-gray-200 pt-6">
                  {/* New Comment Input */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-semibold text-sm">
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
                        placeholder="Write a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent resize-none"
                        rows={3}
                      />
                      <div className="mt-3">
                        <Button variant="primary" size="sm">
                          Add Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activities Tab Content */}
            {activeCommentsTab === "activities" && (
              <div className="space-y-4">
                {mockActivities.map((activity, index) => (
                  <div key={activity.id} className="flex gap-4 relative">
                    {/* Timeline line */}
                    {index < mockActivities.length - 1 && (
                      <div className="absolute left-5 top-10 w-0.5 h-full bg-gray-200" />
                    )}
                    {/* Icon */}
                    <div className="flex-shrink-0 z-10">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          activity.type === "status_change"
                            ? "bg-blue-500"
                            : activity.type === "edit"
                              ? "bg-amber-500"
                              : activity.type === "comment"
                                ? "bg-green-500"
                                : activity.type === "attachment"
                                  ? "bg-purple-500"
                                  : "bg-gray-500"
                        }`}
                      >
                        {activity.type === "status_change" && (
                          <HiSync className="h-5 w-5" />
                        )}
                        {activity.type === "edit" && (
                          <HiPencil className="h-5 w-5" />
                        )}
                        {activity.type === "comment" && (
                          <HiChatAlt className="h-5 w-5" />
                        )}
                        {activity.type === "attachment" && (
                          <HiLink className="h-5 w-5" />
                        )}
                        {activity.type === "assignment" && (
                          <HiUsers className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-xtnd-dark">
                          {activity.description}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>by {activity.user}</span>
                        <span>•</span>
                        <span>
                          {activity.date} at {activity.time}
                        </span>
                      </div>
                      {activity.details && (
                        <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                          {activity.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
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

      {/* Add Fee Modal */}
      <Modal
        isOpen={isAddFeeModalOpen}
        onClose={handleCloseAddFeeModal}
        title="New Fee"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-xtnd-dark mb-2">
                Date
              </label>
              <DatePicker
                mode="single"
                value={parseDate(newFee.date)}
                onChange={handleDateChange}
                placeholder="Select Date"
                format="MM/dd/yyyy"
                buttonClassName="text-sm py-1.5"
              />
            </div>

            {/* Bill Amt */}
            <div>
              <label className="block text-sm font-medium text-xtnd-dark mb-2">
                Bill Amt
              </label>
              <input
                type="number"
                value={newFee.amount}
                readOnly
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-xtnd-dark mb-2">
              Services
            </label>
            <textarea
              value={newFee.services}
              onChange={(e) =>
                setNewFee({ ...newFee, services: e.target.value })
              }
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Atty (Attorney) */}
            <div>
              <label className="block text-sm font-medium text-xtnd-dark mb-2">
                Atty
              </label>
              <select
                value={newFee.attorney}
                onChange={(e) =>
                  setNewFee({ ...newFee, attorney: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent"
              >
                <option value="">Select Attorney</option>
                <option value="KEFL">KEFL</option>
                <option value="ASH">ASH - Alan Shore</option>
                <option value="DCR">DCR - Denny Crane</option>
              </select>
            </div>

            {/* Activity */}
            <div>
              <label className="block text-sm font-medium text-xtnd-dark mb-2">
                Activity
              </label>
              <select
                value={newFee.activityCode}
                onChange={(e) =>
                  setNewFee({ ...newFee, activityCode: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent"
              >
                <option value="">Select Activity</option>
                <option value="A101">A101</option>
                <option value="A102">A102</option>
                <option value="A103">A103</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Task */}
            <div>
              <label className="block text-sm font-medium text-xtnd-dark mb-2">
                Task
              </label>
              <select
                value={newFee.taskCode}
                onChange={(e) =>
                  setNewFee({ ...newFee, taskCode: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent"
              >
                <option value="">Select Task</option>
                <option value="L110">L110</option>
                <option value="L120">L120</option>
                <option value="L130">L130</option>
                <option value="L140">L140</option>
              </select>
            </div>

            {/* Event */}
            <div>
              <label className="block text-sm font-medium text-xtnd-dark mb-2">
                Event
              </label>
              <input
                type="text"
                value={newFee.eventCode}
                readOnly
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Hours */}
            <div>
              <label className="block text-sm font-medium text-xtnd-dark mb-2">
                Hours
              </label>
              <input
                type="number"
                step="0.01"
                value={newFee.hours}
                onChange={(e) => {
                  const hours = parseFloat(e.target.value) || 0;
                  const amount = hours * newFee.ratePerHour;
                  setNewFee({ ...newFee, hours, amount });
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-xtnd-blue focus:border-transparent"
              />
            </div>

            {/* Rate/Hr */}
            <div>
              <label className="block text-sm font-medium text-xtnd-dark mb-2">
                Rate/Hr
              </label>
              <input
                type="number"
                value={newFee.ratePerHour}
                readOnly
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-xtnd-dark mb-2">
                Amount
              </label>
              <input
                type="number"
                value={newFee.amount}
                readOnly
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="ghost" onClick={handleCloseAddFeeModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveNewFee}
              disabled={
                !newFee.services.trim() ||
                !newFee.attorney ||
                !newFee.activityCode ||
                !newFee.taskCode
              }
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
