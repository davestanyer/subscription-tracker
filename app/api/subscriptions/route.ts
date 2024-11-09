import { NextResponse } from "next/server";
import { Subscription } from "@/types/subscription";

// Mock data for demonstration
const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    name: "Adobe Creative Cloud",
    amount: 52.99,
    currency: "USD",
    frequency: "monthly",
    nextBillingDate: "2024-04-15",
    owner: {
      id: "u1",
      name: "John Doe",
      email: "john@example.com"
    },
    billingEmail: "billing@company.com",
    status: "active",
    localAmount: 48.50,
    localCurrency: "EUR",
    exchangeRate: 0.91,
  },
  {
    id: "2",
    name: "AWS Services",
    amount: 1200,
    currency: "USD",
    frequency: "monthly",
    nextBillingDate: "2024-04-01",
    client: {
      id: "c1",
      name: "Tech Corp"
    },
    owner: {
      id: "u2",
      name: "Jane Smith",
      email: "jane@example.com"
    },
    billingEmail: "finance@techcorp.com",
    status: "active",
    localAmount: 1098,
    localCurrency: "EUR",
    exchangeRate: 0.915,
  }
];

export async function GET() {
  return NextResponse.json(mockSubscriptions);
}