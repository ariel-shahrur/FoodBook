


	

	CREATE PROCEDURE [dbo].[addOrderDetailsByOrderId]
    @orderId INT
AS
BEGIN
    INSERT INTO OrdersDetail (orderId, IngredientId, quantity)
    SELECT @orderId AS orderId, IngredientId, SUM(quantity) AS quantity
    FROM Cart
    WHERE customerId IN (SELECT customerId FROM ORDERS WHERE id = @orderId)
    GROUP BY IngredientId;
	/*update the quantity on shopeIngredients */
	UPDATE shopeIngredients
    SET Quantity = Quantity - (
        SELECT SUM(quantity) 
        FROM OrdersDetail 
        WHERE orderId = @orderId 
          AND shopeIngredients.id = OrdersDetail.IngredientId
    )
    WHERE id IN (SELECT IngredientId FROM OrdersDetail WHERE orderId = @orderId);
END



	CREATE PROCEDURE [dbo].[addIngredientToInventory]
    @IngredientName varchar(255),@Quantity int,@Price DECIMAL(10, 2)
	AS
	BEGIN
	insert into shopeIngredients(IngredientName,Price,Quantity)
    values (@IngredientName,@Price,@Quantity)
	END



	CREATE PROCEDURE [dbo].[deleteIngredientToInventory]
    @IngredientId int
	AS
	BEGIN
	delete from Cart where IngredientId=@IngredientId;
	delete from shopeIngredients where id=@IngredientId;
	END

		CREATE PROCEDURE [dbo].[addComment]
    @recipeId INT,@comment varchar(255)
	AS
	BEGIN
	INSERT INTO comments (recipe_id,comment) values (@recipeId,@comment);
	END

	

	CREATE PROCEDURE [dbo].[addMessage]
    @userId INT
	AS
	BEGIN
	INSERT INTO messages (userId) values (@userId);
	END



	CREATE PROCEDURE [dbo].[addMessageDetails]
    @messageId INT,@IngredientName varchar(255)
AS
BEGIN
    INSERT INTO messagesDetails (messagesId, IngredientName) values ( @messageId,@IngredientName);
END






CREATE PROCEDURE [dbo].[addToCart]
    @customerId INT, @IngredientName VARCHAR(255), @recipeId INT
AS
BEGIN
    DECLARE @IngredientId INT
    SET @IngredientName = LOWER(@IngredientName)

    -- checks if the item with the specified customer ID, ingredient name, and recipe ID already exists in the cart.
    DECLARE @ExistingCartId INT
    SELECT @ExistingCartId = Cart.id
    FROM Cart
    INNER JOIN shopeIngredients ON Cart.IngredientId = shopeIngredients.id
    WHERE Cart.customerId = @customerId
      AND LOWER(shopeIngredients.IngredientName) = @IngredientName
      AND Cart.recipe_id = @recipeId

    -- If the item exists, update the quantity
    IF @ExistingCartId IS NOT NULL
    BEGIN
        UPDATE Cart
        SET quantity = quantity + 1
        WHERE id = @ExistingCartId
    END
    ELSE
    BEGIN
        -- Ingredient not found in the cart, proceed to add a new item
        SELECT @IngredientId = id
        FROM shopeIngredients
        WHERE LOWER(IngredientName) = @IngredientName

        -- Ingredient found, proceed to add to the cart
        INSERT INTO Cart (customerId, IngredientId, recipe_id, quantity) 
        VALUES (@customerId, @IngredientId, @recipeId, 1);
    END
END




	


