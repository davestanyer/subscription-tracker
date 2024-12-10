-- Create a view that calculates billing schedule for the next 12 months
CREATE OR REPLACE VIEW billing_schedule AS
WITH RECURSIVE dates AS (
  SELECT 
    date_trunc('month', CURRENT_DATE) as date
  UNION ALL
  SELECT 
    date + interval '1 month'
  FROM dates
  WHERE date < date_trunc('month', CURRENT_DATE + interval '11 months')
),
billing_dates AS (
  SELECT 
    s.id,
    s.name,
    s.amount,
    s.frequency,
    s.next_billing_date,
    d.date as billing_month
  FROM subscriptions s
  CROSS JOIN dates d
  WHERE NOT s.flagged_for_removal
),
adjusted_dates AS (
  SELECT 
    id,
    name,
    amount,
    billing_month,
    CASE frequency
      WHEN 'monthly' THEN 
        billing_month
      WHEN 'quarterly' THEN 
        date_trunc('month', next_billing_date) + 
        (floor(((extract(epoch from (billing_month - date_trunc('month', next_billing_date))) / 86400) / 90)) * interval '3 months'
      WHEN 'annually' THEN 
        date_trunc('month', next_billing_date) + 
        (floor(((extract(epoch from (billing_month - date_trunc('month', next_billing_date))) / 86400) / 365)) * interval '12 months'
    END as actual_billing_date
  FROM billing_dates
)
SELECT 
  billing_month as date,
  SUM(amount) as total_amount,
  json_agg(json_build_object(
    'id', id,
    'name', name,
    'amount', amount
  )) as subscriptions
FROM adjusted_dates
WHERE billing_month = actual_billing_date
GROUP BY billing_month
ORDER BY billing_month;