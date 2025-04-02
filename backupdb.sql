-- --------------------------------------------------------
-- Host:                         C:\Users\marco\Desktop\web\ProgettoWEB2-main\genshin.db
-- Versione server:              3.48.0
-- S.O. server:                  
-- HeidiSQL Versione:            12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dump dei dati della tabella genshin.personaggi: 13 rows
/*!40000 ALTER TABLE "personaggi" DISABLE KEYS */;
INSERT INTO "personaggi" ("id", "nome", "immagine", "elemento", "rarità") VALUES
	(1, 'xingqiu', '/images/personaggi/xingqiu.png', 'hydro', 4),
	(2, 'raiden shogun', '/images/personaggi/raiden-shogun.png', 'electro', 5),
	(3, 'ayaka', '/images/personaggi/ayaka.png', 'cryo', 5),
	(4, 'kazuha', '/images/personaggi/kazuha.png', 'anemo', 5),
	(5, 'lynette', '/images/personaggi/lynette.png', 'anemo', 4),
	(6, 'baizhu', '/images/personaggi/baizhu.png', 'dendro', 5),
	(7, 'arlecchino', '/images/personaggi/arlecchino.png', 'pyro', 5),
	(8, 'diluc', '/images/personaggi/diluc.png', 'pyro', 5),
	(9, 'kaeya', '/images/personaggi/kaeya.png', 'cryo', 4),
	(10, 'clorinde', '/images/personaggi/clorinde.png', 'electro', 5),
	(11, 'kokomi', '/images/personaggi/kokomi.png', 'hydro', 5),
	(12, 'alhaitam', '/images/personaggi/alhaitam.png', 'dendro', 5),
	(13, 'yanfei', '/images/personaggi/yanfai.png', 'pyro', 4);
/*!40000 ALTER TABLE "personaggi" ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
