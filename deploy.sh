#!/bin/bash
set -e

echo "📦 Pullando última versão..."
git pull origin main

echo "🛠️ Buildando containers..."
docker compose build --no-cache

echo "🧹 Limpando lixo antigo..."
docker system prune -f
docker volume prune -f

echo "🚀 Subindo serviços..."
docker compose up -d

echo "✅ Deploy finalizado!"
