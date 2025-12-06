# Linear Labels Guide

## Overview

Labels (теги) используются для категоризации задач в Linear и помогают лучше ориентироваться в задачах. Все скрипты создания задач поддерживают автоматическое добавление тегов.

## Доступные теги

### Основные категории

- **backend** - Задачи, связанные с backend разработкой (API, база данных, серверная логика)
- **frontend** - Задачи, связанные с frontend разработкой (UI, компоненты, клиентская логика)
- **integrations** - Задачи по интеграции с внешними сервисами (Supabase, Stripe, Google OAuth, etc.)
- **database** - Задачи, связанные с базой данных (схемы, миграции, запросы)
- **feature** - Новые функции и возможности
- **bug** - Исправление багов
- **ui/ux** - Задачи по дизайну и пользовательскому опыту
- **monetization** - Задачи, связанные с монетизацией (подписки, платежи, тарифы)
- **performance** - Оптимизация производительности
- **security** - Задачи по безопасности
- **testing** - Тестирование и QA
- **documentation** - Документация

## Использование в скриптах

### Пример добавления тегов

```typescript
const result = await createLinearIssue(
  "Task Title",
  "Task description",
  teamId,
  assigneeId,
  ["backend", "integrations", "database"] // Массив тегов
)
```

### Текущие скрипты и их теги

#### `create-supabase-task.ts`
- Теги: `["backend", "integrations", "database"]`
- Причина: Задача включает настройку Supabase (database), интеграцию с Google OAuth (integrations), и backend работу

#### `create-regenerate-feature-task.ts`
- Теги: `["frontend", "feature"]`
- Причина: Новая функция регенерации слайдов - это frontend feature

#### `create-pricing-system-task.ts`
- Теги: `["backend", "frontend", "integrations", "monetization"]`
- Причина: Комплексная задача включает backend (API, база данных), frontend (UI страницы pricing), интеграции (Stripe), и монетизацию

## Создание новых тегов в Linear

Если нужного тега еще нет в Linear:

1. Откройте Linear workspace
2. Перейдите в Settings → Labels
3. Создайте новый label с нужным именем
4. Выберите цвет для визуального различия

## Рекомендации

- Используйте 2-4 тега на задачу для лучшей категоризации
- Комбинируйте теги: например, `["frontend", "feature"]` или `["backend", "integrations"]`
- Для комплексных задач используйте несколько тегов: `["backend", "frontend", "integrations"]`
- Избегайте избыточных тегов - не нужно добавлять все возможные теги

## Примеры комбинаций

- **Backend API**: `["backend", "api"]`
- **Frontend Feature**: `["frontend", "feature"]`
- **Database Migration**: `["backend", "database"]`
- **Payment Integration**: `["backend", "integrations", "monetization"]`
- **UI Improvement**: `["frontend", "ui/ux"]`
- **Bug Fix**: `["bug", "frontend"]` или `["bug", "backend"]`
- **Performance**: `["performance", "backend"]` или `["performance", "frontend"]`








