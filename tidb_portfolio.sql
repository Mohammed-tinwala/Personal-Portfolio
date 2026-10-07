-- MySQL dump 10.13  Distrib 26.7.0, for macos27.0 (arm64)
--
-- Host: localhost    Database: personal_portfolio
-- ------------------------------------------------------
-- Server version	26.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '7c07bb8e-c1b9-11f1-bdfc-9722e61bd2ce:1-40';

--
-- Table structure for table `about`
--

DROP TABLE IF EXISTS `about`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `heading` varchar(255) NOT NULL,
  `description` text,
  `education` varchar(255) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about`
--

LOCK TABLES `about` WRITE;
/*!40000 ALTER TABLE `about` DISABLE KEYS */;
INSERT INTO `about` VALUES (1,'Building useful products with code and UI/UX design.','I\'m Mohammed Tinwala, a MERN Stack Developer focused on building practical web applications with clean and intuitive interfaces.','B.Tech ECE — RTU Kota, 2025','Frontend Developer / UI-UX Designer','Kota, Rajasthan, India',NULL,1,'2026-10-07 08:21:35','2026-10-07 12:58:33');
/*!40000 ALTER TABLE `about` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin') NOT NULL DEFAULT 'admin',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_users`
--

LOCK TABLES `admin_users` WRITE;
/*!40000 ALTER TABLE `admin_users` DISABLE KEYS */;
INSERT INTO `admin_users` VALUES (1,'Mohammed Tinwala','admin@example.com','PASTE_YOUR_BCRYPT_HASH_HERE','admin',1,'2026-10-07 10:53:44','2026-10-07 10:53:44'),(2,'Mohammed Tinwala','tinwalamohammed98@gmail.com','$2b$12$2m6QJ7dQOljzMBMszQ6kM.BSVV9YeJhNHbG0pA4ZLDAxqY4ClyIF2','admin',1,'2026-10-07 10:55:53','2026-10-07 11:48:09');
/*!40000 ALTER TABLE `admin_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES (1,'Test User','test@example.com','Portfolio Test','This is a test message from the portfolio contact form.',0,'2026-10-07 08:49:30','2026-10-07 08:49:30'),(2,'Steve Harvey','steveharvey98@gmail.com','test','test',0,'2026-10-07 09:16:17','2026-10-07 09:16:17'),(3,'Rakesh Sharma','rakesharma@gmail.com','hiring','ajao kaam karne',1,'2026-10-07 18:58:58','2026-10-07 18:59:12');
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `education`
--

DROP TABLE IF EXISTS `education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `education` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `institution_name` varchar(200) NOT NULL,
  `degree` varchar(150) NOT NULL,
  `field_of_study` varchar(150) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `start_year` year DEFAULT NULL,
  `end_year` year DEFAULT NULL,
  `grade` varchar(50) DEFAULT NULL,
  `description` text,
  `institution_url` varchar(255) DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `education`
--

LOCK TABLES `education` WRITE;
/*!40000 ALTER TABLE `education` DISABLE KEYS */;
INSERT INTO `education` VALUES (1,'UD Rajasthan Technical University','B.Tech','Electronics & Communication Engineering','Kota, Rajasthan, India',2021,2025,'9.78 CGPA','RTU was established in 2006 by the Government of Rajasthan to enhance the technical education in the state.','https://www.rtu.ac.in/index/',1,1,'2026-10-07 08:28:55','2026-10-07 18:45:34');
/*!40000 ALTER TABLE `education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experience`
--

DROP TABLE IF EXISTS `experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experience` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `company_name` varchar(150) NOT NULL,
  `job_title` varchar(150) NOT NULL,
  `location` varchar(150) DEFAULT NULL,
  `employment_type` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_current` tinyint(1) NOT NULL DEFAULT '0',
  `description` text,
  `technologies` json DEFAULT NULL,
  `company_url` varchar(255) DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experience`
--

LOCK TABLES `experience` WRITE;
/*!40000 ALTER TABLE `experience` DISABLE KEYS */;
INSERT INTO `experience` VALUES (1,'Doorstep Services lmd','Frontend Developer / UI-UX Designer','Kota, Rajasthan, India','Full-time','2024-12-31',NULL,1,'Working on modern web applications with a focus on frontend development, responsive interfaces and UI/UX design.','[\"React\", \"JavaScript\", \"Tailwind CSS\", \"PHP\", \"MySQL\", \"Figma\"]',NULL,1,1,'2026-10-07 08:27:09','2026-10-07 18:29:33');
/*!40000 ALTER TABLE `experience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hero`
--

DROP TABLE IF EXISTS `hero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hero` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `headline` varchar(255) NOT NULL,
  `description` text,
  `primary_button_text` varchar(100) DEFAULT 'View Projects',
  `primary_button_url` varchar(255) DEFAULT '/projects',
  `secondary_button_text` varchar(100) DEFAULT 'Contact Me',
  `secondary_button_url` varchar(255) DEFAULT '/contact',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hero`
--

LOCK TABLES `hero` WRITE;
/*!40000 ALTER TABLE `hero` DISABLE KEYS */;
INSERT INTO `hero` VALUES (1,'Mohammed Tinwala','MERN/MEAN Stack Developer','I build practical web applications with clean interfaces and modern technologies.','View Projects','/projects','Contact Me','/contact',1,'2026-10-07 08:18:42','2026-10-07 12:52:15');
/*!40000 ALTER TABLE `hero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `github_url` varchar(255) DEFAULT NULL,
  `live_url` varchar(255) DEFAULT NULL,
  `technologies` json DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'LBS App','Web Application','A mobile-focused student and parent portal built to manage academics, attendance, fees, PTM bookings, hostel information, notifications and other student services.','https://www.lbscentre.in/images/img09.jpg',NULL,NULL,'[\"React\", \"Tailwind CSS\", \"PHP\", \"MySQL\", \"Capacitor\"]',1,1,1,'2026-10-06 19:20:46','2026-10-07 13:34:41'),(2,'AI Interview Prep','AI / Full Stack','A full-stack AI-powered interview preparation platform designed to help users practice interviews, generate questions and improve their preparation.','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSear415z-EOHe3ti5eqjPgqc1_7qOpcnRMu0oDzaju_w&s=10',NULL,NULL,'[\"React\", \"Node.js\", \"Express\", \"MongoDB\", \"AI\"]',1,1,2,'2026-10-06 19:20:46','2026-10-07 13:36:09'),(3,'Babji Pipes','Business Website','A modern business website designed to present products and services with a clean, responsive interface and straightforward user experience.','https://www.babjibestpipes.com/images/office/office2.jpeg',NULL,NULL,'[\"React\", \"JavaScript\", \"Tailwind CSS\"]',0,1,3,'2026-10-06 19:20:46','2026-10-07 13:33:06'),(4,'KOOL','Web Application','A responsive web experience focused on clean visual design, intuitive navigation and a modern user interface.','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwIS5cidk2GexgoAvcKJ1NfLEzoYJKa69ppA1v-q9URFNUhc-HcAcXWpE_&s=10',NULL,NULL,'[\"React\", \"JavaScript\", \"Tailwind CSS\"]',0,1,4,'2026-10-06 19:20:46','2026-10-07 13:32:03'),(5,'SkiiPass Baltics','Web Application','A modern web project built with a focus on responsive layouts, smooth interactions and a simple user experience.','https://www.skipassbaltics.eu/img/skipasslogo.png',NULL,NULL,'[\"React\", \"JavaScript\", \"Tailwind CSS\"]',0,1,5,'2026-10-06 19:20:46','2026-10-07 13:31:10');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `site_name` varchar(150) NOT NULL DEFAULT 'Mohammed Tinwala',
  `site_title` varchar(255) DEFAULT NULL,
  `site_description` text,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `github_url` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `resume_url` varchar(255) DEFAULT NULL,
  `availability_status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES (1,'Mohammed Tinwala','MERN Stack Developer','MERN Stack Developer building practical and innovative web applications with clean and intuitive design.','tinwalamohammed98@gmail.com','8824707193','Kota, Rajasthan, India',NULL,NULL,NULL,1,'2026-10-07 08:14:19','2026-10-07 12:42:57');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category` enum('frontend','backend','database','tools','other') NOT NULL DEFAULT 'other',
  `icon` varchar(100) DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (1,'React','frontend',NULL,1,1,'2026-10-07 08:23:36','2026-10-07 08:23:36'),(2,'JavaScript','frontend',NULL,2,1,'2026-10-07 08:23:36','2026-10-07 08:23:36'),(3,'Tailwind CSS','frontend',NULL,3,1,'2026-10-07 08:23:36','2026-10-07 08:23:36'),(4,'HTML','frontend',NULL,4,1,'2026-10-07 08:23:36','2026-10-07 08:23:36'),(5,'CSS','frontend',NULL,5,1,'2026-10-07 08:23:36','2026-10-07 08:23:36'),(6,'Node.js','backend',NULL,6,1,'2026-10-07 08:23:36','2026-10-07 08:23:36'),(7,'Express.js','backend',NULL,7,1,'2026-10-07 08:23:36','2026-10-07 08:23:36'),(8,'PHP','backend',NULL,8,1,'2026-10-07 08:23:36','2026-10-07 08:23:36'),(9,'MongoDB','database',NULL,9,1,'2026-10-07 08:23:36','2026-10-07 08:23:36'),(10,'MySQL','database',NULL,10,1,'2026-10-07 08:23:36','2026-10-07 08:23:36'),(11,'Git','tools',NULL,11,1,'2026-10-07 08:23:36','2026-10-07 08:23:36'),(12,'GitHub','tools',NULL,12,1,'2026-10-07 08:23:36','2026-10-07 08:23:36'),(13,'Figma','tools',NULL,13,1,'2026-10-07 08:23:36','2026-10-07 08:23:36'),(14,'Java','backend',NULL,6,1,'2026-10-07 13:09:17','2026-10-07 13:09:17');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-08  1:31:34
