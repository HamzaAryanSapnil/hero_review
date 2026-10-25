export const formatDate = (isoDate: string): string => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
};

export const initials = (name: string): string => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

export const truncate = (value: string, length: number): string => {
  return value.length > length ? `${value.slice(0, length).trimEnd()}…` : value;
};

export const statusLabel = (status: "PENDING" | "APPROVED" | "REJECTED"): string => {
  if (status === "APPROVED") return "Approved";
  if (status === "REJECTED") return "Rejected";
  return "Pending";
};
