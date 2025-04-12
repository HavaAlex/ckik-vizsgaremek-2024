-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 09. 21:40
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12
CREATE DATABASE IF NOT EXISTS paholy;
USE paholy;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `paholy`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `absences`
--

CREATE TABLE `absences` (
  `ID` int(11) NOT NULL,
  `studentID` int(11) NOT NULL,
  `teacherID` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `excused` tinyint(1) NOT NULL,
  `lessonID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `absences`
--

INSERT INTO `absences` (`ID`, `studentID`, `teacherID`, `date`, `excused`, `lessonID`) VALUES
(1, 8, 2, '2025-04-10 22:00:00', 0, 46),
(2, 9, 2, '2025-04-10 22:00:00', 0, 46),
(3, 7, 2, '2025-04-06 22:00:00', 0, 26),
(4, 10, 2, '2025-04-06 22:00:00', 0, 26),
(5, 8, 2, '2025-04-07 22:00:00', 0, 35),
(6, 11, 2, '2025-04-07 22:00:00', 0, 35),
(7, 10, 2, '2025-04-07 22:00:00', 0, 35),
(8, 1, 2, '2025-04-08 22:00:00', 0, 15),
(9, 4, 2, '2025-04-08 22:00:00', 0, 15),
(10, 8, 2, '2025-04-06 22:00:00', 0, 30),
(11, 10, 2, '2025-04-06 22:00:00', 0, 30);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `admins`
--

CREATE TABLE `admins` (
  `ID` int(11) NOT NULL,
  `name` varchar(60) NOT NULL,
  `phone` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `admins`
--

INSERT INTO `admins` (`ID`, `name`, `phone`, `email`, `userId`) VALUES
(1, 'szabo.patrik', '36301234567', 'szabo.patrik@gmail.com', 25);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `assignmentfiles`
--

CREATE TABLE `assignmentfiles` (
  `ID` int(11) NOT NULL,
  `assignmentID` int(11) NOT NULL,
  `buffer` longblob NOT NULL,
  `mimetype` varchar(500) NOT NULL,
  `filename` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `assignments`
--

CREATE TABLE `assignments` (
  `ID` int(11) NOT NULL,
  `teacherID` int(11) NOT NULL,
  `desc` varchar(5000) NOT NULL,
  `deadline` datetime NOT NULL,
  `uploadDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `classdistruptions`
--

CREATE TABLE `classdistruptions` (
  `ID` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `groupID` int(11) NOT NULL,
  `teacherID` int(11) DEFAULT NULL,
  `start_Hour` int(11) NOT NULL,
  `start_Minute` int(11) NOT NULL,
  `length` int(11) NOT NULL,
  `day` enum('hetfo','kedd','szerda','csutortok','pentek','szombat','vasarnap') NOT NULL,
  `subjectName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `classdistruptions`
--

INSERT INTO `classdistruptions` (`ID`, `date`, `groupID`, `teacherID`, `start_Hour`, `start_Minute`, `length`, `day`, `subjectName`) VALUES
(1, '2025-03-29 16:28:53', 1, 1, 0, 700, 45, 'pentek', 'Matematika'),
(2, '2025-03-21 16:28:53', 1, 1, 0, 700, 45, 'pentek', 'Matematika'),
(3, '2025-03-21 16:28:53', 1, 1, 0, 700, 135, 'szombat', 'Matematika');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `completedassignmentfiles`
--

CREATE TABLE `completedassignmentfiles` (
  `ID` int(11) NOT NULL,
  `assignmentID` int(11) NOT NULL,
  `buffer` longblob NOT NULL,
  `mimetype` varchar(500) NOT NULL,
  `filename` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `completedassignments`
--

CREATE TABLE `completedassignments` (
  `ID` int(11) NOT NULL,
  `assignmentID` int(11) NOT NULL,
  `studentID` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `textAnswer` varchar(5000) NOT NULL,
  `status` enum('Leadva','Nincs leadva','Határidő lejárt') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `groups`
--

CREATE TABLE `groups` (
  `ID` int(11) NOT NULL,
  `name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `groups`
--

INSERT INTO `groups` (`ID`, `name`) VALUES
(1, '1.a'),
(2, '1.b');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `guardians`
--

CREATE TABLE `guardians` (
  `ID` int(11) NOT NULL,
  `name` varchar(60) NOT NULL,
  `phone` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `guardians`
--

INSERT INTO `guardians` (`ID`, `name`, `phone`, `email`, `userId`) VALUES
(1, 'litvan.jeno', '36301234567', 'litvan.jeno@gmail.com', 15),
(2, 'uborkane.matilda', '36301234567', 'uborkane.matilda@gmail.com', 16),
(3, 'kalapacs.bence', '36301234567', 'kalapacs.bence@gmail.com', 17),
(4, 'cinegene.sara', '36301234567', 'cinegene.sara@gmail.com', 18),
(5, 'elemer.emil', '36301234567', 'elemer.emil@gmail.com', 19),
(6, 'antal.andras', '36301234567', 'antal.andras@gmail.com', 20),
(7, 'ordas.kristof', '36301234567', 'ordas.kristof@gmail.com', 21),
(8, 'papp.terez', '36301234567', 'papp.terez@gmail.com', 22),
(9, 'rokus.jozsef', '36301234567', 'rokus.jozsef@gmail.com', 23),
(10, 'palacsinta.pedro', '36301234567', 'palacsinta.pedro@gmail.com', 24);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `guardianstudents`
--

CREATE TABLE `guardianstudents` (
  `GuardianID` int(11) NOT NULL,
  `StudentID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `guardianstudents`
--

INSERT INTO `guardianstudents` (`GuardianID`, `StudentID`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(4, 7),
(5, 5),
(6, 6),
(7, 8),
(8, 9),
(9, 10);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `lessons`
--

CREATE TABLE `lessons` (
  `ID` int(11) NOT NULL,
  `groupID` int(11) NOT NULL,
  `teacherID` int(11) NOT NULL,
  `start_Hour` int(11) NOT NULL,
  `start_Minute` int(11) NOT NULL,
  `length` int(11) NOT NULL,
  `day` enum('hetfo','kedd','szerda','csutortok','pentek','szombat','vasarnap') NOT NULL,
  `subjectName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `lessons`
--

INSERT INTO `lessons` (`ID`, `groupID`, `teacherID`, `start_Hour`, `start_Minute`, `length`, `day`, `subjectName`) VALUES
(1, 1, 2, 0, 480, 45, 'hetfo', 'Matematika'),
(2, 1, 1, 0, 535, 45, 'hetfo', 'Magyar nyelv és Irodalom'),
(3, 1, 1, 0, 590, 45, 'hetfo', 'Magyar nyelv és Irodalom'),
(4, 1, 3, 0, 645, 45, 'hetfo', 'Környezetismeret'),
(5, 1, 2, 0, 700, 45, 'hetfo', 'Testnevelés'),
(6, 1, 2, 0, 535, 45, 'kedd', 'Matematika'),
(7, 1, 1, 0, 480, 45, 'kedd', 'Magyar nyelv és Irodalom'),
(8, 1, 1, 0, 755, 45, 'kedd', 'Magyar nyelv és Irodalom'),
(9, 1, 3, 0, 645, 45, 'kedd', 'Környezetismeret'),
(10, 1, 2, 0, 700, 45, 'kedd', 'Testnevelés'),
(11, 1, 2, 0, 590, 45, 'szerda', 'Matematika'),
(12, 1, 1, 0, 535, 45, 'szerda', 'Magyar nyelv és Irodalom'),
(13, 1, 1, 0, 700, 45, 'szerda', 'Magyar nyelv és Irodalom'),
(14, 1, 3, 0, 645, 45, 'szerda', 'Környezetismeret'),
(15, 1, 2, 0, 480, 45, 'szerda', 'Testnevelés'),
(16, 1, 2, 0, 645, 45, 'csutortok', 'Matematika'),
(17, 1, 1, 0, 535, 45, 'csutortok', 'Magyar nyelv és Irodalom'),
(18, 1, 1, 0, 590, 45, 'csutortok', 'Magyar nyelv és Irodalom'),
(19, 1, 3, 0, 480, 45, 'csutortok', 'Környezetismeret'),
(20, 1, 2, 0, 700, 45, 'csutortok', 'Testnevelés'),
(21, 1, 2, 0, 480, 45, 'pentek', 'Matematika'),
(22, 1, 1, 0, 535, 45, 'pentek', 'Magyar nyelv és Irodalom'),
(23, 1, 1, 0, 590, 45, 'pentek', 'Magyar nyelv és Irodalom'),
(24, 1, 3, 0, 645, 45, 'pentek', 'Környezetismeret'),
(25, 1, 2, 0, 700, 45, 'pentek', 'Testnevelés'),
(26, 2, 2, 0, 425, 45, 'hetfo', 'Matematika'),
(27, 2, 1, 0, 480, 45, 'hetfo', 'Magyar nyelv és Irodalom'),
(28, 2, 1, 0, 590, 45, 'hetfo', 'Magyar nyelv és Irodalom'),
(29, 2, 3, 0, 645, 45, 'hetfo', 'Környezetismeret'),
(30, 2, 2, 0, 700, 45, 'hetfo', 'Testnevelés'),
(31, 2, 2, 0, 535, 45, 'kedd', 'Matematika'),
(32, 2, 1, 0, 810, 45, 'kedd', 'Magyar nyelv és Irodalom'),
(33, 2, 1, 0, 755, 45, 'kedd', 'Magyar nyelv és Irodalom'),
(34, 2, 3, 0, 645, 45, 'kedd', 'Környezetismeret'),
(35, 2, 2, 0, 700, 45, 'kedd', 'Testnevelés'),
(36, 2, 2, 0, 590, 45, 'szerda', 'Matematika'),
(37, 2, 1, 0, 645, 45, 'szerda', 'Magyar nyelv és Irodalom'),
(38, 2, 1, 0, 480, 45, 'szerda', 'Magyar nyelv és Irodalom'),
(39, 2, 3, 0, 535, 45, 'szerda', 'Környezetismeret'),
(40, 2, 2, 0, 700, 45, 'szerda', 'Testnevelés'),
(41, 2, 2, 0, 645, 45, 'csutortok', 'Matematika'),
(42, 2, 1, 0, 535, 45, 'csutortok', 'Magyar nyelv és Irodalom'),
(43, 2, 1, 0, 590, 45, 'csutortok', 'Magyar nyelv és Irodalom'),
(44, 2, 3, 0, 480, 45, 'csutortok', 'Környezetismeret'),
(45, 2, 2, 0, 700, 45, 'csutortok', 'Testnevelés'),
(46, 2, 2, 0, 480, 45, 'pentek', 'Matematika'),
(47, 2, 1, 0, 535, 45, 'pentek', 'Magyar nyelv és Irodalom'),
(48, 2, 1, 0, 590, 45, 'pentek', 'Magyar nyelv és Irodalom'),
(49, 2, 3, 0, 645, 45, 'pentek', 'Környezetismeret'),
(50, 2, 2, 0, 700, 45, 'pentek', 'Testnevelés');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `marks`
--

CREATE TABLE `marks` (
  `ID` int(11) NOT NULL,
  `teacherID` int(11) NOT NULL,
  `studentID` int(11) NOT NULL,
  `Value` int(11) NOT NULL,
  `Multiplier` int(11) NOT NULL,
  `subjectName` varchar(255) NOT NULL,
  `date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `marks`
--

INSERT INTO `marks` (`ID`, `teacherID`, `studentID`, `Value`, `Multiplier`, `subjectName`, `date`) VALUES
(1, 2, 7, 3, 100, 'Testnevelés', '2025-04-09 19:27:23'),
(2, 2, 9, 4, 100, 'Testnevelés', '2025-04-09 19:27:23'),
(3, 2, 10, 3, 100, 'Testnevelés', '2025-04-09 19:27:23'),
(4, 2, 8, 2, 100, 'Testnevelés', '2025-04-09 19:27:23'),
(5, 2, 7, 2, 100, 'Matematika', '2025-04-09 19:27:36'),
(6, 2, 8, 3, 100, 'Matematika', '2025-04-09 19:27:36'),
(7, 2, 10, 1, 100, 'Matematika', '2025-04-09 19:27:36'),
(8, 2, 9, 4, 100, 'Matematika', '2025-04-09 19:27:36'),
(9, 2, 1, 4, 100, 'Matematika', '2025-04-09 19:27:51'),
(10, 2, 3, 3, 100, 'Matematika', '2025-04-09 19:27:51'),
(11, 2, 4, 4, 100, 'Matematika', '2025-04-09 19:27:51'),
(12, 2, 2, 2, 100, 'Matematika', '2025-04-09 19:27:51'),
(13, 2, 3, 1, 100, 'Testnevelés', '2025-04-09 19:27:55'),
(14, 2, 4, 3, 100, 'Testnevelés', '2025-04-09 19:27:55'),
(15, 2, 5, 5, 100, 'Testnevelés', '2025-04-09 19:27:55'),
(16, 2, 6, 1, 100, 'Testnevelés', '2025-04-09 19:27:55');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `messagereceivers`
--

CREATE TABLE `messagereceivers` (
  `MessageID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `messagereceivers`
--

INSERT INTO `messagereceivers` (`MessageID`, `UserID`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `messages`
--

CREATE TABLE `messages` (
  `ID` int(11) NOT NULL,
  `senderUserID` int(11) NOT NULL,
  `message` varchar(5000) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `messages`
--

INSERT INTO `messages` (`ID`, `senderUserID`, `message`, `date`) VALUES
(1, 13, 'Nagyon fontos üzenet!', '2025-04-09 19:29:19');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `studentgroups`
--

CREATE TABLE `studentgroups` (
  `GroupID` int(11) NOT NULL,
  `StudentID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `studentgroups`
--

INSERT INTO `studentgroups` (`GroupID`, `StudentID`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10),
(2, 11);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `students`
--

CREATE TABLE `students` (
  `ID` int(11) NOT NULL,
  `name` varchar(60) NOT NULL,
  `DoB` datetime NOT NULL,
  `address` varchar(60) NOT NULL,
  `phone` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `userId` int(11) NOT NULL,
  `OMID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `students`
--

INSERT INTO `students` (`ID`, `name`, `DoB`, `address`, `phone`, `email`, `userId`, `OMID`) VALUES
(1, 'litvan.laci', '2018-04-06 00:00:00', 'Cegléd Kossúth Sándor u. 2', '36301234567', 'litvan.laci@gmail.com', 1, 1231231),
(2, 'uborka.ubul', '2018-09-02 00:00:00', 'Cegléd Kossúth Sándor u. 3', '36301234567', 'uborka.ubul@gmail.com', 2, 1231232),
(3, 'kalapacs.karoly', '2018-05-13 00:00:00', 'Cegléd Kossúth Sándor u. 4', '36301234567', 'kalapacs.karoly@gmail.com', 3, 1231233),
(4, 'cinege.cecil', '2018-04-19 00:00:00', 'Cegléd Kossúth Sándor u. 5', '36301234567', 'cinege.cecil@gmail.com', 4, 1231234),
(5, 'elemer.eniko', '2018-11-23 00:00:00', 'Cegléd Kossúth Sándor u. 6', '36301234567', 'elemer.eniko@gmail.com', 5, 1231235),
(6, 'antal.aniko', '2018-02-18 00:00:00', 'Cegléd Kossúth Sándor u. 7', '36301234567', 'antal.aniko@gmail.com', 6, 1231236),
(7, 'cinege.katalin', '2018-07-08 00:00:00', 'Cegléd Kossúth Sándor u. 11', '36301234567', 'cinege.katalin@gmail.com', 7, 1231237),
(8, 'ordas.odon', '2018-01-15 00:00:00', 'Cegléd Kossúth Sándor u. 8', '36301234567', 'ordas.odon@gmail.com', 8, 1231238),
(9, 'papp.petra', '2018-09-01 00:00:00', 'Cegléd Kossúth Sándor u. 9', '36301234567', 'papp.petrat@gmail.com', 9, 1231239),
(10, 'rokus.robert', '2018-10-10 00:00:00', 'Cegléd Kossúth Sándor u. 9', '36301234567', 'rokus.robert@gmail.com', 10, 12312310),
(11, 'palacsinta.peter', '2018-06-06 00:00:00', 'Cegléd Kossúth Sándor u. 10', '36301234567', 'palacsinta.peter@gmail.com', 11, 12312311);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `teachers`
--

CREATE TABLE `teachers` (
  `ID` int(11) NOT NULL,
  `name` varchar(60) NOT NULL,
  `phone` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `teachers`
--

INSERT INTO `teachers` (`ID`, `name`, `phone`, `email`, `userId`) VALUES
(1, 'papp.lajos', '36301234567', 'papp.lajos@gmail.com', 12),
(2, 'cegledi.eniko', '36301234567', 'cegledi.eniko@gmail.com', 13),
(3, 'kovacsne.hajdu.jolan', '36301234567', 'kovacsne.hajdu.jolan@gmail.com', 14);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `username` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `role` enum('diak','tanar','szulo','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`ID`, `username`, `password`, `role`) VALUES
(1, 'litvan.laci', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'diak'),
(2, 'uborka.ubul', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'diak'),
(3, 'kalapacs.karoly', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'diak'),
(4, 'cinege.cecil', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'diak'),
(5, 'elemer.eniko', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'diak'),
(6, 'antal.aniko', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'diak'),
(7, 'cinege.katalin', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'diak'),
(8, 'ordas.odon', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'diak'),
(9, 'papp.petra', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'diak'),
(10, 'rokus.robert', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'diak'),
(11, 'palacsinta.peter', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'diak'),
(12, 'papp.lajos', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'tanar'),
(13, 'cegledi.eniko', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'tanar'),
(14, 'kovacsne.hajdu.jolan', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'tanar'),
(15, 'litvan.jeno', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'szulo'),
(16, 'uborkane.matilda', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'szulo'),
(17, 'kalapacs.bence', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'szulo'),
(18, 'cinegene.sara', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'szulo'),
(19, 'elemer.emil', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'szulo'),
(20, 'antal.andras', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'szulo'),
(21, 'ordas.kristof', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'szulo'),
(22, 'papp.terez', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'szulo'),
(23, 'rokus.jozsef', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'szulo'),
(24, 'palacsinta.pedro', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'szulo'),
(25, 'szabo.patrik', '$2b$10$xgg6/sn4VR5Kjwn4Kp1KVOifnsH6lJ6w4ehY.0DKceYfG6j51x1Qy', 'admin');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `absences`
--
ALTER TABLE `absences`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `studentID` (`studentID`),
  ADD KEY `teacherID` (`teacherID`),
  ADD KEY `lessonID` (`lessonID`);

--
-- A tábla indexei `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- A tábla indexei `assignmentfiles`
--
ALTER TABLE `assignmentfiles`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `assignmentID` (`assignmentID`);

--
-- A tábla indexei `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `teacherID` (`teacherID`);

--
-- A tábla indexei `classdistruptions`
--
ALTER TABLE `classdistruptions`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `teacherID` (`teacherID`);

--
-- A tábla indexei `completedassignmentfiles`
--
ALTER TABLE `completedassignmentfiles`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `assignmentID` (`assignmentID`);

--
-- A tábla indexei `completedassignments`
--
ALTER TABLE `completedassignments`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `assignmentID` (`assignmentID`),
  ADD KEY `studentID` (`studentID`);

--
-- A tábla indexei `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `guardians`
--
ALTER TABLE `guardians`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- A tábla indexei `guardianstudents`
--
ALTER TABLE `guardianstudents`
  ADD PRIMARY KEY (`GuardianID`,`StudentID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- A tábla indexei `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `groupID` (`groupID`),
  ADD KEY `teacherID` (`teacherID`);

--
-- A tábla indexei `marks`
--
ALTER TABLE `marks`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `teacherID` (`teacherID`),
  ADD KEY `studentID` (`studentID`);

--
-- A tábla indexei `messagereceivers`
--
ALTER TABLE `messagereceivers`
  ADD PRIMARY KEY (`MessageID`,`UserID`),
  ADD KEY `UserID` (`UserID`);

--
-- A tábla indexei `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `senderUserID` (`senderUserID`);

--
-- A tábla indexei `studentgroups`
--
ALTER TABLE `studentgroups`
  ADD PRIMARY KEY (`GroupID`,`StudentID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- A tábla indexei `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `userId` (`userId`),
  ADD UNIQUE KEY `OMID` (`OMID`);

--
-- A tábla indexei `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `absences`
--
ALTER TABLE `absences`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `admins`
--
ALTER TABLE `admins`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `assignmentfiles`
--
ALTER TABLE `assignmentfiles`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `assignments`
--
ALTER TABLE `assignments`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `classdistruptions`
--
ALTER TABLE `classdistruptions`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `completedassignmentfiles`
--
ALTER TABLE `completedassignmentfiles`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `completedassignments`
--
ALTER TABLE `completedassignments`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `groups`
--
ALTER TABLE `groups`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `guardians`
--
ALTER TABLE `guardians`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `lessons`
--
ALTER TABLE `lessons`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT a táblához `marks`
--
ALTER TABLE `marks`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT a táblához `messages`
--
ALTER TABLE `messages`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `students`
--
ALTER TABLE `students`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `teachers`
--
ALTER TABLE `teachers`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `absences`
--
ALTER TABLE `absences`
  ADD CONSTRAINT `absences_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `students` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `absences_ibfk_2` FOREIGN KEY (`teacherID`) REFERENCES `teachers` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `absences_ibfk_3` FOREIGN KEY (`lessonID`) REFERENCES `lessons` (`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Megkötések a táblához `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Megkötések a táblához `assignmentfiles`
--
ALTER TABLE `assignmentfiles`
  ADD CONSTRAINT `assignmentfiles_ibfk_1` FOREIGN KEY (`assignmentID`) REFERENCES `assignments` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`teacherID`) REFERENCES `teachers` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Megkötések a táblához `classdistruptions`
--
ALTER TABLE `classdistruptions`
  ADD CONSTRAINT `classdistruptions_ibfk_1` FOREIGN KEY (`teacherID`) REFERENCES `teachers` (`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Megkötések a táblához `completedassignmentfiles`
--
ALTER TABLE `completedassignmentfiles`
  ADD CONSTRAINT `completedassignmentfiles_ibfk_1` FOREIGN KEY (`assignmentID`) REFERENCES `completedassignments` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `completedassignments`
--
ALTER TABLE `completedassignments`
  ADD CONSTRAINT `completedassignments_ibfk_1` FOREIGN KEY (`assignmentID`) REFERENCES `assignments` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `completedassignments_ibfk_2` FOREIGN KEY (`studentID`) REFERENCES `students` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Megkötések a táblához `guardians`
--
ALTER TABLE `guardians`
  ADD CONSTRAINT `guardians_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Megkötések a táblához `guardianstudents`
--
ALTER TABLE `guardianstudents`
  ADD CONSTRAINT `guardianstudents_ibfk_1` FOREIGN KEY (`GuardianID`) REFERENCES `guardians` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `guardianstudents_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `students` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`groupID`) REFERENCES `groups` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `lessons_ibfk_2` FOREIGN KEY (`teacherID`) REFERENCES `teachers` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `marks`
--
ALTER TABLE `marks`
  ADD CONSTRAINT `marks_ibfk_1` FOREIGN KEY (`teacherID`) REFERENCES `teachers` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `marks_ibfk_2` FOREIGN KEY (`studentID`) REFERENCES `students` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Megkötések a táblához `messagereceivers`
--
ALTER TABLE `messagereceivers`
  ADD CONSTRAINT `messagereceivers_ibfk_1` FOREIGN KEY (`MessageID`) REFERENCES `messages` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `messagereceivers_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`senderUserID`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Megkötések a táblához `studentgroups`
--
ALTER TABLE `studentgroups`
  ADD CONSTRAINT `studentgroups_ibfk_1` FOREIGN KEY (`GroupID`) REFERENCES `groups` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentgroups_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `students` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Megkötések a táblához `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
