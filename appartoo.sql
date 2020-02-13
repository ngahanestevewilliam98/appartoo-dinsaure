-- Adminer 4.7.1 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `amis`;
CREATE TABLE `amis` (
  `id_ami` int(11) NOT NULL AUTO_INCREMENT,
  `id_din1` int(11) NOT NULL,
  `id_din2` int(11) NOT NULL,
  `statut` int(11) NOT NULL,
  `createAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL,
  PRIMARY KEY (`id_ami`),
  KEY `id_din1` (`id_din1`),
  KEY `id_din2` (`id_din2`),
  CONSTRAINT `amis_ibfk_1` FOREIGN KEY (`id_din1`) REFERENCES `dinosaure` (`id_donosaure`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `amis_ibfk_2` FOREIGN KEY (`id_din2`) REFERENCES `dinosaure` (`id_donosaure`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `dinosaure`;
CREATE TABLE `dinosaure` (
  `id_donosaure` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(200) NOT NULL,
  `password` varchar(254) NOT NULL,
  `statut` int(11) NOT NULL,
  `age` int(11) NOT NULL,
  `id_race` int(11) NOT NULL,
  `nourriture` text NOT NULL,
  `createAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL,
  PRIMARY KEY (`id_donosaure`),
  KEY `id_race` (`id_race`),
  CONSTRAINT `dinosaure_ibfk_1` FOREIGN KEY (`id_race`) REFERENCES `race` (`id_race`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `race`;
CREATE TABLE `race` (
  `id_race` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(200) NOT NULL,
  `statut` int(11) NOT NULL,
  `createAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL,
  PRIMARY KEY (`id_race`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `race` (`id_race`, `nom`, `statut`, `createAt`, `updateAt`) VALUES
(1,	'Callovosaurus',	1,	'2020-02-13 11:10:26',	'2020-02-13 11:10:26'),
(2,	'Brachylophosaurus',	1,	'2020-02-13 11:10:41',	'2020-02-13 11:10:41'),
(3,	'Brachyceratops',	1,	'2020-02-13 11:10:54',	'2020-02-13 11:10:54');

-- 2020-02-13 13:39:59
