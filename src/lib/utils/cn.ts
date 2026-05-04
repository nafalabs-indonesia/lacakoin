import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes dengan aman
 * Menghindari conflict class (misal: "text-red-500 text-green-500")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}