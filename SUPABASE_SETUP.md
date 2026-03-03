# Настройка Supabase

## Информация о подключении

### Клиентское приложение (React)
- **URL**: `https://ypmrhqltmkuorwcynyrv.supabase.co`
- **Anon Key**: См. в панели Supabase (Settings → API → anon public key)

### База данных (PostgreSQL)
- **Host**: `db.ypmrhqltmkuorwcynyrv.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`
- **Username**: `postgres`
- **Password**: Используйте переменную окружения `DATABASE_URL` (не храните пароль в коде!)

## Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://ypmrhqltmkuorwcynyrv.supabase.co
VITE_SUPABASE_ANON_KEY=ваш_anon_key_из_supabase_dashboard

# Database Connection (for server-side use only)
# ВАЖНО: Используйте переменную окружения, не храните пароль в коде!
# Получите DATABASE_URL из Supabase Dashboard → Settings → Database → Connection string
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.ypmrhqltmkuorwcynyrv.supabase.co:5432/postgres

# App Configuration
VITE_APP_MODE=LIVE
VITE_API_RETRY_ATTEMPTS=3
VITE_API_RETRY_DELAY=1000
VITE_API_TIMEOUT=30000
VITE_CACHE_TTL=300000
```

## Важно!

⚠️ **Замените `placeholder_key` на ваш настоящий анонимный ключ из панели Supabase!**

1. Зайдите в панель Supabase: https://supabase.com/dashboard
2. Выберите ваш проект
3. Перейдите в Settings → API
4. Скопируйте "anon public" ключ
5. Замените `placeholder_key` на настоящий ключ

## Использование

```typescript
import { supabase } from '../lib/supabase';

// Получение данных
const { data, error } = await supabase
  .from('profiles')
  .select('*');

// Вставка данных
const { data, error } = await supabase
  .from('profiles')
  .insert([{ email: 'user@example.com' }]);
```
