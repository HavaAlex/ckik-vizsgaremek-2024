CREATE TABLE `user` (
  `id` integer PRIMARY KEY,
  `nev` integer,
  `szuldatum` date,
  `OM_ID` varchar(255),
  `lakcim` varchar(255),
  `nem` bool,
  `role` varchar(255)
);

CREATE TABLE `Osztaly` (
  `id` integer PRIMARY KEY,
  `name` varchar(255)
);

CREATE TABLE `Tagsag` (
  `osztaly_ID` integer,
  `user_ID` integer
);

CREATE TABLE `Ora` (
  `id` integer PRIMARY KEY,
  `tantargy_ID` integer,
  `tanar_ID` integer,
  `helyettesitotanar_ID` integer,
  `ido` date,
  `hossz` integer,
  `fakultativ` bool,
  `elmaradt` bool
);

CREATE TABLE `tantargy` (
  `id` integer PRIMARY KEY,
  `nev` varchar(255)
);

CREATE TABLE `Orarend` (
  `ora_ID` integer,
  `user_ID` integer
);

CREATE TABLE `Hianyzasok` (
  `id` integer PRIMARY KEY,
  `user_ID` integer,
  `kiado_ID` integer,
  `leigazolo_ID` integer,
  `ora_ID` integer,
  `uzenet` varchar(255)
);

ALTER TABLE `Ora` ADD FOREIGN KEY (`id`) REFERENCES `Orarend` (`ora_ID`);

CREATE TABLE `Orarend_user` (
  `Orarend_user_ID` integer,
  `user_id` integer,
  PRIMARY KEY (`Orarend_user_ID`, `user_id`)
);

ALTER TABLE `Orarend_user` ADD FOREIGN KEY (`Orarend_user_ID`) REFERENCES `Orarend` (`user_ID`);

ALTER TABLE `Orarend_user` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);


CREATE TABLE `Hianyzasok_Ora` (
  `Hianyzasok_ora_ID` integer,
  `Ora_id` integer,
  PRIMARY KEY (`Hianyzasok_ora_ID`, `Ora_id`)
);

ALTER TABLE `Hianyzasok_Ora` ADD FOREIGN KEY (`Hianyzasok_ora_ID`) REFERENCES `Hianyzasok` (`ora_ID`);

ALTER TABLE `Hianyzasok_Ora` ADD FOREIGN KEY (`Ora_id`) REFERENCES `Ora` (`id`);


CREATE TABLE `Tagsag_user` (
  `Tagsag_user_ID` integer,
  `user_id` integer,
  PRIMARY KEY (`Tagsag_user_ID`, `user_id`)
);

ALTER TABLE `Tagsag_user` ADD FOREIGN KEY (`Tagsag_user_ID`) REFERENCES `Tagsag` (`user_ID`);

ALTER TABLE `Tagsag_user` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);


ALTER TABLE `Osztaly` ADD FOREIGN KEY (`id`) REFERENCES `Tagsag` (`osztaly_ID`);

ALTER TABLE `Hianyzasok` ADD FOREIGN KEY (`user_ID`) REFERENCES `user` (`id`);

ALTER TABLE `Hianyzasok` ADD FOREIGN KEY (`kiado_ID`) REFERENCES `user` (`id`);

ALTER TABLE `Hianyzasok` ADD FOREIGN KEY (`leigazolo_ID`) REFERENCES `user` (`id`);

ALTER TABLE `Ora` ADD FOREIGN KEY (`tantargy_ID`) REFERENCES `tantargy` (`id`);

ALTER TABLE `user` ADD FOREIGN KEY (`id`) REFERENCES `Ora` (`tanar_ID`);

ALTER TABLE `user` ADD FOREIGN KEY (`id`) REFERENCES `Ora` (`helyettesitotanar_ID`);
