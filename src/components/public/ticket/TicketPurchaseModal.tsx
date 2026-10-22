'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Plus, Minus, AlertCircle, Sparkles } from 'lucide-react';
import { TicketCategoryType, PaymentChannelType, TicketOrderData } from '@/types/ticket';
import { TICKET_CATEGORIES, PAYMENT_CHANNELS } from '@/mocks/ticketConfig';
import { initialTeams } from '@/mocks/tournamentData';
import { TicketCategoryCard } from './TicketCategoryCard';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentCheckoutScreen } from './PaymentCheckoutScreen';
import { TicketSuccessPass } from './TicketSuccessPass';
import { SaumaArenaLogo } from '@/components/brand/SaumaArenaLogo';

interface TicketPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketGenerated?: (ticketCode: string, schoolName: string) => void;
}

type WizardStep = 'category' | 'details' | 'payment' | 'success';

export const TicketPurchaseModal: React.FC<TicketPurchaseModalProps> = ({
  isOpen,
  onClose,
  onTicketGenerated,
}) => {
  const [step, setStep] = useState<WizardStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<TicketCategoryType>('REGULER');
  const [quantity, setQuantity] = useState<number>(1);
  const [supportedTeamId, setSupportedTeamId] = useState<string>(initialTeams[0]?.id || '');
  const [buyerName, setBuyerName] = useState<string>('');
  const [buyerPhone, setBuyerPhone] = useState<string>('');
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannelType>('QRIS');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<TicketOrderData | null>(null);
  const [ticketCode, setTicketCode] = useState<string>('');

  if (!isOpen) return null;

  const currentCategoryObj = TICKET_CATEGORIES.find((c) => c.id === selectedCategory) || TICKET_CATEGORIES[0];
  const currentTeamObj = initialTeams.find((t) => t.id === supportedTeamId);

  const calculateTotal = () => {
    if (selectedCategory === 'ROMBONGAN') {
      // Paket 5 orang
      return currentCategoryObj.pricePerPerson * 5;
    }
    return currentCategoryObj.pricePerPerson * quantity;
  };

  const handleCategorySelect = (catId: TicketCategoryType) => {
    setSelectedCategory(catId);
    if (catId === 'ROMBONGAN') {
      setQuantity(5);
    } else {
      setQuantity(1);
    }
    setValidationError(null);
  };

  const handleIncreaseQty = () => {
    if (selectedCategory === 'ROMBONGAN') return;
    if (quantity < 10) setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQty = () => {
    if (selectedCategory === 'ROMBONGAN') return;
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleProceedToDetails = () => {
    setStep('details');
    setValidationError(null);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      setValidationError('Silakan masukkan nama lengkap pemesan tiket.');
      return;
    }
    if (!buyerPhone.trim() || buyerPhone.length < 9) {
      setValidationError('Silakan masukkan nomor WhatsApp aktif Anda (minimal 9 digit).');
      return;
    }
    setValidationError(null);

    const channelObj = PAYMENT_CHANNELS.find((p) => p.id === paymentChannel);
    const orderData: TicketOrderData = {
      orderId: `SA-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      category: selectedCategory,
      categoryName: currentCategoryObj.name,
      pricePerUnit: currentCategoryObj.pricePerPerson,
      quantity: selectedCategory === 'ROMBONGAN' ? 5 : quantity,
      totalAmount: calculateTotal(),
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      supportedTeamId: supportedTeamId,
      supportedTeamName: currentTeamObj?.schoolName || 'Suporter Umum',
      paymentChannel: paymentChannel,
      paymentChannelName: channelObj?.name || 'QRIS',
      status: 'PENDING_PAYMENT',
      createdAt: new Date().toISOString(),
    };

    setCreatedOrder(orderData);
    setStep('payment');
  };

  const handlePaymentSuccess = () => {
    if (!createdOrder) return;
    const team = initialTeams.find((t) => t.id === createdOrder.supportedTeamId);
    const code = `SA-TIK-${team?.shortName || 'GEN'}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketCode(code);

    if (onTicketGenerated) {
      onTicketGenerated(code, createdOrder.supportedTeamName);
    }
    setStep('success');
  };

  const handleResetFlow = () => {
    setStep('category');
    setSelectedCategory('REGULER');
    setQuantity(1);
    setBuyerName('');
    setBuyerPhone('');
    setPaymentChannel('QRIS');
    setCreatedOrder(null);
    setTicketCode('');
    setValidationError(null);
  };

  const handleCloseModal = () => {
    handleResetFlow();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-subtle)] max-w-3xl w-full p-5 sm:p-8 shadow-2xl space-y-6 my-auto animate-modalEnter">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <SaumaArenaLogo size="sm" variant="auto" />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[var(--text-main)] font-[var(--font-display)] tracking-tight leading-tight">
                Pemesanan Tiket Pertandingan
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                Milad Matsanega Futsal Competition I (MMFC I 2026)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            className="btn-tactile p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors"
            aria-label="Tutup jendela pemesanan tiket"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {validationError && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* STEP 1: PILIH KATEGORI & JUMLAH TIKET */}
        {step === 'category' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-[var(--text-main)] font-[var(--font-display)]">
                Langkah 1: Pilih Kategori Tiket &amp; Jumlah
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Pilih jenis tiket yang sesuai dengan kebutuhan Anda atau rombongan sekolah.
              </p>
            </div>

            {/* Grid Kartu Tiket */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {TICKET_CATEGORIES.map((cat) => (
                <TicketCategoryCard
                  key={cat.id}
                  category={cat}
                  isSelected={selectedCategory === cat.id}
                  onSelect={() => handleCategorySelect(cat.id)}
                />
              ))}
            </div>

            {/* Pemilihan Dukungan Tim Suporter */}
            <div className="p-4 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-subtle)] space-y-2">
              <label htmlFor="ticket-supporter" className="block text-xs font-bold text-[var(--text-main)]">
                Dukungan Suporter Madrasah / Sekolah
              </label>
              <select
                id="ticket-supporter"
                value={supportedTeamId}
                onChange={(e) => setSupportedTeamId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
              >
                {initialTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.schoolName} ({team.shortName})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-[var(--text-muted)] block leading-relaxed">
                Setiap tiket yang Anda gunakan di gate masuk akan otomatis menyumbangkan <strong>+1 poin suporter</strong> untuk sekolah yang Anda pilih di klasemen suporter!
              </span>
            </div>

            {/* Counter Jumlah Tiket & Ringkasan Total */}
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[var(--text-main)] block">
                  Jumlah Penonton:
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {selectedCategory === 'ROMBONGAN' ? 'Paket rombongan terkunci 5 tiket' : 'Maksimal 10 tiket per transaksi'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {selectedCategory !== 'ROMBONGAN' ? (
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={handleDecreaseQty}
                      className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--border-subtle)] transition-colors flex items-center justify-center font-bold"
                      aria-label="Kurangi tiket"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-black font-mono text-sm tabular-nums text-[var(--text-main)]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncreaseQty}
                      className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--border-subtle)] transition-colors flex items-center justify-center font-bold"
                      aria-label="Tambah tiket"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-[var(--color-arena-primary-light)] text-[var(--color-arena-primary)] border border-[var(--border-subtle)]">
                    5 Tiket Rombongan
                  </span>
                )}

                <div className="text-right pl-3 border-l border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase font-mono font-bold block">
                    Total Biaya
                  </span>
                  <span className="text-lg sm:text-xl font-black font-mono text-[var(--color-arena-primary)] tabular-nums">
                    Rp {calculateTotal().toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Tombol Lanjut */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={handleCloseModal}
                className="btn-tactile px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-muted)] transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleProceedToDetails}
                className="btn-tactile px-6 py-2.5 rounded-xl text-xs font-extrabold bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white shadow-xs transition-colors flex items-center gap-1.5 min-h-[42px]"
              >
                <span>Lanjut ke Data Pemesan &amp; Pembayaran</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DATA PEMESAN & PEMILIHAN METODE PEMBAYARAN */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="space-y-6 animate-fadeIn">
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-[var(--text-main)] font-[var(--font-display)]">
                Langkah 2: Data Pemesan &amp; Metode Bayar
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Tiket resmi akan dikirimkan otomatis ke nomor WhatsApp yang Anda masukkan.
              </p>
            </div>

            {/* Input Data Pemesan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
              <div>
                <label htmlFor="buyer-name" className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
                  Nama Lengkap Pemesan <span className="text-red-500">*</span>
                </label>
                <input
                  id="buyer-name"
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
                />
              </div>

              <div>
                <label htmlFor="buyer-phone" className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
                  Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                </label>
                <input
                  id="buyer-phone"
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] text-xs sm:text-sm font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-arena-primary)]"
                />
                <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                  Digunakan untuk menerima barcode E-Tiket dan pengingat jadwal kick-off.
                </span>
              </div>
            </div>

            {/* Selector Metode Gateway Indonesia */}
            <PaymentMethodSelector
              selectedChannel={paymentChannel}
              onSelectChannel={(ch) => setPaymentChannel(ch)}
            />

            {/* Ringkasan & Tombol Aksi */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => setStep('category')}
                className="btn-tactile px-4 py-2.5 rounded-xl text-xs font-bold border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Ubah Kategori Tiket</span>
              </button>

              <button
                type="submit"
                className="btn-tactile px-6 py-2.5 rounded-xl text-xs font-extrabold bg-[var(--color-arena-primary)] hover:bg-[var(--color-arena-primary-hover)] text-white shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[42px]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Lanjut Bayar (Rp {calculateTotal().toLocaleString('id-ID')})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SCREEN PEMBAYARAN GATEWAY */}
        {step === 'payment' && createdOrder && (
          <PaymentCheckoutScreen
            order={createdOrder}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={() => setStep('details')}
          />
        )}

        {/* STEP 4: SUKSES & E-TIKET DIGITAL PASS */}
        {step === 'success' && createdOrder && (
          <TicketSuccessPass
            order={createdOrder}
            ticketCode={ticketCode}
            onReset={handleResetFlow}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};
