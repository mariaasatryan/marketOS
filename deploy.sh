#!/bin/bash

# Простой скрипт для деплоя на GitHub Pages
# Использование: ./deploy.sh

echo "🚀 Начинаем деплой на GitHub Pages..."

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Запустите скрипт из корня проекта."
    exit 1
fi

# Собираем проект
echo "📦 Собираем проект..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при сборке проекта"
    exit 1
fi

# Проверяем, что папка dist существует
if [ ! -d "dist" ]; then
    echo "❌ Ошибка: папка dist не найдена"
    exit 1
fi

# Переходим в папку dist
cd dist

# Инициализируем git репозиторий если его нет
if [ ! -d ".git" ]; then
    echo "🔧 Инициализируем git репозиторий..."
    git init
    git remote add origin https://github.com/mariaasatryan/marketOS.git
fi

# Добавляем все файлы
echo "📝 Добавляем файлы..."
git add .

# Создаем коммит
echo "💾 Создаем коммит..."
git commit -m "Deploy: $(date)"

# Принудительно пушим в ветку gh-pages
echo "🚀 Деплоим на GitHub Pages..."
git push origin HEAD:gh-pages --force

if [ $? -eq 0 ]; then
    echo "✅ Деплой успешно завершен!"
    echo "🌐 Сайт будет доступен по адресу: https://mariaasatryan.github.io/marketOS/"
else
    echo "❌ Ошибка при деплое"
    exit 1
fi
