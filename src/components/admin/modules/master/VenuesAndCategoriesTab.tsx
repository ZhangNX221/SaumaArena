'use client';

import React from 'react';
import { CategoriesManagementView } from './CategoriesManagementView';
import { VenuesManagementView } from './VenuesManagementView';
import { SportConfig, Venue } from '@/types';

export const CategoriesTab: React.FC<{
  sports: SportConfig[];
  onOpenAddModal?: () => void;
}> = ({ sports, onOpenAddModal }) => {
  return <CategoriesManagementView sports={sports} onOpenAddSportModal={onOpenAddModal} />;
};

export const VenuesTab: React.FC<{
  venues: Venue[];
}> = ({ venues }) => {
  return <VenuesManagementView venues={venues} />;
};
