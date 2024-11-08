export const formatBytes = (value: number, unit: "bits" | "bytes" = "bytes", unitDisplay: "long" | "short" | "narrow" = "short"): string => {
  const byteUnits = ["bytes", "KB", "MB", "GB", "TB"];
  const bitUnits = ["bits", "Kb", "Mb", "Gb", "Tb"];
  const threshold = 1024;
  let i = 0;

  const units = unit === "bits" ? bitUnits : byteUnits;

  let size = unit === "bits" ? value * 8 : value;

  while (size >= threshold && i < units.length - 1) {
    size /= threshold;
    i++;
  }

  switch (unitDisplay) {
    case "long":
      return `${size.toFixed(1)} ${units[i].toLowerCase()}`;
    case "narrow":
      return `${size.toFixed(1)}${units[i].charAt(0)}`;
    default:
      return `${size.toFixed(1)} ${units[i]}`;
  }
};

export const formatExpiration = (date: Date | null): string => {
  if (date === null) return "Never";
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 3600 * 24));

  if (days <= 0) return "Expired";
  if (days <= 0.5) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 31) return `In ${days} days`;
  if (days <= 60) return "In a month";
  if (days <= 365) return `In ${Math.floor(days / 30)} months`;
  return `In ${Math.floor(days / 365)} years`;
};