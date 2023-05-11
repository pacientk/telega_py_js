
# Базовый образ для Node.js
FROM node:latest

# Установка рабочей директории внутри контейнера
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование исходного кода в контейнер
COPY . .

EXPOSE 3000

VOLUME '/app/node_modules'

# Запуск приложения
CMD ["npm", "run", "dev"]
