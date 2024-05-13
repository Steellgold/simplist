import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { dayJS } from "./dayjs/day-js";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const hideKey = (key: string): string => {
  return `${key.slice(0, 4)}${"*".repeat(key.length - 2)}`;
};

export const getRandomData = (): { date: string; requests: number }[] => {
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.unshift({
      date: dayJS().subtract(i, "day").format("MMMM D, YYYY"),
      requests: Math.floor(Math.random() * 10000)
    });
  }
  return data;
};

export const random = (size: number = 16): string => {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < size; i++) {
    id += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return id;
};