export function fmtCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export function calculateDeliveryDate(daysFromNow: number = 3): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
