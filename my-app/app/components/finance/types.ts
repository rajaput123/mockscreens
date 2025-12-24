export interface Asset {
  id: string;
  name: string;
  category: string;
  condition: string;
  location: string;
  currentValue: number;
  purchasePrice?: number;
  purchaseDate?: string;
  depreciationRate?: number;
  description?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  subCategory?: string;
  amount: number;
  description: string;
  account?: string;
  paymentMethod?: 'cash' | 'online' | 'cheque' | 'bank_transfer';
  referenceNumber?: string;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  reference?: string;
  vendorId?: string;
  vendorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate80G {
  id: string;
  donorName: string;
  donorPan?: string;
  donorAddress?: string;
  amount?: number;
  donationAmount: number;
  date?: string;
  donationDate: string;
  donationType: string;
  certificateNumber: string;
  transactionId?: string;
  issuedAt?: string;
  issuedBy?: string;
  status: 'draft' | 'issued' | 'cancelled';
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string;
  email?: string;
  manager?: string;
  managerName?: string;
  managerPhone?: string;
  openingDate: string;
  totalRevenue: number;
  totalExpenses: number;
  status: 'active' | 'inactive';
}

export interface ComplianceRecord {
  id: string;
  title: string;
  type: string;
  status: 'pending' | 'completed' | 'overdue';
  dueDate: string;
  description?: string;
  filingDate?: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: 'supplier' | 'contractor' | 'service_provider';
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  gstNumber?: string;
  panNumber?: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  status: 'active' | 'inactive' | 'suspended';
  rating?: number;
  totalTransactions?: number;
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

