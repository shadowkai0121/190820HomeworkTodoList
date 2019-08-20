DROP DATABASE IF EXISTS homework;
CREATE DATABASE homework;
USE homework;

CREATE TABLE todo_list(
    id int AUTO_INCREMENT PRIMARY KEY,
    title varchar(50),
    end_time varchar(50)
);

INSERT INTO todo_list(title, end_time) VALUES ('data from database 1', '2010-01-01');
INSERT INTO todo_list(title, end_time) VALUES ('data from database 2', '2010-01-01');
INSERT INTO todo_list(title, end_time) VALUES ('data from database 3', '2010-01-01');