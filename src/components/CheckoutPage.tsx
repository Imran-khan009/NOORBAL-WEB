import React, { useState } from 'react';
import { CheckoutItem, CustomerInfo, CurrencyCode, Order } from '../types';
import { PAKISTAN_PROVINCES } from '../data/pakistanRegions';
import { formatPrice } from '../utils/currency';
import { generateOrderNumber } from '../utils/orders';
import { buildOrderInquiryWhatsAppUrl } from '../utils/whatsapp';
import { getApiUrl } from '../utils/api';
import { WhatsAppIcon } from './WhatsAppIcon';
import { 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Truck, 
  Clock, 
  ChevronRight, 
  AlertCircle, 
  Sparkles,
  Edit3,
  ShoppingBag,
  AlertTriangle
} from 'lucide-react';

interface CheckoutPageProps {
  checkoutItem: CheckoutItem;
  currency: CurrencyCode;
  onBackToStore: () => void;
  onOrderPlaced: (order: Order) => void;
  onUpdateQuantity: (quantity: number) => void;
  onUpdateSize: (size: string) => void;
}

type CheckoutStep = 1 | 2 | 3;

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  checkoutItem,
  currency,
  onBackToStore,
  onOrderPlaced,
  onUpdateQuantity,
  onUpdateSize,
}) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<{
    message: string;
  } | null>(null);

  // Form State
  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    email: '',
    country: 'Pakistan',
    province: 'Sindh',
    city: 'Karachi',
    area: '',
    address: '',
    postalCode: '',
    orderNotes: '',
  });

  // Custom city typing when "Other City" is chosen
  const [customCity, setCustomCity] = useState('');

  // Custom measurement fields if custom size
  const [customMeasurements, setCustomMeasurements] = useState({
    chest: checkoutItem.customMeasurements?.chest || '',
    waist: checkoutItem.customMeasurements?.waist || '',
    length: checkoutItem.customMeasurements?.length || '',
    notes: checkoutItem.customMeasurements?.notes || '',
  });

  // Field validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { product, size, quantity } = checkoutItem;
  const isClothing = product.category === 'balochi-heritage' || product.category === 'women' || product.category === 'men';
  const isCustomSize = size.toLowerCase().includes('custom');

  // Pricing calculations
  const subtotalPKR = product.pricePKR * quantity;
  const deliveryFeePKR = 0; // Free Nationwide Express delivery for luxury service
  const grandTotalPKR = subtotalPKR + deliveryFeePKR;

  // Selected province data
  const selectedProvinceData = PAKISTAN_PROVINCES.find((p) => p.name === customer.province) || PAKISTAN_PROVINCES[0];

  const handleProvinceChange = (newProvinceName: string) => {
    const prov = PAKISTAN_PROVINCES.find((p) => p.name === newProvinceName) || PAKISTAN_PROVINCES[0];
    setCustomer((prev) => ({
      ...prev,
      province: prov.name,
      city: prov.popularCities[0],
    }));
    setCustomCity('');
    // clear errors
    if (errors.province) setErrors((prev) => ({ ...prev, province: '' }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!customer.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    if (!customer.phone.trim()) {
      newErrors.phone = 'Please enter your mobile number.';
    } else if (customer.phone.replace(/[\s-]/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid Pakistani mobile number (e.g. 0300 1234567).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const effectiveCity = customer.city === 'Other City' ? customCity.trim() : customer.city.trim();
    if (!effectiveCity) {
      newErrors.city = 'Please select or enter your city.';
    }

    if (!customer.area.trim()) {
      newErrors.area = 'Please enter your area or locality.';
    }

    if (!customer.address.trim()) {
      newErrors.address = 'Please complete your delivery address.';
    }

    if (!customer.postalCode.trim()) {
      newErrors.postalCode = 'Please enter your postal code.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleFinalPlaceOrder = async () => {
    setSubmissionError(null);
    setIsSubmitting(true);

    const effectiveCity = customer.city === 'Other City' ? customCity.trim() : customer.city.trim();
    const finalCustomerInfo: CustomerInfo = {
      ...customer,
      city: effectiveCity,
    };

    const finalItem: CheckoutItem = {
      ...checkoutItem,
      customMeasurements: isCustomSize ? customMeasurements : undefined,
    };

    const orderNumber = generateOrderNumber();

    try {
      const response = await fetch(getApiUrl('/api/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item: {
            productId: finalItem.product.id,
            productName: finalItem.product.name,
            variant: finalItem.product.subtitle,
            size: finalItem.size || 'Standard',
            quantity: finalItem.quantity,
            unitPricePKR: finalItem.product.pricePKR,
            heroImage: finalItem.product.heroImage,
            customMeasurements: finalItem.customMeasurements,
          },
          customer: finalCustomerInfo,
          deliveryFeePKR,
          orderNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to process order.');
      }

      const savedOrder: Order = {
        id: data.order?.id || orderNumber,
        supabaseId: data.order?.supabaseId,
        item: {
          productId: finalItem.product.id,
          productName: finalItem.product.name,
          variant: finalItem.product.subtitle,
          size: finalItem.size || 'Standard',
          quantity: finalItem.quantity,
          unitPricePKR: finalItem.product.pricePKR,
          subtotalPKR: finalItem.product.pricePKR * finalItem.quantity,
          heroImage: finalItem.product.heroImage,
          status: finalItem.product.status,
          customMeasurements: finalItem.customMeasurements,
        },
        deliveryFeePKR,
        totalPKR: finalItem.product.pricePKR * finalItem.quantity + deliveryFeePKR,
        customer: finalCustomerInfo,
        orderType: finalItem.product.status,
        orderStatus: 'Pending',
        createdAt: data.order?.createdAt || new Date().toISOString(),
      };

      setIsSubmitting(false);
      onOrderPlaced(savedOrder);
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmissionError({
        message:
          'We were unable to complete your order right now. Please check your network connection or message our concierge on WhatsApp to place your order directly.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2B231E] pb-16">
      
      {/* Checkout Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5DFD5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#8D7B68] hover:text-[#2B231E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Store</span>
          </button>

          <div className="text-center">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#2B231E]">
              NOORBAL
            </span>
            <span className="hidden sm:block text-[10px] text-[#C9A468] uppercase tracking-widest font-semibold">
              Bespoke Checkout
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#8D7B68]">
            <ShieldCheck className="w-4 h-4 text-[#C9A468]" />
            <span className="text-[11px] font-medium hidden sm:inline">Secure Checkout</span>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">

        {/* Checkout Progress Stepper */}
        <nav aria-label="Checkout Steps" className="mb-8 bg-white rounded-xl border border-[#E5DFD5] p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 text-left transition-colors ${
                currentStep === 1 
                  ? 'text-[#2B231E] font-bold' 
                  : currentStep > 1 
                    ? 'text-[#C9A468] font-semibold' 
                    : 'text-gray-400'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-sans transition-all ${
                currentStep > 1 
                  ? 'bg-[#C9A468] text-white' 
                  : currentStep === 1 
                    ? 'bg-[#2B231E] text-white' 
                    : 'bg-gray-100 text-gray-500'
              }`}>
                {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
              </span>
              <span className="hidden sm:inline text-xs">Customer</span>
            </button>

            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => {
                if (validateStep1()) setCurrentStep(2);
              }}
              className={`flex items-center gap-2 text-left transition-colors ${
                currentStep === 2 
                  ? 'text-[#2B231E] font-bold' 
                  : currentStep > 2 
                    ? 'text-[#C9A468] font-semibold' 
                    : 'text-gray-400'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-sans transition-all ${
                currentStep > 2 
                  ? 'bg-[#C9A468] text-white' 
                  : currentStep === 2 
                    ? 'bg-[#2B231E] text-white' 
                    : 'bg-gray-100 text-gray-500'
              }`}>
                {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
              </span>
              <span className="hidden sm:inline text-xs">Delivery</span>
            </button>

            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => {
                if (validateStep1() && validateStep2()) setCurrentStep(3);
              }}
              className={`flex items-center gap-2 text-left transition-colors ${
                currentStep === 3 
                  ? 'text-[#2B231E] font-bold' 
                  : 'text-gray-400'
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-sans transition-all ${
                currentStep === 3 
                  ? 'bg-[#2B231E] text-white' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                3
              </span>
              <span className="hidden sm:inline text-xs">Review & Confirm</span>
            </button>

          </div>
        </nav>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Column (Steps 1, 2, or 3) */}
          <div className="lg:col-span-7 space-y-6">

            {/* STEP 1: CUSTOMER DETAILS */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl border border-[#E5DFD5] p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9A468]">
                    Step 1 of 3
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2B231E] mt-0.5">
                    Customer Information
                  </h2>
                  <p className="text-xs sm:text-sm text-[#8D7B68] mt-1">
                    Please provide your contact details for order confirmation and parcel dispatch.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="customer-fullName" className="block text-xs font-semibold text-[#2B231E] uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="customer-fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Fatima Zehra / Mir Baloch"
                      value={customer.fullName}
                      onChange={(e) => {
                        setCustomer({ ...customer, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                      }}
                      className={`w-full px-4 py-3 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                        errors.fullName 
                          ? 'border-rose-400 focus:ring-rose-200' 
                          : 'border-[#E5DFD5] focus:border-[#C9A468] focus:ring-[#C9A468]/20'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="flex items-center gap-1 text-xs text-rose-600 mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Mobile / WhatsApp Number */}
                  <div>
                    <label htmlFor="customer-phone" className="block text-xs font-semibold text-[#2B231E] uppercase tracking-wider mb-1.5">
                      Mobile / WhatsApp Number <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="customer-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="0300 1234567"
                      value={customer.phone}
                      onChange={(e) => {
                        setCustomer({ ...customer, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      className={`w-full px-4 py-3 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                        errors.phone 
                          ? 'border-rose-400 focus:ring-rose-200' 
                          : 'border-[#E5DFD5] focus:border-[#C9A468] focus:ring-[#C9A468]/20'
                      }`}
                    />
                    {errors.phone ? (
                      <p className="flex items-center gap-1 text-xs text-rose-600 mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-gray-500 mt-1">
                        Our team will contact this number to verify dispatch before courier delivery.
                      </p>
                    )}
                  </div>

                  {/* Email Address (Optional) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="customer-email" className="block text-xs font-semibold text-[#2B231E] uppercase tracking-wider">
                        Email Address
                      </label>
                      <span className="text-[11px] text-[#8D7B68]">Optional</span>
                    </div>
                    <input
                      id="customer-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={customer.email || ''}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded-xl border border-[#E5DFD5] bg-white focus:outline-none focus:border-[#C9A468] focus:ring-2 focus:ring-[#C9A468]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full py-4 px-6 bg-[#2B231E] hover:bg-[#3D322B] text-white font-sans text-xs sm:text-sm uppercase tracking-widest font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Continue to Delivery Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DELIVERY DETAILS */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl border border-[#E5DFD5] p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9A468]">
                      Step 2 of 3
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-semibold text-[#8D7B68] hover:text-[#2B231E] flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Customer Info</span>
                    </button>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2B231E] mt-0.5">
                    Delivery Address
                  </h2>
                  <p className="text-xs sm:text-sm text-[#8D7B68] mt-1">
                    Shipment destination across Pakistan. Standard express delivery takes 2–3 business days.
                  </p>
                </div>

                <div className="space-y-4">
                  
                  {/* Country (Default Pakistan) */}
                  <div>
                    <label htmlFor="country-select" className="block text-xs font-semibold text-[#2B231E] uppercase tracking-wider mb-1.5">
                      Country
                    </label>
                    <input
                      id="country-select"
                      type="text"
                      readOnly
                      value="Pakistan"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-[#E5DFD5] bg-gray-50 text-gray-700 cursor-not-allowed font-medium"
                    />
                  </div>

                  {/* Province & City in 2-Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Province */}
                    <div>
                      <label htmlFor="province-select" className="block text-xs font-semibold text-[#2B231E] uppercase tracking-wider mb-1.5">
                        Province / State <span className="text-rose-600">*</span>
                      </label>
                      <select
                        id="province-select"
                        value={customer.province}
                        onChange={(e) => handleProvinceChange(e.target.value)}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-[#E5DFD5] bg-white focus:outline-none focus:border-[#C9A468] focus:ring-2 focus:ring-[#C9A468]/20 cursor-pointer"
                      >
                        {PAKISTAN_PROVINCES.map((prov) => (
                          <option key={prov.id} value={prov.name}>
                            {prov.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City (Dynamic options according to province) */}
                    <div>
                      <label htmlFor="city-select" className="block text-xs font-semibold text-[#2B231E] uppercase tracking-wider mb-1.5">
                        City <span className="text-rose-600">*</span>
                      </label>
                      <select
                        id="city-select"
                        value={customer.city}
                        onChange={(e) => {
                          setCustomer({ ...customer, city: e.target.value });
                          if (errors.city) setErrors({ ...errors, city: '' });
                        }}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-[#E5DFD5] bg-white focus:outline-none focus:border-[#C9A468] focus:ring-2 focus:ring-[#C9A468]/20 cursor-pointer"
                      >
                        {selectedProvinceData.popularCities.map((cityName) => (
                          <option key={cityName} value={cityName}>
                            {cityName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Custom city input if "Other City" was chosen */}
                  {customer.city === 'Other City' && (
                    <div>
                      <label htmlFor="custom-city-input" className="block text-xs font-semibold text-[#2B231E] uppercase tracking-wider mb-1.5">
                        Enter City Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="custom-city-input"
                        type="text"
                        placeholder="Enter your town / city"
                        value={customCity}
                        onChange={(e) => {
                          setCustomCity(e.target.value);
                          if (errors.city) setErrors({ ...errors, city: '' });
                        }}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-[#E5DFD5] bg-white focus:outline-none focus:border-[#C9A468] focus:ring-2 focus:ring-[#C9A468]/20"
                      />
                      {errors.city && (
                        <p className="flex items-center gap-1 text-xs text-rose-600 mt-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.city}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Area / Locality */}
                  <div>
                    <label htmlFor="customer-area" className="block text-xs font-semibold text-[#2B231E] uppercase tracking-wider mb-1.5">
                      Area / Locality / Sector <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="customer-area"
                      type="text"
                      placeholder="e.g. Clifton Block 4 / DHA Phase 5 / Satellite Town"
                      value={customer.area}
                      onChange={(e) => {
                        setCustomer({ ...customer, area: e.target.value });
                        if (errors.area) setErrors({ ...errors, area: '' });
                      }}
                      className={`w-full px-4 py-3 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                        errors.area 
                          ? 'border-rose-400 focus:ring-rose-200' 
                          : 'border-[#E5DFD5] focus:border-[#C9A468] focus:ring-[#C9A468]/20'
                      }`}
                    />
                    {errors.area && (
                      <p className="flex items-center gap-1 text-xs text-rose-600 mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.area}</span>
                      </p>
                    )}
                  </div>

                  {/* Complete Address */}
                  <div>
                    <label htmlFor="customer-address" className="block text-xs font-semibold text-[#2B231E] uppercase tracking-wider mb-1.5">
                      Complete Delivery Address <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      id="customer-address"
                      rows={3}
                      placeholder="House / Street / Area / Landmark"
                      value={customer.address}
                      onChange={(e) => {
                        setCustomer({ ...customer, address: e.target.value });
                        if (errors.address) setErrors({ ...errors, address: '' });
                      }}
                      className={`w-full px-4 py-3 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                        errors.address 
                          ? 'border-rose-400 focus:ring-rose-200' 
                          : 'border-[#E5DFD5] focus:border-[#C9A468] focus:ring-[#C9A468]/20'
                      }`}
                    />
                    {errors.address && (
                      <p className="flex items-center gap-1 text-xs text-rose-600 mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.address}</span>
                      </p>
                    )}
                  </div>

                  {/* Postal / ZIP Code */}
                  <div>
                    <label htmlFor="customer-postalCode" className="block text-xs font-semibold text-[#2B231E] uppercase tracking-wider mb-1.5">
                      Postal / ZIP Code <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="customer-postalCode"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="e.g. 75600 or 44000"
                      value={customer.postalCode}
                      onChange={(e) => {
                        setCustomer({ ...customer, postalCode: e.target.value });
                        if (errors.postalCode) setErrors({ ...errors, postalCode: '' });
                      }}
                      className={`w-full px-4 py-3 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                        errors.postalCode 
                          ? 'border-rose-400 focus:ring-rose-200' 
                          : 'border-[#E5DFD5] focus:border-[#C9A468] focus:ring-[#C9A468]/20'
                      }`}
                    />
                    {errors.postalCode && (
                      <p className="flex items-center gap-1 text-xs text-rose-600 mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.postalCode}</span>
                      </p>
                    )}
                  </div>

                  {/* Optional Custom Size Fields if "Custom Size" is selected */}
                  {isCustomSize && (
                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C9A468]" />
                        <h4 className="font-serif text-sm font-bold text-[#2B231E]">
                          Bespoke Sizing Measurements (Inches)
                        </h4>
                      </div>
                      <p className="text-xs text-[#8D7B68]">
                        Since you chose &quot;Custom Size&quot;, our master tailors can craft your piece precisely. You can provide measurements now or confirm via phone/WhatsApp.
                      </p>

                      <div className="grid grid-cols-3 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Bust/Chest (in)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 38"
                            value={customMeasurements.chest}
                            onChange={(e) => setCustomMeasurements({ ...customMeasurements, chest: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5DFD5] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Waist (in)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 32"
                            value={customMeasurements.waist}
                            onChange={(e) => setCustomMeasurements({ ...customMeasurements, waist: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5DFD5] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Length (in)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 48"
                            value={customMeasurements.length}
                            onChange={(e) => setCustomMeasurements({ ...customMeasurements, length: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5DFD5] bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Notes / Special Instructions */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="customer-orderNotes" className="block text-xs font-semibold text-[#2B231E] uppercase tracking-wider">
                        Order Notes / Special Instructions
                      </label>
                      <span className="text-[11px] text-[#8D7B68]">Optional</span>
                    </div>
                    <textarea
                      id="customer-orderNotes"
                      rows={2}
                      placeholder="e.g. Call before delivery, leave with guard, preferred delivery hours, etc."
                      value={customer.orderNotes || ''}
                      onChange={(e) => setCustomer({ ...customer, orderNotes: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded-xl border border-[#E5DFD5] bg-white focus:outline-none focus:border-[#C9A468] focus:ring-2 focus:ring-[#C9A468]/20 transition-all"
                    />
                  </div>

                </div>

                {/* Step 2 Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="w-full sm:w-auto px-5 py-3.5 border border-[#E5DFD5] text-[#2B231E] text-xs uppercase tracking-wider font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full sm:flex-1 py-4 px-6 bg-[#2B231E] hover:bg-[#3D322B] text-white font-sans text-xs sm:text-sm uppercase tracking-widest font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Review Order</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ORDER REVIEW */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl border border-[#E5DFD5] p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9A468]">
                    Step 3 of 3
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2B231E] mt-0.5">
                    Review & Confirm Order
                  </h2>
                  <p className="text-xs sm:text-sm text-[#8D7B68] mt-1">
                    Please verify your details before final order submission. Cash on Delivery / Bank verification available.
                  </p>
                </div>

                {/* Review Cards */}
                <div className="space-y-4">
                  
                  {/* Customer & Contact Summary */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#C9A468]">
                        Customer Contact
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-xs font-semibold text-[#2B231E] underline hover:text-[#C9A468] transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-[#2B231E]">{customer.fullName}</p>
                    <p className="text-xs text-gray-600">
                      Mobile / WhatsApp: <strong className="text-[#2B231E]">{customer.phone}</strong>
                    </p>
                    {customer.email && (
                      <p className="text-xs text-gray-600">Email: {customer.email}</p>
                    )}
                  </div>

                  {/* Delivery Address Summary */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#C9A468]">
                        Delivery Destination
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-xs font-semibold text-[#2B231E] underline hover:text-[#C9A468] transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-[#2B231E] font-medium leading-relaxed">
                      {customer.address}
                      <br />
                      {customer.area}, {customer.city === 'Other City' ? customCity : customer.city}, {customer.province} ({customer.postalCode})
                      <br />
                      {customer.country}
                    </p>
                    {customer.orderNotes && (
                      <p className="text-xs text-gray-500 italic mt-1 pt-1 border-t border-gray-200">
                        Notes: {customer.orderNotes}
                      </p>
                    )}
                  </div>

                  {/* Payment Method Notice */}
                  <div className="p-4 rounded-xl bg-white border border-[#E5DFD5] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#2B231E]">
                        Payment Method
                      </span>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Cash on Delivery (COD) / Direct Bank Transfer confirmed upon verification call.
                      </p>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-[#C9A468] shrink-0" />
                  </div>

                  {/* Submission Error Alert */}
                  {submissionError && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1 text-xs">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-amber-800 text-xs leading-relaxed">
                          {submissionError.message}
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                {/* Action Buttons: EDIT DETAILS and ORDER NOW */}
                <div className="pt-4 space-y-3">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalPlaceOrder}
                    className="w-full py-4 px-6 bg-[#2B231E] hover:bg-[#3D322B] text-white font-sans text-xs sm:text-sm uppercase tracking-widest font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Placing Your Order...</span>
                      </span>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#DFBF88]" />
                        <span>ORDER NOW</span>
                      </>
                    )}
                  </button>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs text-[#8D7B68] hover:text-[#2B231E] font-medium underline"
                    >
                      Edit Delivery Details
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Right Column: PRODUCT SUMMARY & PRICING BREAKDOWN */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl border border-[#E5DFD5] p-5 sm:p-6 shadow-sm space-y-5 lg:sticky lg:top-24">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5]">
                <h3 className="font-serif text-base font-bold text-[#2B231E]">
                  Order Summary
                </h3>
                <span className="text-xs text-[#8D7B68]">
                  {quantity} item{quantity > 1 ? 's' : ''}
                </span>
              </div>

              {/* Product Thumbnail & Variant */}
              <div className="flex gap-4">
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] overflow-hidden shrink-0">
                  <img
                    src={product.heroImage}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <h4 className="font-serif text-sm font-bold text-[#2B231E] leading-snug">
                    {product.name}
                  </h4>
                  <p className="text-xs text-[#8D7B68] truncate">
                    {product.subtitle}
                  </p>

                  {/* Size pill */}
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="font-semibold text-gray-700">Size:</span>
                    {product.sizes.length > 1 ? (
                      <select
                        value={size}
                        onChange={(e) => onUpdateSize(e.target.value)}
                        className="px-2 py-1 text-xs rounded border border-[#E5DFD5] bg-[#FAF8F5] font-medium text-[#2B231E] cursor-pointer"
                      >
                        {product.sizes.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5DFD5] text-[11px] font-semibold text-[#2B231E]">
                        {size}
                      </span>
                    )}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="font-semibold text-gray-700">Quantity:</span>
                    <div className="inline-flex items-center border border-[#E5DFD5] rounded-lg bg-white">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(Math.max(1, quantity - 1))}
                        className="px-2.5 py-0.5 text-xs text-gray-600 hover:bg-gray-100 rounded-l-lg"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-semibold text-[#2B231E]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(quantity + 1)}
                        className="px-2.5 py-0.5 text-xs text-gray-600 hover:bg-gray-100 rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ready Stock vs Made-to-Order badge & lead time in checkout */}
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-1">
                <div className="flex items-center gap-1.5">
                  {product.status === 'ready-stock' ? (
                    <>
                      <Truck className="w-3.5 h-3.5 text-[#25D366]" />
                      <span className="text-xs font-bold text-[#2B231E]">Ready to ship</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-[#C9A468]" />
                      <span className="text-xs font-bold text-[#2B231E]">Made to order</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-gray-600">
                  {product.status === 'ready-stock'
                    ? '2–3 Days Express Nationwide Delivery'
                    : 'Handcrafted on order · Production timeline confirmed before dispatch.'}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-3 border-t border-[#E5DFD5] text-xs">
                
                <div className="flex justify-between text-gray-600">
                  <span>Unit Price</span>
                  <span className="font-medium text-[#2B231E]">
                    {formatPrice(product.pricePKR, currency)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
                  <span className="font-medium text-[#2B231E]">
                    {formatPrice(subtotalPKR, currency)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="text-[#25D366] font-semibold">
                    Free Express
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-[#E5DFD5]">
                  <div>
                    <span className="font-sans text-sm font-bold text-[#2B231E]">Grand Total</span>
                    <p className="text-[10px] text-gray-500 font-sans">Includes all handling & packaging</p>
                  </div>
                  <div className="text-right">
                    <span className="font-sans text-lg sm:text-xl font-bold text-[#2B231E]">
                      {formatPrice(grandTotalPKR, currency)}
                    </span>
                    {currency !== 'PKR' && (
                      <p className="text-[10px] text-gray-400 font-sans">
                        (PKR {grandTotalPKR.toLocaleString()})
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* Secondary WhatsApp Help Option */}
              <div className="pt-2 border-t border-[#E5DFD5]">
                <a
                  href={buildOrderInquiryWhatsAppUrl(product, size, quantity)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs flex items-center justify-center gap-2 border border-gray-200 transition-colors"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Questions about this piece? Chat on WhatsApp</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};
