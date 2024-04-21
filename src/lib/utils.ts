import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const hideKey = (key: string): string => {
  return `${key.slice(0, 4)}${"*".repeat(key.length - 2)}`;
};