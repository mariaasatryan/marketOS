# 🔐 Настройка переменных окружения

## Шаг 1: Создайте файл `.env`

В корне проекта создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

## Шаг 2: Заполните реальные значения

Откройте `.env` и заполните следующие переменные:

### Обязательные для фронтенда:
```env
VITE_SUPABASE_URL=https://bgnlqlvysvlwkqhdhlad.supabase.co
VITE_SUPABASE_ANON_KEY=ваш_anon_key_из_supabase
```

### Для сервера (опционально, если используете серверную часть):
```env
SUPABASE_URL=https://bgnlqlvysvlwkqhdhlad.supabase.co
SUPABASE_ANON_KEY=ваш_anon_key_из_supabase
FRONTEND_URL=https://mariaasatryan.github.io
```

### Опциональные:
- `VITE_GOOGLE_OAUTH_CLIENT_ID` - для Google OAuth
- `WB_API_TOKEN` - токен Wildberries API
- `OZON_API_CLIENT_ID`, `OZON_API_KEY` - для Ozon API
- `YM_API_TOKEN`, `YM_CAMPAIGN_ID` - для Яндекс.Маркет API
- `VITE_AI_API_KEY` - для AI функций

## Шаг 3: Проверьте, что `.env` в `.gitignore`

Убедитесь, что `.env` файл НЕ коммитится в git:
```bash
git check-ignore .env
```

Должно вывести: `.env`

## ⚠️ Важно

- **Никогда не коммитьте** `.env` файл в git
- **Не делитесь** содержимым `.env` файла
- **Используйте разные** ключи для development и production

## 📝 Где взять Supabase ключи?

1. Зайдите на https://supabase.com/dashboard
2. Выберите ваш проект
3. Перейдите в Settings → API
4. Скопируйте:
   - Project URL → `VITE_SUPABASE_URL`
   - anon public key → `VITE_SUPABASE_ANON_KEY`

