-- Drop the existing view
DROP VIEW IF EXISTS billing_schedule;

-- Create updated view with month_end column
CREATE OR REPLACE VIEW billing_schedule AS
WITH RECURSIVE dates AS (
  SELECT 
    date_trunc('month', CURRENT_DATE) as date,
    date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day' as month_end
  UNION ALL
  SELECT 
    date + interval '1 month',
    (date + interval '2 month') - interval '1 day'
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
    d.date as billing_month,
    d.month_end
  FROM subscriptions s
  CROSS JOIN dates d
  WHERE NOT s.flagged_for_removal
    AND s.status = 'active'
),
adjusted_dates AS (
  SELECT 
    id,
    name,
    amount,
    billing_month,
    month_end,
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
  month_end,
  COALESCE(SUM(amount), 0) as amount
FROM adjusted_dates
WHERE billing_month = actual_billing_date
GROUP BY billing_month, month_end
ORDER BY billing_month;