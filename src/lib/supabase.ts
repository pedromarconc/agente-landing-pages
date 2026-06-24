export interface DemoLead {
  name: string;
  brand_name: string;
  contact: string;
  monthly_orders: string;
  source: string;
}

const SUPABASE_URL = 'https://jatthieigfhktylgheop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphdHRoaWVpZ2Zoa3R5bGdoZW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0Mjk2MzAsImV4cCI6MjA5NjAwNTYzMH0.1EwlEiHLUioeWB9jExqyrXEBeINOUF8lT9X1tmLj2zQ';

export async function submitDemoLead(lead: DemoLead) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-demo-lead`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(lead),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? 'Erro ao enviar');
  }
}
