export const formatDate = (dateString) => {
  if (!dateString) return null;

  const date = new Date(dateString);
  // format date to May 29, 2025
  const pad = (n) => n.toString().padStart(2, "0");
  const mm = date.toLocaleString("default", { month: "long" });
  const dd = pad(date.getDate());
  const yyyy = date.getFullYear();
  return `${mm} ${dd}, ${yyyy}`;
};
