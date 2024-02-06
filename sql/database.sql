IF EXISTS (SELECT 1 FROM sys.databases WHERE name = 'FoodNetwork')
BEGIN
   USE master
ALTER DATABASE FoodNetwork 
SET SINGLE_USER 
WITH ROLLBACK IMMEDIATE;
   DROP DATABASE FoodNetwork
END

IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = 'FoodNetwork')
CREATE DATABASE FoodNetwork;
GO

USE FoodNetwork;
GO



CREATE TABLE Customers(
id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
username varchar(25) NOT NULL UNIQUE,
eAdress varchar(50) not null,
password_ varchar(50) not null,
);

CREATE TABLE Admins(
id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
userId int NOT NULL FOREIGN KEY REFERENCES Customers(id)
);


CREATE TABLE Sessions(
	id int IDENTITY(1,1) NOT NULL,
	usernameId int NOT NULL FOREIGN KEY REFERENCES Customers(id),
	token varchar(200) NOT NULL
);

CREATE TABLE recipes (
  id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  name VARCHAR(255),
  time INT,
  ingredientsNum INT,
  servingNum INT,
  Description TEXT,
  likes int,
  usernameId int NOT NULL FOREIGN KEY REFERENCES Customers(id),
);


CREATE TABLE ingredients (
  id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  recipe_id INT NOT NULL FOREIGN KEY REFERENCES recipes(id),
  title VARCHAR(255),
  ingredientName VARCHAR(255) not null, 
  quantity VARCHAR(255) not null
);

CREATE TABLE comment (
  id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  recipe_id INT NOT NULL FOREIGN KEY REFERENCES recipes(id),
  customersId int NOT NULL FOREIGN KEY REFERENCES Customers(id),
  comment VARCHAR(255),
  commentDate DATETIME DEFAULT GETDATE()
);

CREATE TABLE directions (
  id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  recipe_id INT NOT NULL FOREIGN KEY REFERENCES recipes(id),
  title VARCHAR(255),
  stepDescription TEXT,
);

CREATE TABLE LikedRecipes (
    LikeId INT PRIMARY KEY IDENTITY(1,1),
    RecipeId INT NOT NULL FOREIGN KEY REFERENCES recipes(id),
    CustomerId INT  NOT NULL FOREIGN KEY REFERENCES Customers(id), 
    LikeDate DATETIME DEFAULT GETDATE(), 
);


CREATE TABLE shopeIngredients (
    id INT PRIMARY KEY IDENTITY(1,1),
    IngredientName VARCHAR(255) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0)
);


CREATE TABLE Cart(
id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
customerId int NOT NULL FOREIGN KEY REFERENCES Customers(id),
IngredientId int NOT NULL FOREIGN KEY REFERENCES shopeIngredients(id),
recipe_id INT FOREIGN KEY REFERENCES recipes(id),
quantity int NOT NULL
);

CREATE TABLE Orders(
id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
customerId int NOT NULL FOREIGN KEY REFERENCES Customers(id),
orderDate DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE TABLE OrdersDetail(
id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
orderId int NOT NULL FOREIGN KEY REFERENCES Orders(id),
IngredientId int NOT NULL FOREIGN KEY REFERENCES shopeIngredients(id),
quantity int NOT NULL
);

CREATE TABLE images(
id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
recipeId int NOT NULL FOREIGN KEY REFERENCES recipes(id),
src varchar(255) NOT NULL 
);

CREATE TABLE messages(
id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
userId int NOT NULL FOREIGN KEY REFERENCES Customers(id), 
messageDate DATETIME NOT NULL DEFAULT GETDATE()
);

CREATE TABLE messagesDetails(
id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
messagesId int NOT NULL FOREIGN KEY REFERENCES messages(id), 
IngredientName varchar(255) NOT NULL
);


select * from Customers
select * from images
select * from recipes
select * from ingredients

select * from directions
select * from LikedRecipes
select * from Admins
select * from Cart
select * from shopeIngredients
select * from Orders
select * from messagesDetails
select * from messages


insert into Admins (userId) values (1)





	