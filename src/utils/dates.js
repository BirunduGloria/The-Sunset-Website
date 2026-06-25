export function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDisplayDate(dateString) {
  if (!dateString) return "";
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
