
# Базовый образ для Node.js
FROM node:latest

# Установка рабочей директории внутри контейнера
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование исходного кода в контейнер
COPY . /app

EXPOSE 3000

VOLUME '/app/node_modules'

ENV TELEGRAM_TOKEN=6001752286:AAHjw_f-goQybtD3H7ItYwg90UtsX2T3gIA
# Установа БД и конфиг
ENV MYSQL_DATABASE=telega_py_db
COPY ./init.sql /docker-entrypoint-initdb.d/

# Запуск приложения
CMD ["npm", "run", "dev"]
