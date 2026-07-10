import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiEye,
  HiArrowDownTray,
  HiMagnifyingGlass,
  HiArrowPath,
} from 'react-icons/hi2';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { customerPortalService } from '../../services/customerPortalService';
import toast from 'react-hot-toast';

interface Invoice {
  invoiceNumber: string;
  orderNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERDUE';
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await customerPortalService.getOrderHistory({ page: 1, limit: 50 });
      if (response.success && response.data) {
        const mockInvoices: Invoice[] = [];
        setInvoices(mockInvoices);
      }
    } catch (error) {
      toast.error('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const viewInvoice = async (orderNumber: string) => {
    try {
      const response = await customerPortalService.getInvoice(orderNumber);
      if (response.success && response.data) {
        setSelectedInvoice(response.data);
        setShowInvoiceModal(true);
      }
    } catch (error) {
      toast.error('Failed to load invoice');
    }
  };

  const downloadInvoice = (invoice: Invoice) => {
    toast.success(`Downloading invoice ${invoice.invoiceNumber}...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'PARTIAL':
        return 'warning';
      case 'OVERDUE':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Invoices
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          View and download your invoices
        </p>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by invoice or order number..."
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={fetchInvoices}
            disabled={isLoading}
          >
            <HiArrowPath className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Loading invoices...</p>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400">No invoices found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInvoices.map((invoice, index) => (
            <motion.div
              key={invoice.invoiceNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                        {invoice.invoiceNumber}
                      </h3>
                      <Badge variant={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Order: {invoice.orderNumber}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Invoice Date: {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-500">
                      Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Amount</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      KSh {invoice.totalAmount.toLocaleString()}
                    </p>
                    {invoice.balanceAmount > 0 && (
                      <p className="text-sm text-error-600 mt-1">
                        Balance: KSh {invoice.balanceAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewInvoice(invoice.orderNumber)}
                  >
                    <HiEye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadInvoice(invoice)}
                  >
                    <HiArrowDownTray className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        title="Invoice Details"
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Invoice Number</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {selectedInvoice.invoiceNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Order Number</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {selectedInvoice.orderNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Invoice Date</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Due Date</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {selectedInvoice.items && selectedInvoice.items.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Items</h3>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Description</th>
                        <th className="px-4 py-2 text-right text-sm font-semibold">Qty</th>
                        <th className="px-4 py-2 text-right text-sm font-semibold">Unit Price</th>
                        <th className="px-4 py-2 text-right text-sm font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item, idx) => (
                        <tr key={idx} className="border-t border-slate-200 dark:border-slate-700">
                          <td className="px-4 py-2 text-sm">{item.description}</td>
                          <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-right">
                            KSh {item.unitPrice.toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-semibold">
                            KSh {item.totalPrice.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300">Total Amount:</span>
                <span className="font-semibold">KSh {selectedInvoice.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300">Paid Amount:</span>
                <span className="font-semibold text-green-600">
                  KSh {selectedInvoice.paidAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold border-t border-primary-200 dark:border-primary-800 pt-2">
                <span>Balance:</span>
                <span className={selectedInvoice.balanceAmount > 0 ? 'text-error-600' : 'text-green-600'}>
                  KSh {selectedInvoice.balanceAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowInvoiceModal(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => downloadInvoice(selectedInvoice)}
                className="flex-1"
              >
                <HiArrowDownTray className="w-5 h-5 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InvoicesPage;
