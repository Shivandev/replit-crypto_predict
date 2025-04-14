import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency = "USD",
  options = {}
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function formatCompactNumber(value: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  });
  return formatter.format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function getColorBasedOnChange(change: number): string {
  return change >= 0 ? "text-secondary" : "text-negative";
}

export function getBgColorBasedOnChange(change: number): string {
  return change >= 0 ? "bg-secondary bg-opacity-10" : "bg-negative bg-opacity-10";
}

export function calculatePortfolioDistribution(portfolios: any[]): { name: string; value: number; color: string }[] {
  if (!portfolios || portfolios.length === 0) {
    return [
      { name: "Bitcoin", value: 40, color: "#F7931A" },
      { name: "Ethereum", value: 30, color: "#627EEA" },
      { name: "Solana", value: 15, color: "#9945FF" },
      { name: "Others", value: 15, color: "#cccccc" }
    ];
  }
  
  // In a real app, we would calculate the distribution based on the portfolio data
  return [
    { name: "Bitcoin", value: 40, color: "#F7931A" },
    { name: "Ethereum", value: 30, color: "#627EEA" },
    { name: "Solana", value: 15, color: "#9945FF" },
    { name: "Others", value: 15, color: "#cccccc" }
  ];
}
