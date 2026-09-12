import React from 'react';
import { Order, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { buildConfirmedOrderWhatsAppUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  ArrowRight, 
  Copy, 
  Check, 
  Mail, 
  FileText 
} from 'lucide-react';

interface OrderConfirmationPageProps {
  order: Order;
  currency: CurrencyCode;
  onContinueShopping: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  currency,
  onContinueShopping,
}) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const whatsappInquiryUrl = buildConfirmedOrderWhatsAppUrl(
    order.id,
    order.item.productName,
    order.totalPKR
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2B231E] py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Main Success Hero Card */}
        <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 sm:p-10 shadow-sm text-center space-y-4">
          
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-[#FAF8F5] border border-[#C9A468]/40 flex items-center justify-center text-[#C9A468] shadow-xs">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-[#25D366]" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Order Received</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium sm:font-semibold text-[#2B231E] pt-1">
              Order Placed Successfully
            </h1>
            <p className="text-sm sm:text-base text-[#8D7B68] font-sans max-w-xl mx-auto leading-relaxed">
              Thank you for choosing NOORBAL. We have received your order and our concierge will contact you on WhatsApp or phone for confirmation.
            </p>
          </div>

          {/* Prominent Order Number Badge */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-5 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5]">
            <span className="text-xs font-sans text-gray-500 font-medium">Order Number:</span>
            <span className="font-mono text-lg sm:text-xl font-bold text-[#2B231E] tracking-wider">
              {order.id}
            </span>
            <button
              type="button"
              onClick={handleCopyOrderId}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-sans text-gray-500 hover:text-[#2B231E] rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              title="Copy Order ID"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Dispatch Verification Notice */}
          <div className="p-4 rounded-xl bg-[#FAF8F5]/90 border border-[#E5DFD5] text-xs text-[#8D7B68] max-w-md mx-auto leading-relaxed">
            <strong className="text-[#2B231E] block mb-0.5">Atelier Dispatch Call</strong>
            Our concierge will contact you on <strong>{order.customer.phone}</strong> to verify the parcel details before dispatch.
          </div>

        </div>

        {/* Order Details Breakdown Grid */}
        <div className="bg-white rounded-2xl border border-[#E5DFD5] p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5]">
            <h2 className="font-serif text-lg sm:text-xl font-medium sm:font-semibold text-[#2B231E]">
              Order Summary &amp; Status
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3.5 h-3.5" />
              <span>Status: {order.orderStatus}</span>
            </span>
          </div>

          {/* Purchased Item Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 rounded-lg bg-white border border-[#E5DFD5] overflow-hidden shrink-0">
                <img
                  src={order.item.heroImage}
                  alt={order.item.productName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-sm font-medium sm:font-semibold text-[#2B231E]">
                  {order.item.productName}
                </h3>
                <p className="text-xs text-[#8D7B68] font-sans">
                  Product ID: <span className="font-mono text-[#2B231E]">{order.item.productId}</span> · Size: <strong className="text-[#2B231E]">{order.item.size}</strong> · Qty: <strong className="text-[#2B231E]">{order.item.quantity}</strong>
                </p>
                <p className="text-[11px] text-gray-500 font-sans">
                  {order.orderType === 'ready-stock' ? 'Ready-Stock (2–3 Days Express)' : 'Made-to-Order Heirloom'}
                </p>
              </div>
            </div>

            <div className="sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200">
              <span className="text-xs text-gray-500 font-sans block">Total Item Amount</span>
              <span className="font-sans text-base sm:text-lg font-bold text-[#2B231E]">
                {formatPrice(order.totalPKR, currency)}
              </span>
            </div>

          </div>

          {/* Customer & Destination Specs in 2-Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* Customer Details */}
            <div className="p-4 rounded-xl border border-[#E5DFD5] space-y-2">
              <div className="flex items-center gap-1.5 text-[#C9A468] font-bold uppercase tracking-wider">
                <Phone className="w-3.5 h-3.5" />
                <span>Customer Contact</span>
              </div>
              <p className="font-semibold text-sm text-[#2B231E]">{order.customer.fullName}</p>
              <p className="text-gray-600">
                Mobile / WhatsApp: <strong className="text-[#2B231E]">{order.customer.phone}</strong>
              </p>
              {order.customer.email ? (
                <p className="text-gray-600 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <span>{order.customer.email}</span>
                </p>
              ) : (
                <p className="text-gray-400 italic">No email provided</p>
              )}
            </div>

            {/* Destination */}
            <div className="p-4 rounded-xl border border-[#E5DFD5] space-y-2">
              <div className="flex items-center gap-1.5 text-[#C9A468] font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Complete Delivery Address</span>
              </div>
              <p className="text-gray-800 leading-relaxed font-medium">
                {order.customer.address}
                <br />
                {order.customer.area}, {order.customer.city}
                <br />
                {order.customer.province}, {order.customer.country}
                <br />
                Postal Code: <span className="font-mono text-gray-600">{order.customer.postalCode}</span>
              </p>
            </div>

          </div>

          {/* Order Notes if provided */}
          {order.customer.orderNotes && (
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-[#C9A468] font-bold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                <span>Order Notes</span>
              </div>
              <p className="text-gray-700 italic">{order.customer.orderNotes}</p>
            </div>
          )}

          {/* Custom Measurements if provided */}
          {order.item.customMeasurements && (
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-1.5 text-xs">
              <span className="font-semibold text-[#2B231E] block">Bespoke Tailoring Measurements:</span>
              <div className="grid grid-cols-3 gap-2 text-gray-700">
                {order.item.customMeasurements.chest && <div>Chest: {order.item.customMeasurements.chest}&quot;</div>}
                {order.item.customMeasurements.waist && <div>Waist: {order.item.customMeasurements.waist}&quot;</div>}
                {order.item.customMeasurements.length && <div>Length: {order.item.customMeasurements.length}&quot;</div>}
              </div>
            </div>
          )}

        </div>

        {/* Action Buttons: Continue Shopping (Primary) + Optional WhatsApp Support (Secondary) */}
        <div className="space-y-4">
          
          <button
            type="button"
            onClick={onContinueShopping}
            className="w-full py-4 px-6 bg-[#2B231E] hover:bg-[#3D322B] text-white font-sans text-xs sm:text-sm uppercase tracking-widest font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary WhatsApp Support Channel */}
          <div className="text-center pt-2">
            <p className="text-xs text-[#8D7B68] mb-2">
              Need assistance with your confirmed order?
            </p>
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E5DFD5] bg-white hover:bg-gray-50 text-xs font-semibold text-[#2B231E] transition-colors shadow-xs"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span>Contact Concierge on WhatsApp (Order #{order.id})</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
