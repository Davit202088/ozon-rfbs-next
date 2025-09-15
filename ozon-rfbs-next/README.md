# Ozon rFBS Курьер — без Docker, одним шагом на Vercel

## Что это
Готовый минимальный проект (Next.js), который:
- Авторизация (тестовые: manager@example.com / manager123, courier@example.com / courier123)
- Карта с метками Leaflet
- Заголовки меток: последние 4 цифры номера (до дефиса) + артикул
- Роли: менеджер видит стоимость, курьер — нет
- Подготовлен к подключению к Ozon API и Geoapify (пока включены мок-данные)

## Быстрый старт (локально)
1. Установите Node.js LTS
2. Скачайте зависимости: `npm i`
3. Создайте базу (например Vercel Postgres) и пропишите `DATABASE_URL` в `.env` (скопируйте из `.env.example`)
4. Выполните миграции:
   ```bash
   npx prisma migrate deploy
   node -e "console.log('apply seed.sql manually in DB if needed')"
   ```
   (таблица кеша геокодинга создаётся из `prisma/seed.sql`)
5. Запуск: `npm run dev` → http://localhost:3000

Логин: manager@example.com / manager123

## Деплой на Vercel (рекомендуется, без Docker)
1. Создайте аккаунт https://vercel.com и подключите ваш GitHub.
2. Залейте содержимое папки в новый GitHub репозиторий.
3. В Vercel: **Add New → Project → Import** ваш репозиторий.
4. В разделе **Environment Variables** добавьте:
   - `DATABASE_URL` — из Vercel Postgres (Setup → Storage → Postgres → Create, затем **Connect** и скопируйте `Prisma` URL).
   - `JWT_SECRET` — придумайте длинную строку.
   - `USE_MOCK_ORDERS` = `true` (пока тестируем без Ozon).
5. Deploy. После билда перейдите на `/login`.

## Подключение Ozon и Geoapify
1. В **Environment Variables** допишите:
   - `OZON_CLIENT_ID`, `OZON_API_KEY`
   - `GEOAPIFY_API_KEY`
2. Поставьте `USE_MOCK_ORDERS = false`.
3. Перезапустите деплой. Теперь `GET /api/orders` будет тянуть заказы из Ozon (rFBS) и сохранять в БД.

## Что дальше
- Добавить фильтры по статусу/дате, мультивыбор и итоговую сумму для менеджера.
- Включить SSE/веб-сокеты для живых уведомлений.
- Подменить рандомные координаты на реальное геокодирование (`lib/geocode.ts`).
