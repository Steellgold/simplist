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