import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const fl = (name: string): string => {
  const [first, second] = name.split(" ")
  if (!first) return "";
  return first[0] + (second && second[0] ? second[0] : first[1] || "")
}