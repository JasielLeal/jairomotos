export type RevenueTrendPoint = {
  month: string;
  receitaCents: number;
  despesaCents: number;
};

export type InvoiceStatusBreakdownItem = {
  status: string;
  count: number;
  percent: number;
};

export type TopPerformer = {
  userId: string;
  name: string;
  invoiceCount: number;
  totalCents: number;
};
