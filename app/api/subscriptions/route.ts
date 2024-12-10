import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { type Subscription } from "@/types/subscription";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        client:clients(id, name),
        owner:users(id, name, email)
      `)
      .order('next_billing_date');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data as Subscription[]);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}