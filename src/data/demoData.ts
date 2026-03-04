// Demo data from seller-focused marketOS (reviews, inbox, alerts, insights)

export const DEMO_INBOX = [
  { id: 1, type: 'review' as const, product: 'Bamboo Cutting Board Set', asin: 'B09XK2F4TR', snippet: 'Arrived cracked in two places. Very disappointed with the quality...', sentiment: 'negative' as const, urgency: 'high' as const, status: 'NEW' as const, rating: 1, customerText: 'I ordered this cutting board set and when it arrived, one of the boards was cracked right through the middle.', aiReply: "Thank you for letting us know. We're sorry your cutting board arrived damaged. Please reach out via your order so we can send a replacement right away.", tone: 'Professional' },
  { id: 2, type: 'qa' as const, product: 'Stainless Steel Water Bottle 32oz', asin: 'B08MNPQ2XR', snippet: 'Does this bottle keep drinks cold for 24 hours as advertised?', sentiment: 'neutral' as const, urgency: 'medium' as const, status: 'NEW' as const, rating: null, customerText: 'Does this bottle keep drinks cold for 24 hours as advertised?', aiReply: 'Yes! Our 32oz bottle uses double-wall vacuum insulation that keeps drinks cold up to 24 hours.', tone: 'Friendly' },
  { id: 3, type: 'message' as const, product: 'Yoga Mat Premium 6mm', asin: 'B07QPLR9V4', snippet: 'Hi, I need to return this mat. Not grippy enough.', sentiment: 'negative' as const, urgency: 'high' as const, status: 'IN PROGRESS' as const, rating: null, customerText: 'I received my yoga mat but it\'s not grippy enough for hot yoga. I\'d like to return it please.', aiReply: "I'd be happy to process your return. Please initiate through your order page for a full refund within 3-5 business days.", tone: 'Friendly' },
  { id: 4, type: 'review' as const, product: 'LED Desk Lamp Adjustable', asin: 'B0B2NKQP7R', snippet: 'Love the light quality! Perfect for my home office.', sentiment: 'positive' as const, urgency: 'low' as const, status: 'HANDLED' as const, rating: 5, customerText: 'This lamp is exactly what I needed. Build quality feels premium.', aiReply: 'Thank you so much for the wonderful review!', tone: 'Friendly' },
];

export const DEMO_ALERTS = [
  { id: 1, type: 'Negative Review Streak', severity: 'critical' as const, product: 'Bamboo Cutting Board Set', asin: 'B09XK2F4TR', description: '3 negative reviews (1-2 star) in the last 48 hours. Common theme: product damage in shipping.', action: 'Review packaging specs + contact logistics partner' },
  { id: 2, type: 'Topic Spike', severity: 'warning' as const, product: 'Stainless Steel Water Bottle 32oz', asin: 'B08MNPQ2XR', description: "The keyword 'leaking' appeared in 7 reviews/messages this week, up 340%.", action: 'Deploy updated-lid offer response template' },
  { id: 3, type: 'Response Time Risk', severity: 'warning' as const, product: 'Yoga Mat Premium 6mm', asin: 'B07QPLR9V4', description: '4 buyer messages unanswered for >18 hours. 24-hour SLA at risk.', action: 'Auto-reply or manual response needed immediately' },
];

export const DEMO_REVIEWS = [
  { id: 1, product: 'Bamboo Cutting Board Set', asin: 'B09XK2F4TR', rating: 1, date: '2 hours ago', text: 'Arrived cracked in two places. Very disappointed.', replied: false, topic: 'Damage' },
  { id: 2, product: 'LED Desk Lamp Adjustable', asin: 'B0B2NKQP7R', rating: 1, date: '5 hours ago', text: 'Stopped working after 3 weeks. Blinks then dies.', replied: false, topic: 'Defect' },
  { id: 3, product: 'Stainless Steel Water Bottle 32oz', asin: 'B08MNPQ2XR', rating: 2, date: '8 hours ago', text: 'Leaks from the lid when tilted. Unusable for commuting.', replied: true, topic: 'Leak' },
  { id: 4, product: 'Bamboo Cutting Board Set', asin: 'B09XK2F4TR', rating: 5, date: '1 day ago', text: 'Love the light quality! Perfect for my home office.', replied: true, topic: 'Praise' },
];

export const DEMO_INSIGHTS = {
  complaints: [
    { theme: 'Shipping Damage', count: 23, quote: 'Arrived cracked — clearly a packaging issue' },
    { theme: 'Lid / Seal Leaking', count: 18, quote: 'Great bottle but leaks when tilted' },
    { theme: 'Stopped Working Early', count: 12, quote: 'Failed after 3 weeks of normal use' },
  ],
  praise: [
    { theme: 'Build Quality', count: 87, quote: 'Feels solid and premium' },
    { theme: 'Fast Shipping', count: 64, quote: 'Arrived next day, beautifully packaged' },
    { theme: 'Great Customer Service', count: 41, quote: 'Team responded in hours and sent a replacement' },
  ],
};
