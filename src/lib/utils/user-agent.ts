import { UAParser } from "ua-parser-js";

export type UAReturn = {
  browser: string;
  os: string;
  device: string;
};

export const userAgentDecoder = (userAgent: string): UAReturn => {
  const ua = new UAParser(userAgent);
  const { browser, device, os } = ua.getResult();
  return {
    browser: browser.name || "Unknown",
    os: os.name || "Unknown",
    device: device.type || "Unknown"
  };
};