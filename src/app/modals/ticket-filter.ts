export interface TicketFilter {
  startDate: string;
  endDate: string;
  filterType: 'today' | 'weekly' | 'monthly' | 'custom';
}
