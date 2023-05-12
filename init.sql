CREATE DATABASE IF NOT EXISTS telega_py_db;
USE telega_py_db;
CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    chatId INT,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    right INT,
    wrong INT,
    createdAt DATETIME,
    updatedAt DATETIME
);
