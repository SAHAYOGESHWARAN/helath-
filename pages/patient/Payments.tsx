"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var formik_1 = require("formik");
var Yup = require("yup");
var Card_1 = require("../../components/shared/Card");
var useAuth_1 = require("../../hooks/useAuth");
var App_1 = require("../../App");
var Icons_1 = require("../../components/shared/Icons");
var Modal_1 = require("../../components/shared/Modal");
var PageHeader_1 = require("../../components/shared/PageHeader");
var ToggleSwitch_1 = require("../../components/shared/ToggleSwitch");
var Table_1 = require("../../components/shared/Table");
var PaymentSchema = Yup.object().shape({
    nameOnCard: Yup.string()
        .min(3, 'Name is too short')
        .matches(/(\s)/, { message: 'Please enter your full name as it appears on the card', excludeEmptyString: true })
        .required('Name on card is required'),
    cardNumber: Yup.string()
        .matches(/^[0-9]{16}$/, 'Card number must be 16 digits')
        .required('Card number is required'),
    expiryDate: Yup.string()
        .matches(/^(0[1-9]|1[0-2])\s?\/\s?([0-9]{2})$/, 'Use MM / YY format')
        .test('is-not-expired', 'Card has expired', function (value) {
        if (!value || !/^(0[1-9]|1[0-2])\s?\/\s?([0-9]{2})$/.test(value))
            return false;
        var _a = value.split('/').map(function (s) { return parseInt(s.trim(), 10); }), month = _a[0], year = _a[1];
        var expiry = new Date(2000 + year, month - 1);
        var lastDayOfMonth = new Date(expiry.getFullYear(), expiry.getMonth() + 1, 0);
        return lastDayOfMonth >= new Date();
    })
        .required('Expiry date is required'),
    cvc: Yup.string()
        .matches(/^\d{3,4}$/, 'CVC must be 3-4 digits')
        .required('CVC is required'),
    amount: Yup.number()
        .positive('Amount must be positive')
        .required('Amount is required'),
});
var ReceiptModal = function (_a) {
    var invoice = _a.invoice, onClose = _a.onClose;
    if (!invoice)
        return null;
    var handlePrint = function () {
        var _a;
        var printContents = (_a = document.getElementById('invoice-to-print')) === null || _a === void 0 ? void 0 : _a.innerHTML;
        var originalContents = document.body.innerHTML;
        if (printContents) {
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload();
        }
    };
    return (<Modal_1.default isOpen={!!invoice} onClose={onClose} title={"Receipt for Invoice #".concat(invoice.id)} footer={<>
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Close</button>
                    <button onClick={handlePrint} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <Icons_1.DownloadIcon className="w-4 h-4 mr-2"/>
                        Print / Save as PDF
                    </button>
                </>}>
            <div id="invoice-to-print">
                 <div className="printable-invoice space-y-4 text-sm">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">NovoPath Medical</h2>
                        <p className="text-gray-500">Payment Receipt</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium text-gray-500">Invoice ID</p>
                                <p className="font-semibold text-gray-800">{invoice.id}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">Date Processed</p>
                                <p className="font-semibold text-gray-800">{invoice.date}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">Description</p>
                                <p className="font-semibold text-gray-800">{invoice.description}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">Payment Method</p>
                                <p className="font-semibold text-gray-800">Visa **** 4242</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t pt-4 mt-4">
                         <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800 text-lg">Total Paid</span>
                            <span className="font-bold text-primary-600 text-xl">${invoice.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                     <p className="text-xs text-center text-gray-500 pt-4">Thank you for your payment!</p>
                </div>
            </div>
        </Modal_1.default>);
};
var Payments = function () {
    var _a = (0, useAuth_1.useAuth)(), user = _a.user, invoices = _a.invoices, makePayment = _a.makePayment;
    var showToast = (0, App_1.useApp)().showToast;
    var _b = (0, react_1.useState)(null), selectedReceipt = _b[0], setSelectedReceipt = _b[1];
    var _c = (0, react_1.useState)('card'), paymentMethod = _c[0], setPaymentMethod = _c[1];
    var _d = (0, react_1.useState)(false), autoPay = _d[0], setAutoPay = _d[1];
    var _e = (0, react_1.useMemo)(function () {
        if (!user)
            return { dueInvoices: [], paidInvoices: [], currentBalance: 0 };
        var userInvoices = invoices.filter(function (inv) { return inv.patientId === user.id; });
        var due = userInvoices.filter(function (inv) { return inv.status === 'Due' || inv.status === 'Overdue'; });
        var paid = userInvoices.filter(function (inv) { return inv.status === 'Paid'; });
        var balance = due.reduce(function (sum, inv) { return sum + inv.amountDue; }, 0);
        return { dueInvoices: due, paidInvoices: paid, currentBalance: balance };
    }, [invoices, user]), dueInvoices = _e.dueInvoices, paidInvoices = _e.paidInvoices, currentBalance = _e.currentBalance;
    var handleSimulatedPayment = function (amount) {
        var amountToApply = amount;
        var sortedDueInvoices = __spreadArray([], dueInvoices, true).sort(function (a, b) { return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(); });
        for (var _i = 0, sortedDueInvoices_1 = sortedDueInvoices; _i < sortedDueInvoices_1.length; _i++) {
            var inv = sortedDueInvoices_1[_i];
            if (amountToApply <= 0)
                break;
            var paymentForThisInvoice = Math.min(amountToApply, inv.amountDue);
            makePayment(inv.id, paymentForThisInvoice);
            amountToApply -= paymentForThisInvoice;
        }
        showToast("Payment of $".concat(amount.toFixed(2), " submitted successfully!"), 'success');
    };
    var paidInvoiceColumns = [
        { accessorKey: 'date', header: 'Date Paid' },
        { accessorKey: 'description', header: 'Description', cellClassName: 'font-medium text-gray-900' },
        { accessorKey: 'totalAmount', header: 'Amount', cell: function (row) { return "$".concat(row.totalAmount.toFixed(2)); } },
        { accessorKey: 'actions', header: '', cell: function (row) { return (<button onClick={function () { return setSelectedReceipt(row); }} className="text-primary-600 hover:text-primary-900 font-medium">Receipt</button>); }, cellClassName: 'text-right' },
    ];
    var dueInvoiceColumns = [
        { accessorKey: 'description', header: 'Description', cellClassName: 'font-medium text-gray-900' },
        { accessorKey: 'dueDate', header: 'Due Date' },
        { accessorKey: 'amountDue', header: 'Amount Due', cell: function (row) { return "$".concat(row.amountDue.toFixed(2)); }, cellClassName: 'text-red-600 font-semibold' },
    ];
    return (<div>
      <PageHeader_1.default title="Payments & Billing"/>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card_1.default title="Outstanding Invoices">
             <Table_1.Table columns={dueInvoiceColumns} data={dueInvoices} emptyState={<div className="text-center py-4 text-gray-500">No outstanding invoices.</div>}/>
          </Card_1.default>
          <Card_1.default title="Transaction History">
             <Table_1.Table columns={paidInvoiceColumns} data={paidInvoices}/>
          </Card_1.default>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <Card_1.default title="Make a Payment">
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-700">Current Balance</p>
              <p className="text-3xl font-bold text-red-600">${currentBalance.toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
                <button onClick={function () { return setPaymentMethod('card'); }} className={"p-2 border rounded-lg flex justify-center ".concat(paymentMethod === 'card' ? 'bg-primary-100 border-primary-500' : 'bg-white')}><Icons_1.CreditCardIcon className="w-6 h-6"/></button>
            </div>

            <formik_1.Formik initialValues={{ nameOnCard: '', cardNumber: '', expiryDate: '', cvc: '', amount: currentBalance > 0 ? currentBalance.toFixed(2) : '0.00' }} enableReinitialize validationSchema={PaymentSchema} onSubmit={function (values, _a) {
            var setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
            handleSimulatedPayment(parseFloat(values.amount));
            setSubmitting(false);
            resetForm();
        }}>
            {function (_a) {
            var errors = _a.errors, touched = _a.touched, isValid = _a.isValid, isSubmitting = _a.isSubmitting, values = _a.values;
            return (<formik_1.Form className="space-y-4">
                <formik_1.Field name="nameOnCard" placeholder="Name on Card" className={"w-full p-2 border rounded ".concat(errors.nameOnCard && touched.nameOnCard ? 'border-red-500' : 'border-gray-300')}/>
                <formik_1.Field name="cardNumber" placeholder="Card Number" className={"w-full p-2 border rounded ".concat(errors.cardNumber && touched.cardNumber ? 'border-red-500' : 'border-gray-300')}/>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <formik_1.Field name="expiryDate" placeholder="MM / YY" className={"w-full p-2 border rounded ".concat(errors.expiryDate && touched.expiryDate ? 'border-red-500' : 'border-gray-300')}/>
                        <formik_1.ErrorMessage name="expiryDate" component="p" className="text-red-500 text-xs mt-1"/>
                    </div>
                    <div>
                        <formik_1.Field name="cvc" placeholder="CVC" className={"w-full p-2 border rounded ".concat(errors.cvc && touched.cvc ? 'border-red-500' : 'border-gray-300')}/>
                        <formik_1.ErrorMessage name="cvc" component="p" className="text-red-500 text-xs mt-1"/>
                    </div>
                </div>
                <formik_1.Field type="number" name="amount" className={"w-full p-2 border rounded ".concat(errors.amount && touched.amount ? 'border-red-500' : 'border-gray-300')}/>
                <button type="submit" disabled={!isValid || isSubmitting || parseFloat(values.amount) <= 0} className="w-full flex justify-center items-center bg-primary-600 text-white font-bold py-2 px-4 rounded-lg enabled:hover:bg-primary-700 disabled:bg-gray-400">
                    {isSubmitting ? <Icons_1.SpinnerIcon /> : "Pay $".concat(parseFloat(values.amount || '0').toFixed(2))}
                </button>
            </formik_1.Form>);
        }}
            </formik_1.Formik>
          </Card_1.default>
           <Card_1.default title="Saved Payment Methods">
               <div className="p-3 border rounded-lg flex justify-between items-center">
                   <div className="flex items-center"><Icons_1.CreditCardIcon className="w-6 h-6 mr-3 text-gray-500"/><div><p className="font-semibold">Visa **** 4242</p><p className="text-xs text-gray-500">Expires 12/26</p></div></div>
                   <button className="text-xs text-red-500 hover:underline">Remove</button>
               </div>
               <button className="w-full mt-4 text-sm font-semibold text-primary-600 hover:underline">+ Add new payment method</button>
           </Card_1.default>
           <Card_1.default title="Payment Settings">
               <div className="flex items-center justify-between">
                    <div>
                       <p className="font-medium text-gray-700">Enable Auto-Pay</p>
                       <p className="text-sm text-gray-500">Automatically pay your balance on the due date.</p>
                    </div>
                    <ToggleSwitch_1.default name="autoPay" checked={autoPay} onChange={function () { return setAutoPay(function (p) { return !p; }); }}/>
               </div>
           </Card_1.default>
        </div>
      </div>
      <ReceiptModal invoice={selectedReceipt} onClose={function () { return setSelectedReceipt(null); }}/>
    </div>);
};
exports.default = Payments;
