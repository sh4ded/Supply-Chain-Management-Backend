CREATE TABLE `mydb1`.`users` (
  `user_id` INT NOT NULL,
  `email` VARCHAR(45) NULL,
  `password` VARCHAR(85) NOT NULL,
  `company_name` VARCHAR(45) NOT NULL,
  `location` VARCHAR(45) NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);


  CREATE TABLE `mydb1`.`warehouses` (
  `warehouse_id` INT NOT NULL,
  `location` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`warehouse_id`));


CREATE TABLE `mydb1`.`admins` (
  `admin_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NULL,
  `warehouse_id` INT NULL,
  PRIMARY KEY (`admin_id`),
  INDEX `admin_to_warehouse_idx` (`warehouse_id` ASC) VISIBLE,
  CONSTRAINT `admin_to_warehouse`
    FOREIGN KEY (`warehouse_id`)
    REFERENCES `mydb1`.`warehouses` (`warehouse_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


CREATE TABLE `mydb1`.`employees` (
  `employee_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `designation` VARCHAR(45) NOT NULL,
  `phone_no` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`employee_id`));




  CREATE TABLE `mydb1`.`vehicles` (
  `vehicle_id` INT NOT NULL,
  `total_space` INT NOT NULL,
  `allocated_space` INT NOT NULL,
  `employee_id` INT NULL,
  `current_location` INT NULL,
  `from_location` INT NULL,
  `to_location` INT NULL,
  PRIMARY KEY (`vehicle_id`),
  INDEX `v_to_e_idx` (`employee_id` ASC) VISIBLE,
  INDEX `v_to_w_idx` (`current_location` ASC) VISIBLE,
  INDEX `v_to_w_2_idx` (`from_location` ASC) VISIBLE,
  INDEX `v_to_w_3_idx` (`to_location` ASC) VISIBLE,
  CONSTRAINT `v_to_e`
    FOREIGN KEY (`employee_id`)
    REFERENCES `mydb1`.`employees` (`employee_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `v_to_w`
    FOREIGN KEY (`current_location`)
    REFERENCES `mydb1`.`warehouses` (`warehouse_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `v_to_w_2`
    FOREIGN KEY (`from_location`)
    REFERENCES `mydb1`.`warehouses` (`warehouse_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `v_to_w_3`
    FOREIGN KEY (`to_location`)
    REFERENCES `mydb1`.`warehouses` (`warehouse_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);




    CREATE TABLE `mydb1`.`price_plans` (
  `from_warehouse` INT NOT NULL,
  `to_warehouse` INT NOT NULL,
  `price_per_kg` INT NOT NULL,
  `price_plan_name` VARCHAR(45) NOT NULL,
  INDEX `p_to_w_idx` (`from_warehouse` ASC) VISIBLE,
  INDEX `p_to_w_2_idx` (`to_warehouse` ASC) VISIBLE,
  CONSTRAINT `p_to_w`
    FOREIGN KEY (`from_warehouse`)
    REFERENCES `mydb1`.`warehouses` (`warehouse_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `p_to_w_2`
    FOREIGN KEY (`to_warehouse`)
    REFERENCES `mydb1`.`warehouses` (`warehouse_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



    CREATE TABLE `mydb1`.`orders` (
  `order_id` INT NOT NULL,
  `order_date` DATE NOT NULL,
  `user_id` INT NOT NULL,
  `source` INT NOT NULL,
  `destination` INT NOT NULL,
  `current_hub` INT NOT NULL,
  `vehicle_id` INT NOT NULL,
  `weight` INT NOT NULL,
  `products` LONGTEXT NULL,
  `amount` INT NOT NULL,
  `status` VARCHAR(20) NOT NULL,
  `expected_date` DATE NULL,
  PRIMARY KEY (`order_id`),
  INDEX `o_to_u_idx` (`user_id` ASC) VISIBLE,
  INDEX `o_to_v_idx` (`vehicle_id` ASC) VISIBLE,
  INDEX `o_to_w_1_idx` (`source` ASC) VISIBLE,
  INDEX `o_to_w_2_idx` (`destination` ASC) VISIBLE,
  INDEX `o_to_w_3_idx` (`current_hub` ASC) VISIBLE,
  CONSTRAINT `o_to_u`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb1`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `o_to_v`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `mydb1`.`vehicles` (`vehicle_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `o_to_w_1`
    FOREIGN KEY (`source`)
    REFERENCES `mydb1`.`warehouses` (`warehouse_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `o_to_w_2`
    FOREIGN KEY (`destination`)
    REFERENCES `mydb1`.`warehouses` (`warehouse_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `o_to_w_3`
    FOREIGN KEY (`current_hub`)
    REFERENCES `mydb1`.`warehouses` (`warehouse_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

    ALTER TABLE `mydb1`.`orders` 
DROP FOREIGN KEY `o_to_v`;
ALTER TABLE `mydb1`.`orders` 
DROP INDEX `o_to_v_idx` ;
;

ALTER TABLE `mydb1`.`orders` 
CHANGE COLUMN `order_id` `order_id` VARCHAR(45) NOT NULL ;