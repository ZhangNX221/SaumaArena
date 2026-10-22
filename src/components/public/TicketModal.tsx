'use client';

import React from 'react';
import { TicketPurchaseModal } from './ticket/TicketPurchaseModal';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketGenerated?: (ticketCode: string, schoolName: string) => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  onTicketGenerated,
}) => {
  return (
    <TicketPurchaseModal
      isOpen={isOpen}
      onClose={onClose}
      onTicketGenerated={onTicketGenerated}
    />
  );
};
