export async function listFbsPostings(date_from: string) {
  const useMock = process.env.USE_MOCK_ORDERS === 'true'
  if (useMock) {
    return { result: { postings: demoOrders } }
  }
  const url = 'https://api-seller.ozon.ru/v3/posting/fbs/list'
  const body = {
    dir: 'asc',
    filter: {
      date_from,
      status: 'awaiting_deliver'
    },
    limit: 50,
    with: { analytics_data: true }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': process.env.OZON_CLIENT_ID!,
      'Api-Key': process.env.OZON_API_KEY!,
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error('Ozon API error ' + res.status)
  return res.json()
}

const demoOrders = [
  {
    posting_number: '1234560865',
    order_id: 'o1',
    analytics_data: { sku: 'SKU1' },
    products: [{ offer_id: 'Х2-чер-чер' }],
    delivery_method: { tpl_provider: 'RFBS' },
    customer: { address: { address_tail: 'Амстердам, Damrak 1' }, phone: '+31 *****1234' },
    delivering_date: '2025-09-16T12:00:00+02:00',
    financial_data: { posting_services: { marketplace_service_item_fulfillment: { price: 1500 } } }
  },
  {
    posting_number: '7890123456',
    order_id: 'o2',
    analytics_data: { sku: 'SKU2' },
    products: [{ offer_id: 'Кроссы-42' }],
    delivery_method: { tpl_provider: 'RFBS' },
    customer: { address: { address_tail: 'Амстердам, Museumplein 10' }, phone: '+31 *****5678' },
    delivering_date: '2025-09-16T16:00:00+02:00',
    financial_data: { posting_services: { marketplace_service_item_fulfillment: { price: 1500 } } }
  }
]
