export type TicketCategoryType = 'REGULER' | 'ROMBONGAN' | 'PELAJAR' | 'VIP';

export interface TicketCategoryItem {
  id: TicketCategoryType;
  name: string;
  badge?: string;
  pricePerPerson: number;
  minQty: number;
  defaultQty: number;
  description: string;
  benefits: string[];
}

export type PaymentChannelType = 'QRIS' | 'VA_BCA' | 'VA_MANDIRI' | 'VA_BRI' | 'VA_BNI' | 'GOPAY' | 'DANA' | 'OVO' | 'SHOPEEPAY' | 'CASH_GATE';

export interface PaymentChannelItem {
  id: PaymentChannelType;
  name: string;
  group: 'QRIS' | 'VA' | 'EWALLET' | 'CASH';
  desc: string;
  badge?: string;
  fee: number;
}

export interface TicketOrderData {
  orderId: string;
  category: TicketCategoryType;
  categoryName: string;
  pricePerUnit: number;
  quantity: number;
  totalAmount: number;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  supportedTeamId: string;
  supportedTeamName: string;
  paymentChannel: PaymentChannelType;
  paymentChannelName: string;
  vaNumber?: string;
  status: 'PENDING_PAYMENT' | 'PAID' | 'USED';
  createdAt: string;
}
