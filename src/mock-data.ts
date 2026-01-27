// Invoice data types
export interface Invoice {
  invoiceId: number;
  cltCode: string;
  cltName: string;
  matCode: string;
  metadata: {
    actCodeMissing: boolean;
    uploadedInvoice?: {
      fileName: string;
      uploadedAt: string;
      invoiceBalance: string;
    };
    editMode?: {
      enable: boolean;
      enabledByUser?: number;
    };
    replacedBy?: {
      id: number;
      billCode: string;
    };
    billThemeId?: number;
    splitAmount?: Record<string, number>;
    splitInvoice?: {
      linkedBillNums: string[];
      linkedBillCodes: number[];
    };
    collaborationUsers?: string[];
    routePrebillEditsTo?: string;
    onHold?: boolean;
    submit?: {
      status: string;
    };
    rollover?: boolean;
    disabledPdfEmail?: boolean;
    partnerSubmitTimes?: number;
    emailTemplateOption?: string;
    isCollaboratorSubmit?: boolean;
    billNum?: string;
    changedRateFees?: any;
    headlessUploaded?: boolean;
  };
  status: string;
  feeThru: string;
  statusDescription: string | null;
  billCode: string;
  billNum: string;
  billDate: string;
  createdAt: string;
  total: string;
  balance: string;
  holdType: string | null;
  holdReason: string | null;
  originStatus: string;
  receiptStatus: string;
  matter: {
    name: string;
    shortName: string | null;
    displayNumber: string;
    billAttorney: {
      name: string;
    };
    metadata: {
      payers: Array<{
        claimNo: string | null;
        cltCode: number;
        portion: number;
        adjusterId: number | null;
      }>;
      carrier: {
        matterId: string;
        firmName?: string | null;
        clientName?: string | null;
        matterName?: string | null;
        matterEmail?: string;
      };
      claimNo: string | null;
      claimant: string | null;
      adjusterId: number | null;
      alterClientId: string | null;
      billingMethod: string;
      alterLawFirmId: string | null;
      alterInvoiceDesciption: string | null;
      regenerating?: {
        step: string;
        billId: number;
        status: string;
        stepData: string;
      };
    };
    client: {
      name: string;
      cltCode: string;
    };
  };
}

// Mock data array
export const invoicesMockData: Invoice[] = [
  {
    invoiceId: 1084134555,
    cltCode: "2470567930",
    cltName: "Anh Hoang1",
    matCode: "1874606605",
    metadata: {
      actCodeMissing: false,
      uploadedInvoice: {
        fileName: "invoices/2470567930/1874606605/4242_invoice.pdf",
        uploadedAt:
          "Mon Jan 26 2026 10:15:19 GMT+0000 (Coordinated Universal Time)",
        invoiceBalance: "3528.69",
      },
    },
    status: "Posted",
    feeThru: "2025-05-12T00:00:00.000Z",
    statusDescription: null,
    billCode: "1268858440",
    billNum: "4242",
    billDate: "2025-12-01T00:00:00.000Z",
    createdAt: "2026-01-26T10:14:05.000Z",
    total: "3528.69",
    balance: "3528.69",
    holdType: null,
    holdReason: null,
    originStatus: "Posted",
    receiptStatus: "Awaiting Allocation",
    matter: {
      name: "AH - Mergers and Acquisitions Support 111",
      shortName: null,
      displayNumber: "02312",
      billAttorney: {
        name: "clio test2",
      },
      metadata: {
        payers: [],
        carrier: {
          matterId: "",
        },
        claimNo: null,
        claimant: null,
        adjusterId: null,
        alterClientId: null,
        billingMethod: "hourly",
        alterLawFirmId: null,
        alterInvoiceDesciption: null,
      },
      client: {
        name: "Anh Hoang1",
        cltCode: "2470567930",
      },
    },
  },
  {
    invoiceId: 1084134553,
    cltCode: "2470567930",
    cltName: "Anh Hoang1",
    matCode: "1874606605",
    metadata: {
      actCodeMissing: false,
      uploadedInvoice: {
        fileName: "invoices/2470567930/1874606605/4241_invoice.pdf",
        uploadedAt:
          "Mon Jan 26 2026 09:30:19 GMT+0000 (Coordinated Universal Time)",
        invoiceBalance: "2249.50",
      },
    },
    status: "Posted",
    feeThru: "2025-05-09T00:00:00.000Z",
    statusDescription: null,
    billCode: "1268857375",
    billNum: "4241",
    billDate: "2025-11-01T00:00:00.000Z",
    createdAt: "2026-01-26T09:16:40.000Z",
    total: "2249.50",
    balance: "2249.50",
    holdType: null,
    holdReason: null,
    originStatus: "Posted",
    receiptStatus: "Awaiting Allocation",
    matter: {
      name: "AH - Mergers and Acquisitions Support 111",
      shortName: null,
      displayNumber: "02312",
      billAttorney: {
        name: "clio test2",
      },
      metadata: {
        payers: [],
        carrier: {
          matterId: "",
        },
        claimNo: null,
        claimant: null,
        adjusterId: null,
        alterClientId: null,
        billingMethod: "hourly",
        alterLawFirmId: null,
        alterInvoiceDesciption: null,
      },
      client: {
        name: "Anh Hoang1",
        cltCode: "2470567930",
      },
    },
  },
  {
    invoiceId: 1084134551,
    cltCode: "2470567930",
    cltName: "Anh Hoang1",
    matCode: "1874606605",
    metadata: {
      actCodeMissing: false,
      uploadedInvoice: {
        fileName: "invoices/2470567930/1874606605/4240_invoice.pdf",
        uploadedAt:
          "Mon Jan 26 2026 09:00:18 GMT+0000 (Coordinated Universal Time)",
        invoiceBalance: "1462.66",
      },
    },
    status: "Posted",
    feeThru: "2025-05-13T00:00:00.000Z",
    statusDescription: null,
    billCode: "1268857345",
    billNum: "4240",
    billDate: "2026-01-26T00:00:00.000Z",
    createdAt: "2026-01-26T08:53:14.000Z",
    total: "1462.66",
    balance: "1462.66",
    holdType: null,
    holdReason: null,
    originStatus: "Posted",
    receiptStatus: "Awaiting Allocation",
    matter: {
      name: "AH - Mergers and Acquisitions Support 111",
      shortName: null,
      displayNumber: "02312",
      billAttorney: {
        name: "clio test2",
      },
      metadata: {
        payers: [],
        carrier: {
          matterId: "",
        },
        claimNo: null,
        claimant: null,
        adjusterId: null,
        alterClientId: null,
        billingMethod: "hourly",
        alterLawFirmId: null,
        alterInvoiceDesciption: null,
      },
      client: {
        name: "Anh Hoang1",
        cltCode: "2470567930",
      },
    },
  },
  {
    invoiceId: 1084134520,
    cltCode: "2470567930",
    cltName: "Anh Hoang1",
    matCode: "1874502850",
    metadata: {
      actCodeMissing: false,
      submit: {
        status: "success",
      },
      billNum: "4220",
      editMode: {
        enable: false,
      },
      changedRateFees: null,
      disabledPdfEmail: false,
      collaborationUsers: ["359544940", "359544955"],
      partnerSubmitTimes: 2,
      emailTemplateOption: "STANDARD_INVOICE",
      isCollaboratorSubmit: false,
    },
    status: "Paid",
    feeThru: "2026-01-23T00:00:00.000Z",
    statusDescription: "The invoice email has been sent to carrier.",
    billCode: "1268242810",
    billNum: "4220",
    billDate: "2026-01-23T00:00:00.000Z",
    createdAt: "2026-01-23T08:11:18.000Z",
    total: "779.00",
    balance: "0.00",
    holdType: null,
    holdReason: null,
    originStatus: "Paid",
    receiptStatus: "Fully Allocated",
    matter: {
      name: "AH - Real Estate Transaction Management 999",
      shortName: null,
      displayNumber: "02311",
      billAttorney: {
        name: "clio test2",
      },
      metadata: {
        payers: [],
        carrier: {
          firmName: null,
          matterId: "",
          clientName: null,
          matterName: null,
          matterEmail: "anh.hoang@thecoraledge.com",
        },
        claimNo: null,
        claimant: null,
        adjusterId: null,
        alterClientId: null,
        billingMethod: "hourly",
        alterLawFirmId: null,
        alterInvoiceDesciption: null,
      },
      client: {
        name: "Anh Hoang1",
        cltCode: "2470567930",
      },
    },
  },
  {
    invoiceId: 1084134540,
    cltCode: "2300107669",
    cltName: "Juniper Ridge Partners",
    matCode: "1745909465",
    metadata: {
      actCodeMissing: false,
      editMode: {
        enable: true,
        enabledByUser: 64,
      },
      billThemeId: 3136025,
      splitAmount: {
        total_1268735665: 100,
        total_1268735680: 100,
        balance_1268735665: 100,
        balance_1268735680: 100,
      },
      splitInvoice: {
        linkedBillNums: ["4235"],
        linkedBillCodes: [1268735680],
      },
      collaborationUsers: ["359544790"],
      routePrebillEditsTo: "359544910",
    },
    status: "Collaboration Edits",
    feeThru: "2026-01-26T00:00:00.000Z",
    statusDescription: null,
    billCode: "1268735665",
    billNum: "4234",
    billDate: "2026-01-26T00:00:00.000Z",
    createdAt: "2026-01-26T03:57:10.000Z",
    total: "200.00",
    balance: "200.00",
    holdType: null,
    holdReason: null,
    originStatus: "New",
    receiptStatus: "Awaiting Allocation",
    matter: {
      name: "Contract breach resolution under intellectual rights conflict_1745909465",
      shortName: null,
      displayNumber: "00004",
      billAttorney: {
        name: "Tracie Hancock FL",
      },
      metadata: {
        payers: [
          {
            claimNo: null,
            cltCode: 2300107669,
            portion: 50,
            adjusterId: null,
          },
          {
            claimNo: null,
            cltCode: 2406963237,
            portion: 50,
            adjusterId: null,
          },
        ],
        carrier: {
          matterId: "",
        },
        claimNo: null,
        claimant: null,
        adjusterId: 2300580454,
        alterClientId: null,
        billingMethod: "hourly",
        alterLawFirmId: null,
        alterInvoiceDesciption: null,
      },
      client: {
        name: "Juniper Ridge Partners",
        cltCode: "2300107669",
      },
    },
  },
  {
    invoiceId: 1084134359,
    cltCode: "2470567915",
    cltName: "Peter Gibbons",
    matCode: "1873770490",
    metadata: {
      actCodeMissing: false,
    },
    status: "Paid",
    feeThru: "2026-01-21T00:00:00.000Z",
    statusDescription: null,
    billCode: "1267373170",
    billNum: "4141",
    billDate: "2026-01-21T00:00:00.000Z",
    createdAt: "2026-01-21T06:25:21.000Z",
    total: "30000.00",
    balance: "0.00",
    holdType: null,
    holdReason: null,
    originStatus: "Paid",
    receiptStatus: "Fully Allocated",
    matter: {
      name: "Initech Corporation v. Peter Gibbons – Wrongful Termination & Hostile Work Environment",
      shortName: null,
      displayNumber: "02299",
      billAttorney: {
        name: "Alan Shore",
      },
      metadata: {
        payers: [],
        carrier: {
          matterId: "",
        },
        claimNo: null,
        claimant: null,
        adjusterId: null,
        alterClientId: null,
        billingMethod: "hourly",
        alterLawFirmId: null,
        alterInvoiceDesciption: null,
      },
      client: {
        name: "Peter Gibbons",
        cltCode: "2470567915",
      },
    },
  },
  {
    invoiceId: 1084134336,
    cltCode: "2470567915",
    cltName: "Peter Gibbons",
    matCode: "1873770490",
    metadata: {
      actCodeMissing: false,
    },
    status: "Paid",
    feeThru: "2026-01-21T00:00:00.000Z",
    statusDescription: null,
    billCode: "1267373080",
    billNum: "4138",
    billDate: "2026-01-21T00:00:00.000Z",
    createdAt: "2026-01-21T06:17:30.000Z",
    total: "50000.00",
    balance: "0.00",
    holdType: null,
    holdReason: null,
    originStatus: "Paid",
    receiptStatus: "Fully Allocated",
    matter: {
      name: "Initech Corporation v. Peter Gibbons – Wrongful Termination & Hostile Work Environment",
      shortName: null,
      displayNumber: "02299",
      billAttorney: {
        name: "Alan Shore",
      },
      metadata: {
        payers: [],
        carrier: {
          matterId: "",
        },
        claimNo: null,
        claimant: null,
        adjusterId: null,
        alterClientId: null,
        billingMethod: "hourly",
        alterLawFirmId: null,
        alterInvoiceDesciption: null,
      },
      client: {
        name: "Peter Gibbons",
        cltCode: "2470567915",
      },
    },
  },
  {
    invoiceId: 1084134443,
    cltCode: "2283792649",
    cltName: "Brian Murphy",
    matCode: "1838987530",
    metadata: {
      actCodeMissing: false,
      billThemeId: 3136025,
      splitAmount: {
        total_1267787305: 3120,
        total_1267787320: 2080,
        balance_1267787305: 3120,
        balance_1267787320: 1000,
      },
      splitInvoice: {
        linkedBillNums: ["4185"],
        linkedBillCodes: [1267787320],
      },
      uploadedInvoice: {
        fileName: "invoices/2262471575/1838987530/4185_invoice.pdf",
        uploadedAt:
          "Thu Jan 22 2026 02:00:16 GMT+0000 (Coordinated Universal Time)",
        invoiceBalance: "4120.00",
      },
    },
    status: "Posted",
    feeThru: "2026-01-13T00:00:00.000Z",
    statusDescription: null,
    billCode: "1267787305",
    billNum: "4184",
    billDate: "2025-12-01T00:00:00.000Z",
    createdAt: "2026-01-22T01:57:00.000Z",
    total: "5200.00",
    balance: "4120.00",
    holdType: null,
    holdReason: null,
    originStatus: "Posted",
    receiptStatus: "Awaiting Allocation",
    matter: {
      name: "Matter for testing AH 1",
      shortName: null,
      displayNumber: "02067",
      billAttorney: {
        name: "clio test2",
      },
      metadata: {
        payers: [
          {
            claimNo: "Split Bill Claim No (Payer 1)",
            cltCode: 2283792649,
            portion: 60,
            adjusterId: 2283792649,
          },
          {
            claimNo: "Split Bill Claim No (Payer 2)",
            cltCode: 2262471575,
            portion: 40,
            adjusterId: 2262471575,
          },
          {
            claimNo: "Split Bill Claim No (Payer 3)",
            cltCode: 2316749074,
            portion: 0,
            adjusterId: null,
          },
        ],
        carrier: {
          matterId: "",
        },
        claimNo: null,
        claimant: null,
        adjusterId: null,
        alterClientId: null,
        billingMethod: "hourly",
        alterLawFirmId: null,
        alterInvoiceDesciption: null,
      },
      client: {
        name: "Assurance America",
        cltCode: "2316749074",
      },
    },
  },
  {
    invoiceId: 1084134462,
    cltCode: "2316749074",
    cltName: "Assurance America",
    matCode: "1843644805",
    metadata: {
      actCodeMissing: false,
      onHold: true,
      uploadedInvoice: {
        fileName: "invoices/2316749074/1843644805/4192_invoice.pdf",
        uploadedAt:
          "Thu Jan 22 2026 08:15:19 GMT+0000 (Coordinated Universal Time)",
        invoiceBalance: "9200.00",
      },
    },
    status: "Posted",
    feeThru: "2026-01-22T00:00:00.000Z",
    statusDescription: null,
    billCode: "1267917475",
    billNum: "4192",
    billDate: "2026-01-22T00:00:00.000Z",
    createdAt: "2026-01-22T08:06:47.000Z",
    total: "10400.00",
    balance: "9200.00",
    holdType: null,
    holdReason: null,
    originStatus: "Partially Paid",
    receiptStatus: "Awaiting Allocation",
    matter: {
      name: "Matter for testing AH 11",
      shortName: null,
      displayNumber: "02080",
      billAttorney: {
        name: "clio test2",
      },
      metadata: {
        payers: [],
        carrier: {
          matterId: "",
        },
        claimNo: null,
        claimant: null,
        adjusterId: 2472494065,
        alterClientId: null,
        billingMethod: "hourly",
        alterLawFirmId: null,
        alterInvoiceDesciption: null,
      },
      client: {
        name: "Assurance America",
        cltCode: "2316749074",
      },
    },
  },
  {
    invoiceId: 1084134278,
    cltCode: "2477352955",
    cltName: "AH 3",
    matCode: "1873995790",
    metadata: {
      actCodeMissing: false,
      submit: {
        status: "success",
      },
      editMode: {
        enable: false,
      },
      disabledPdfEmail: true,
      partnerSubmitTimes: 1,
    },
    status: "Review Complete",
    feeThru: "2026-01-20T00:00:00.000Z",
    statusDescription: null,
    billCode: "1267002865",
    billNum: "4113",
    billDate: "2026-01-20T00:00:00.000Z",
    createdAt: "2026-01-20T06:52:14.000Z",
    total: "200.00",
    balance: "200.00",
    holdType: null,
    holdReason: null,
    originStatus: "New",
    receiptStatus: "Awaiting Allocation",
    matter: {
      name: "Matter for testing",
      shortName: null,
      displayNumber: "02300",
      billAttorney: {
        name: "clio test2",
      },
      metadata: {
        payers: [],
        carrier: {
          matterId: "",
        },
        claimNo: null,
        claimant: null,
        adjusterId: null,
        alterClientId: null,
        billingMethod: "hourly",
        alterLawFirmId: null,
        alterInvoiceDesciption: null,
      },
      client: {
        name: "AH 3",
        cltCode: "2477352955",
      },
    },
  },
];
