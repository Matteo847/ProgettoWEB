const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('genshin.db', (err) => {
    if (err) {
        console.error("Errore durante l'apertura del database:", err.message);
    } else {
        console.log("Connessione al database SQLite stabilita.");
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS utenti (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mail TEXT UNIQUE,
            nome TEXT,
            cognome TEXT,
            password TEXT NOT NULL,
            ruolo TEXT DEFAULT 'utente'
        );
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella utenti:", err.message);
    });
    db.run(`
        CREATE TABLE IF NOT EXISTS personaggi (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            immagine TEXT NOT NULL,
            elemento TEXT NOT NULL,
            rarità TINYINT NOT NULL,
            descrizione TEXT NOT NULL
        );
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella utenti:", err.message);
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS artefatti (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            immagine TEXT NOT NULL,
            categoria TEXT NOT NULL
        );
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella utenti:", err.message);
    });
    db.run(`
        INSERT INTO "personaggi" ("id", "nome", "immagine", "elemento", "rarità", "descrizione") VALUES
        (1, 'albedo', '/images/character/character-albedo-card.png', 'Geo', 5, 'Geniale alchimista e Capitano delle Indagini dei Cavalieri di Favonius. Usa il potere Geo per creare piattaforme e amplificare i danni di squadra con la sua abilità Transient Blossoms.'),
        (2, 'alhaitham', '/images/character/character-alhaitham-card.png', 'Dendro', 5, 'Erudito di Sumeru dall''intelletto straordinario, combina la sua mente analitica con le abilità Dendro. Utilizza le Lente Chiare per infliggere danni coordinati e potenziare le reazioni elementali.'),
        (3, 'aloy', '/images/character/character-aloy-card.png', 'Cryo', 5, 'Cacciatrice proveniente da un altro mondo, utilizza la sua tecnologia avanzata e il potere Cryo per scatenare tempeste di ghiaccio con il suo arco e creare trappole esplosive congelanti.'),
        (4, 'amber', '/images/character/character-amber-card.png', 'Pyro', 4, 'L''unica Outrider dei Cavalieri di Favonius, sempre allegra e pronta ad aiutare. Utilizza il suo arco e il suo coniglietto esplosivo Baron Bunny per infliggere danni Pyro in area.'),
        (5, 'arataki itto', '/images/character/character-arataki-itto-card.png', 'Geo', 5, 'Leader della Banda Arataki, combattente esuberante che brandisce una claymore. Durante il suo burst si trasforma evocando il suo alter ego Oni, aumentando drasticamente la sua forza d''attacco e la velocità.'),
        (6, 'ayaka', '/images/character/character-kamisato-ayaka-card.png', 'Cryo', 5, 'Figlia del Clan Kamisato, combatte con grazia ed eleganza utilizzando la sua spada e abilità Cryo. Il suo dash unico le permette di muoversi sui campi ghiacciati e applicare l''elemento Cryo ai nemici.'),
        (7, 'ayato', '/images/character/character-kamisato-ayato-card.png', 'Hydro', 5, 'Capo del Clan Kamisato e Commissario della Yashiro Commission. Il suo stile di combattimento elegante con la spada crea un campo d''acqua che aumenta la velocità d''attacco del team e infligge danni Hydro in area.'),
        (8, 'baizhu', '/images/character/character-baizhu-card.png', 'Dendro', 5, 'Rispettato medico del Bubu Pharmacy, accompagnato dal serpente parlante Changsheng. Utilizza il potere Dendro per curare i compagni di squadra e fornire scudi protettivi basati sulla sua vitalità massima.'),
        (9, 'barbara', '/images/character/character-barbara-card.png', 'Hydro', 4, 'Diaconessa della Chiesa di Favonius e idol di Mondstadt. Le sue melodie e abilità Hydro curano costantemente il team, mentre il suo burst può ripristinare una grande quantità di HP a tutti i membri del gruppo istantaneamente.'),
        (10, 'beidou', '/images/character/character-beidou-card.png', 'Electro', 4, 'Capitana della flotta Crux, maestra nel parare attacchi con il suo perfetto tempismo. La sua abilità di contrattacco trasforma il danno ricevuto in potenti fulmini Electro, mentre il suo burst crea una barriera elettrica che colpisce i nemici.'),
        (11, 'bennett', '/images/character/character-bennett-card.png', 'Pyro', 4, 'Avventuriero sfortunato ma ottimista, le cui abilità Pyro forniscono incredibile supporto. Il suo burst crea un campo che cura e aumenta l''ATK dei personaggi, rendendolo uno dei migliori supporti nel gioco.'),
        (12, 'candace', '/images/character/character-candace-card.png', 'Hydro', 4, 'Guardiana di Aaru Village del deserto di Sumeru, combatte con una lancia e uno scudo. Le sue abilità Hydro potenziano gli attacchi normali del team e forniscono infusione elementale, creando nuove sinergie di combattimento.'),
        (13, 'charlotte', '/images/character/character-charlotte-card.png', 'Cryo', 4, 'Reporter del Fontaine Gazette, curiosa e determinata a scoprire la verità. Usa il suo potere Cryo e la sua macchina fotografica per catturare informazioni e curare i compagni di squadra, bilanciando attacco e supporto.'),
        (15, 'chongyun', '/images/character/character-chongyun-card.png', 'Cryo', 4, 'Esorcista che utilizza il potere Cryo per purificare gli spiriti maligni. La sua abilità elementale crea un campo che infonde gli attacchi normali con l''elemento Cryo, rendendo possibili potenti combinazioni elementali.'),
        (16, 'collei', '/images/character/character-collei-card.png', 'Dendro', 4, 'Giovane ranger di Sumeru con un passato difficile, ora dedicata a proteggere la foresta. Il suo piccolo compagno meccanico Cuilein-Anbar l''aiuta durante la battaglia, infliggendo danni Dendro supplementari.'),
        (17, 'cyno', '/images/character/character-cyno-card.png', 'Electro', 5, 'Generale Mahamatra di Sumeru, applica le leggi con precisione e velocità. Durante il suo burst entra in uno stato potenziato che accelera i suoi attacchi Electro e aumenta i danni delle reazioni elementali a base di Electro.'),
        (18, 'dehya', '/images/character/character-dehya-card.png', 'Pyro', 5, 'Mercenaria d''élite degli Eremites, protettrice leale e potente combattente. Utilizza la sua claymore e il potere Pyro per assorbire danni destinati ai compagni di squadra e contrattaccare con fiamme devastanti.'),
        (19, 'diluc', '/images/character/character-diluc-card.png', 'Pyro', 5, 'Proprietario dell''Angel''s Share e nobile di Mondstadt. Brandisce la sua claymore con maestria, incanalandovi il potere Pyro. Il suo burst avvolge la sua arma in fiamme, aumentando la portata e potenza dei suoi attacchi.'),
        (20, 'diona', '/images/character/character-diona-card.png', 'Cryo', 4, 'Giovane bartender del Cat''s Tail con caratteristiche feline. Nonostante odi l''industria del vino, è incredibilmente abile nel creare cocktail. Le sue frecce Cryo creano scudi potenti e campi di guarigione per il team.'),
        (21, 'dori', '/images/character/character-dori-card.png', 'Electro', 4, 'Commerciante astuta e mercante di Sumeru, accompagnata dal suo genio magico. Usa la sua claymore e potere Electro per generare energia per il team, risultando un''ottima batteria elementale e supporto tattico.'),
        (22, 'eula', '/images/character/character-eula-card.png', 'Cryo', 5, 'Capitana dei Reconnaissance dei Cavalieri di Favonius e discendente del clan Lawrence. Il suo stile di combattimento con la claymore le permette di accumulare stack Grimheart che esplodono in devastanti danni fisici con il suo burst.'),
        (23, 'faruzan', '/images/character/character-faruzan-card.png', 'Anemo', 4, 'Accademica di Sumeru specializzata in meccanismi antichi. Le sue abilità Anemo riducono la resistenza nemica agli elementi dello stesso tipo, potenziando notevolmente i personaggi Anemo nel team con i suoi buff tecnici.'),
        (24, 'fischl', '/images/character/character-fischl-card.png', 'Electro', 4, 'Investigatrice dell''Adventurers'' Guild dalla fervida immaginazione. Evoca il suo corvo Oz per infliggere continui danni Electro anche quando non è in campo, rendendola un''eccellente sub-DPS e generatrice di particelle elementali.'),
        (25, 'freminet', '/images/character/character-freminet-card.png', 'Cryo', 4, 'Sommozzatore professionista di Fontaine, cerca sua sorella scomparsa nelle profondità. Utilizza la sua mole imponente e il suo potere Cryo per sferrare potenti colpi con i suoi guanti da combattimento pressurizzati.'),
        (26, 'furina', '/images/character/character-furina-card.png', 'Hydro', 5, 'Archon Hydro di Fontaine, incarnazione della giustizia e dell''arte. Le sue abilità combinano performance teatrali con poteri acquatici devastanti, cambiando stile di gioco in base alle "Fanfare" e ai "Lamenti" che accumula durante la battaglia.'),
        (27, 'ganyu', '/images/character/character-ganyu-card.png', 'Cryo', 5, 'Segretaria della Liyue Qixing, metà umana e metà adeptus Qilin. Eccelle nei combattimenti a distanza con il suo arco, potendo caricare frecce che esplodono in aree di ghiaccio, infliggendo enormi danni Cryo.'),
        (28, 'gorou', '/images/character/character-gorou-card.png', 'Geo', 4, 'Generale dell''esercito di Watatsumi Island, dalle caratteristiche canine. Fornisce buff basati sul numero di personaggi Geo nel team, aumentando difesa, resistenza all''interruzione e danni Geo per ottimizzare squadre mono-elemento.'),
        (29, 'heizou', '/images/character/character-shikanoin-heizou-card.png', 'Anemo', 4, 'Detective della Tenryou Commission, risolve i casi usando la sua mente brillante e intuito acuto. In battaglia utilizza arti marziali e potere Anemo, con attacchi caricati che possono stordire i nemici con un singolo pugno concentrato.'),
        (30, 'hu tao', '/images/character/character-hu-tao-card.png', 'Pyro', 5, 'Direttrice della Wangsheng Funeral Parlor, bilancia la vita e la morte. La sua meccanica unica sacrifica HP per entrare in uno stato potenziato che aumenta drasticamente il suo ATK, mentre le sue abilità possono anche curarla durante i combattimenti.'),
        (31, 'jean', '/images/character/character-jean-card.png', 'Anemo', 5, 'Gran Maestra Interiore dei Cavalieri di Favonius, incarnazione di dedizione e servizio. Bilancia abilità di guarigione e attacco, potendo curare l''intero team con il suo burst mentre lancia i nemici in aria con le sue abilità Anemo.'),
        (32, 'kaeya', '/images/character/character-kaeya-card.png', 'Cryo', 4, 'Capitano Cavalry dei Cavalieri di Favonius, enigmatico e misterioso. Usa la sua spada e abilità Cryo per infliggere danni continui ai nemici, mentre il suo burst crea lame orbitanti di ghiaccio che colpiscono più bersagli.'),
        (33, 'kaveh', '/images/character/character-kaveh-card.png', 'Dendro', 4, 'Architetto rinomato di Sumeru, dalla personalità artistica e passionale. Brandisce una claymore con eleganza e usa il potere Dendro per creare costrutti naturali che amplificano le reazioni elementali del team.'),
        (34, 'kazuha', '/images/character/character-kazuha-card.png', 'Anemo', 5, 'Samurai errante di Inazuma, maestro della spada e della poesia. Manipola gli elementi con il suo potere Anemo, offrendo mobilità aerea unica e la capacità di potenziare i danni elementali del team attraverso la Swirl Reaction.'),
        (35, 'keqing', '/images/character/character-keqing-card.png', 'Electro', 5, 'Yuheng della Liyue Qixing, efficiente e dedicata al suo lavoro. Si muove rapidamente sul campo di battaglia grazie alle sue abilità Electro di teletrasporto, eseguendo rapidi attacchi con la spada e combo elettriche devastanti.'),
        (36, 'kirara', '/images/character/character-kirara-card.png', 'Dendro', 4, 'Corriere di Sumeru dalla natura felina nekomata, può trasformarsi per trasportare oggetti e persone. Le sue abilità Dendro le permettono di creare scudi protettivi e muoversi rapidamente in una forma alternativa più agile.'),
        (37, 'klee', '/images/character/character-klee-card.png', 'Pyro', 5, 'La "Spark Knight" di Mondstadt, giovane esperta in esplosivi. I suoi attacchi Pyro con il catalizzatore creano esplosioni in area che possono stordire i nemici, mentre le sue bombe possono essere posizionate strategicamente sul campo.'),
        (38, 'kokomi', '/images/character/character-sangonomiya-kokomi-card.png', 'Hydro', 5, 'Divine Priestess e leader di Watatsumi Island, strategist brillante. Il suo potere Hydro fornisce costante guarigione al team, compensando il suo difetto di non poter infliggere colpi critici con bonus di cura e danni aumentati.'),
        (39, 'kuki shinobu', '/images/character/character-kuki-shinobu-card.png', 'Electro', 4, 'Vice leader della Arataki Gang, ex studentessa di legge. Combatte con una spada e abilità Electro, sacrificando parte della sua vita per fornire guarigione costante al team e applicare l''elemento Electro ai nemici.'),
        (41, 'lisa', '/images/character/character-lisa-card.png', 'Electro', 4, 'Librarian dei Cavalieri di Favonius e potente maga, tornata a Mondstadt dopo aver studiato a Sumeru. Manipola l''elemento Electro con il suo catalizzatore, lanciando fulmini che possono marcare i nemici per poi scatenare potenti scariche elettriche.'),
        (42, 'lynette', '/images/character/character-lynette-card.png', 'Anemo', 4, 'Artista di strada e prestigiatrice di Fontaine, sempre in coppia con suo fratello Lyney. Usa agilità e ingegnosità con i suoi poteri Anemo, potendo purificare i membri del team da effetti negativi e intrappolare i nemici in illusioni aeree.'),
        (43, 'lyney', '/images/character/character-lyney-card.png', 'Pyro', 5, 'Mago illusionista di Fontaine che si esibisce con sua sorella Lynette. Manipola l''elemento Pyro per creare spettacolari attacchi a distanza con il suo arco, evocando anche un assistente che potenzia i suoi colpi caricati.'),
        (44, 'mika', '/images/character/character-mika-card.png', 'Cryo', 4, 'Cartografo e surveyor dei Cavalieri di Favonius, preciso e metodico. Usa la sua lancia e abilità Cryo con precisione militare, fornendo buff di velocità d''attacco e cura ai compagni di squadra basati sul suo stile di combattimento ritmico.'),
        (45, 'mona', '/images/character/character-mona-card.png', 'Hydro', 5, 'Astrolog e scriba, capace di leggere il destino nelle stelle. Usa il suo catalizzatore e poteri Hydro per muoversi rapidamente sull''acqua e intrappolare i nemici in bolle astrali che amplificano i danni ricevuti durante il suo burst.'),
        (48, 'neuvillette', '/images/character/character-neuvillette-card.png', 'Hydro', 5, 'Giudice Supremo di Fontaine, legato a una misteriosa creatura acquatica. Il suo stile di combattimento elegante con il catalizzatore gli permette di incanalare attacchi caricati più rapidamente, scatenando vortici d''acqua e giudizi supremi sui nemici.'),
        (49, 'nilou', '/images/character/character-nilou-card.png', 'Hydro', 5, 'Danzatrice del Zubayr Theater di Sumeru, specializzata nella danza del loto. I suoi movimenti fluidi e il potere Hydro generano una reazione Bloom unica chiamata "Bountiful Cores" quando nel team sono presenti solo personaggi Hydro e Dendro.'),
        (50, 'ningguang', '/images/character/character-ningguang-card.png', 'Geo', 4, 'Tianquan della Liyue Qixing e ricca donna d''affari. Usa il potere Geo per lanciare gemme preziose dai suoi attacchi con catalizzatore e costruire barriere di giada che possono sia proteggere che essere sacrificate per infliggere danni.'),
        (51, 'noelle', '/images/character/character-noelle-card.png', 'Geo', 4, 'Cameriera aspirante Cavaliere di Favonius dall''incredibile forza. Il suo burst trasforma i suoi attacchi in ampi fendenti Geo che guariscono i membri del team, mentre il suo scudo assorbe danni e può contrattaccare automaticamente.'),
        (52, 'qiqi', '/images/character/character-qiqi-card.png', 'Cryo', 5, 'Apprendista erborista del Bubu Pharmacy, zombie immortale preservata dall''adeptus. Usa poteri Cryo principalmente per curare, applicando talismani ai nemici che permettono ai membri della squadra di recuperare salute attaccando i nemici marchiati.'),
        (53, 'raiden shogun', '/images/character/character-raiden-shogun-card.png', 'Electro', 5, 'L''Electro Archon e governatrice di Inazuma, custode dell''eternità. Usa la sua lancia e potente Energy Recharge per colpire i nemici con fulmini divini, ricaricando le energie del team durante il suo burst quando impugna la spada Musou Isshin.'),
        (54, 'razor', '/images/character/character-razor-card.png', 'Electro', 4, 'Giovane cresciuto dai lupi di Wolvendom, selvaggio ma leale. Combatte con la sua claymore e il potere Electro in uno stile brutale, evocando lo spirito di un lupo elettrico durante il burst che aumenta velocità e danni dei suoi attacchi.'),
        (55, 'rosaria', '/images/character/character-rosaria-card.png', 'Cryo', 4, 'Suora non convenzionale della Chiesa di Favonius, più simile a un''assassina. Usa la sua lancia e abilità Cryo per teletrasportarsi dietro ai nemici con attacchi veloci e letali, aumentando anche il CRIT Rate della squadra con il suo burst.'),
        (56, 'sara', '/images/character/character-kujou-sara-card.png', 'Electro', 4, 'Generale Tengu della Tenryou Commission, devota alla Shogun. Le sue frecce Electro lasciano un marchio che esplode aumentando l''ATK degli alleati colpiti dall''esplosione, rendendo il suo supporto unico ma tecnico da utilizzare.'),
        (57, 'sayu', '/images/character/character-sayu-card.png', 'Anemo', 4, 'Ninja della Shuumatsuban, esperta nel nascondersi e riposare. Nonostante la piccola statura, brandisce un''enorme claymore e può rotolare a forma di pallone con la sua abilità Anemo, guarendo la squadra in base ai danni Swirl che infligge.'),
        (58, 'shenhe', '/images/character/character-shenhe-card.png', 'Cryo', 5, 'Discepola degli adepti con un passato tragico e poteri sigillati. Utilizza la sua lancia per aumentare significativamente i danni Cryo dei membri del team, rendendola una specialista di supporto per i personaggi di questo elemento.'),
        (59, 'sucrose', '/images/character/character-sucrose-card.png', 'Anemo', 4, 'Alchimista di Mondstadt, timida ma brillante nelle sue ricerche. Il suo catalizzatore Anemo le permette di raggruppare i nemici e potenziare la Maestria Elementale del team, amplificando tutte le reazioni elementali della squadra.'),
        (60, 'tartaglia', '/images/character/character-tartaglia-card.png', 'Hydro', 5, 'Undicesimo degli Harbingers dei Fatui, conosciuto anche come Childe. Maestro in combattimento con arco e lame, usa il potere Hydro per passare dal combattimento a distanza a quello ravvicinato con la sua abilità di stance change unica.'),
        (61, 'thoma', '/images/character/character-thoma-card.png', 'Pyro', 4, 'Maggiordomo della Yashiro Commission, originario di Mondstadt ma trasferitosi a Inazuma. Usa la sua lancia e abilità Pyro per creare scudi stratificati che si rinforzano ad ogni attacco normale, proteggendo costantemente il team.'),
        (62, 'tighnari', '/images/character/character-tighnari-card.png', 'Dendro', 5, 'Ranger forestale di Sumeru con orecchie da volpe, esperto botanico. Usa il suo arco e potere Dendro per attacchi caricati più veloci del normale, lanciando frecce che si dividono in proiettili cercanti dopo aver colpito il bersaglio.'),
        (70, 'venti', '/images/character/character-venti-card.png', 'Anemo', 5, 'L''Archon Anemo di Mondstadt, sotto le sembianze di un bardo vagabondo. Usa il suo arco e poteri del vento con incredibile controllo, potendo raggruppare i nemici in potenti vortici e generare correnti ascensionali per il team.'),
        (71, 'wanderer', '/images/character/character-wanderer-card.png', 'Anemo', 5, 'Precedentemente noto come Scaramouche, ora redento e rinato. Usa poteri Anemo con mobilità aerea unica, potendo librarsi in cielo e attaccare dall''alto con il suo catalizzatore, cambiando stile durante il suo stato Windfavored.'),
        (72, 'wriothesley', '/images/character/character-wriothesley-card.png', 'Cryo', 5, 'Direttore del Fortress of Meropide, conosciuto come "Ice Fang". Il suo stile di combattimento unico con guanti criogenici gli permette di sferrare potenti pugni Cryo, bilanciando la sua salute con i danni che infligge attraverso un meccanismo di rinculo.'),
        (73, 'xiangling', '/images/character/character-xiangling-card.png', 'Pyro', 4, 'Chef del Wanmin Restaurant, innovativa e amante dei sapori estremi. Usa la sua lancia e il suo compagno Guoba per infliggere continui danni Pyro in area, mentre il suo burst crea un tornado di fiamme rotante che segue il personaggio attivo.'),
        (74, 'xiao', '/images/character/character-xiao-card.png', 'Anemo', 5, 'Ultimo dei Yaksha, guardiano immortale che combatte i demoni da millenni. Usa la sua lancia e abilità Anemo con mobilità sovrumana, entrando in uno stato di trance durante il burst che aumenta i danni a costo della sua salute.'),
        (75, 'xingqiu', '/images/character/character-xingqiu-card.png', 'Hydro', 4, 'Giovane della Feiyun Commerce Guild e aspirante scrittore di romanzi. Usa la sua spada e poteri Hydro per creare lame d''acqua che attaccano insieme al personaggio attivo, fornendo sia danni che riduzione del danno ricevuto.'),
        (76, 'xinyan', '/images/character/character-xinyan-card.png', 'Pyro', 4, 'Musicista rock and roll di Liyue, combatte i pregiudizi con la sua musica. Usa la sua claymore e abilità Pyro per attacchi ritmici, generando scudi e danni in area a seconda del numero di nemici colpiti dalla sua abilità.'),
        (77, 'yae miko', '/images/character/character-yae-miko-card.png', 'Electro', 5, 'Sacerdotessa capo del Grand Narukami Shrine e editrice della Yae Publishing House. Usa astuzia e potere Electro con il suo catalizzatore, posizionando totem di volpe che colpiscono i nemici e convergono in un fulmine devastante.'),
        (78, 'yanfei', '/images/character/character-yanfei-card.png', 'Pyro', 4, 'Consulente legale di Liyue, metà illuminata. Usa il suo catalizzatore e potere Pyro con un sistema di sigilli che potenzia i suoi attacchi, generando scudi che la proteggono durante i combattimenti più intensi.'),
        (79, 'yaoyao', '/images/character/character-yaoyao-card.png', 'Dendro', 4, 'Discepola di Madame Ping e assistente di Ganyu, piccola ma determinata. Usa la sua lancia e abilità Dendro per curare e supportare, evocando una creatura magica chiamata Yuegui che distribuisce cure e applica l''elemento Dendro.'),
        (80, 'yelan', '/images/character/character-yelan-card.png', 'Hydro', 5, 'Misteriosa intelligence di Liyue, lavora nell''ombra per mantenere l''equilibrio. Usa il suo arco e abilità Hydro per colpire rapidamente, creando una Dire di dadi che segue e attacca insieme al personaggio attivo, aumentando progressivamente i suoi danni.'),
        (81, 'yoimiya', '/images/character/character-yoimiya-card.png', 'Pyro', 5, 'Maestra dei fuochi d''artificio di Inazuma, conosciuta come la "Regina del Summer Festival". Usa il suo arco e abilità Pyro per creare spettacolari combo di attacchi infuocati, con proiettili che possono rimbalzare tra i nemici durante il suo burst.'),
        (82, 'yun jin', '/images/character/character-yun-jin-card.png', 'Geo', 4, 'Opera performer di Liyue, combina arti tradizionali con abilità di combattimento. Usa la sua lancia e potere Geo per potenziare gli attacchi normali del team, con bonus che aumentano in base alla diversità elementale della squadra.'),
        (83, 'zhongli', '/images/character/character-zhongli-card.png', 'Geo', 5, 'Ex Archon Geo ora consulente della Wangsheng Funeral Parlor. Usa la sua lancia e potere Geo per creare scudi impenetrabili e pilastri che risuonano con altre costruzioni Geo, petrificando i nemici con il suo potente burst meteorite.'),
        (84, 'chiori', '/images/character/character-chiori-card.png', 'Geo', 5, 'Stilista e guerriera di Inazuma, allieva della Yashiro Commission. La sua abilità unica di manipolare il potere Geo insieme alla sua maestria con ago e spada le permette di creare abiti da battaglia che aumentano le sue capacità offensive e difensive.'),
        (86, 'clorinde', '/images/character/character-clorinde-card.png', 'Electro', 5, 'Cavaliere dell''Ordine di Fontaine dall''eleganza letale. Il suo stile di combattimento combina precisione e potenza con la spada, incanalando il potere Electro per movimenti rapidi e fendenti che possono paralizzare più nemici contemporaneamente.'),
        (87, 'sigewinne', '/images/character/character-sigewinne-card.png', 'Hydro', 5, 'Falconiera di Fontaine, sempre accompagnata dal suo fedele rapace. Usa il potere Anemo in sinergia con il suo uccello per eseguire attacchi coordinati dall''alto, creando vortici di vento che amplificano i danni e forniscono mobilità aerea al team.'),
        (89, 'sethos', '/images/character/character-sethos-card.png', 'Electro', 5, 'Misterioso avventuriero proveniente dalle profondità del deserto di Sumeru. Combina antiche conoscenze con il potere Electro, evocando tempeste di sabbia elettrificate e utilizzando tecniche di combattimento segrete tramandate da una civiltà perduta.');
    `, (err) => {
        if (err) console.error("Errore durante la creazione della tabella personaggi:", err.message);
    });
    db.run(`
        INSERT INTO artefatti (nome, immagine, categoria) VALUES
        -- Adventurer Set
        ('Adventurer''s Flower', '/images/artifact/adventurer-flower.png', 'Flower of Life'),
        ('Adventurer''s Plume', '/images/artifact/adventurer-plume.png', 'Plume of Death'),
        ('Adventurer''s Sands', '/images/artifact/adventurer-sands.png', 'Sands of Eon'),
        ('Adventurer''s Goblet', '/images/artifact/adventurer-goblet.png', 'Goblet of Eonothem'),
        ('Adventurer''s Circlet', '/images/artifact/adventurer-circlet.png', 'Circlet of Logos'),
        
        -- Archaic Petra Set
        ('Archaic Petra Flower', '/images/artifact/archaic-petra-flower.png', 'Flower of Life'),
        ('Archaic Petra Plume', '/images/artifact/archaic-petra-plume.png', 'Plume of Death'),
        ('Archaic Petra Sands', '/images/artifact/archaic-petra-sands.png', 'Sands of Eon'),
        ('Archaic Petra Goblet', '/images/artifact/archaic-petra-goblet.png', 'Goblet of Eonothem'),
        ('Archaic Petra Circlet', '/images/artifact/archaic-petra-circlet.png', 'Circlet of Logos'),
        
        -- Berserker Set
        ('Berserker''s Flower', '/images/artifact/berserker-flower.png', 'Flower of Life'),
        ('Berserker''s Plume', '/images/artifact/berserker-plume.png', 'Plume of Death'),
        ('Berserker''s Sands', '/images/artifact/berserker-sands.png', 'Sands of Eon'),
        ('Berserker''s Goblet', '/images/artifact/berserker-goblet.png', 'Goblet of Eonothem'),
        ('Berserker''s Circlet', '/images/artifact/berserker-circlet.png', 'Circlet of Logos'),
        
        -- Blizzard Strayer Set
        ('Blizzard Strayer Flower', '/images/artifact/blizzard-strayer-flower.png', 'Flower of Life'),
        ('Blizzard Strayer Plume', '/images/artifact/blizzard-strayer-plume.png', 'Plume of Death'),
        ('Blizzard Strayer Sands', '/images/artifact/blizzard-strayer-sands.png', 'Sands of Eon'),
        ('Blizzard Strayer Goblet', '/images/artifact/blizzard-strayer-goblet.png', 'Goblet of Eonothem'),
        ('Blizzard Strayer Circlet', '/images/artifact/blizzard-strayer-circlet.png', 'Circlet of Logos'),
        
        -- Bloodstained Chivalry Set
        ('Bloodstained Chivalry Flower', '/images/artifact/bloodstained-chivalry-flower.png', 'Flower of Life'),
        ('Bloodstained Chivalry Plume', '/images/artifact/bloodstained-chivalry-plume.png', 'Plume of Death'),
        ('Bloodstained Chivalry Sands', '/images/artifact/bloodstained-chivalry-sands.png', 'Sands of Eon'),
        ('Bloodstained Chivalry Goblet', '/images/artifact/bloodstained-chivalry-goblet.png', 'Goblet of Eonothem'),
        ('Bloodstained Chivalry Circlet', '/images/artifact/bloodstained-chivalry-circlet.png', 'Circlet of Logos'),
        
        -- Brave Heart Set
        ('Brave Heart Flower', '/images/artifact/brave-heart-flower.png', 'Flower of Life'),
        ('Brave Heart Plume', '/images/artifact/brave-heart-plume.png', 'Plume of Death'),
        ('Brave Heart Sands', '/images/artifact/brave-heart-sands.png', 'Sands of Eon'),
        ('Brave Heart Goblet', '/images/artifact/brave-heart-goblet.png', 'Goblet of Eonothem'),
        ('Brave Heart Circlet', '/images/artifact/brave-heart-circlet.png', 'Circlet of Logos'),
        
        -- Crimson Witch of Flames Set
        ('Crimson Witch of Flames Flower', '/images/artifact/crimson-witch-of-flames-flower.png', 'Flower of Life'),
        ('Crimson Witch of Flames Plume', '/images/artifact/crimson-witch-of-flames-plume.png', 'Plume of Death'),
        ('Crimson Witch of Flames Sands', '/images/artifact/crimson-witch-of-flames-sands.png', 'Sands of Eon'),
        ('Crimson Witch of Flames Goblet', '/images/artifact/crimson-witch-of-flames-goblet.png', 'Goblet of Eonothem'),
        ('Crimson Witch of Flames Circlet', '/images/artifact/crimson-witch-of-flames-circlet.png', 'Circlet of Logos'),
        
        -- Deepwood Memories Set
        ('Deepwood Memories Flower', '/images/artifact/deepwood-memories-flower.png', 'Flower of Life'),
        ('Deepwood Memories Plume', '/images/artifact/deepwood-memories-plume.png', 'Plume of Death'),
        ('Deepwood Memories Sands', '/images/artifact/deepwood-memories-sands.png', 'Sands of Eon'),
        ('Deepwood Memories Goblet', '/images/artifact/deepwood-memories-goblet.png', 'Goblet of Eonothem'),
        ('Deepwood Memories Circlet', '/images/artifact/deepwood-memories-circlet.png', 'Circlet of Logos'),
        
        -- Desert Pavilion Chronicle Set
        ('Desert Pavilion Chronicle Flower', '/images/artifact/desert-pavilion-chronicle-flower.png', 'Flower of Life'),
        ('Desert Pavilion Chronicle Plume', '/images/artifact/desert-pavilion-chronicle-plume.png', 'Plume of Death'),
        ('Desert Pavilion Chronicle Sands', '/images/artifact/desert-pavilion-chronicle-sands.png', 'Sands of Eon'),
        ('Desert Pavilion Chronicle Goblet', '/images/artifact/desert-pavilion-chronicle-goblet.png', 'Goblet of Eonothem'),
        ('Desert Pavilion Chronicle Circlet', '/images/artifact/desert-pavilion-chronicle-circlet.png', 'Circlet of Logos'),
        
        -- Echoes of an Offering Set
        ('Echoes of an Offering Flower', '/images/artifact/echoes-of-an-offering-flower.png', 'Flower of Life'),
        ('Echoes of an Offering Plume', '/images/artifact/echoes-of-an-offering-plume.png', 'Plume of Death'),
        ('Echoes of an Offering Sands', '/images/artifact/echoes-of-an-offering-sands.png', 'Sands of Eon'),
        ('Echoes of an Offering Goblet', '/images/artifact/echoes-of-an-offering-goblet.png', 'Goblet of Eonothem'),
        ('Echoes of an Offering Circlet', '/images/artifact/echoes-of-an-offering-circlet.png', 'Circlet of Logos'),
        
        -- Emblem of Severed Fate Set
        ('Emblem of Severed Fate Flower', '/images/artifact/emblem-of-severed-fate-flower.png', 'Flower of Life'),
        ('Emblem of Severed Fate Plume', '/images/artifact/emblem-of-severed-fate-plume.png', 'Plume of Death'),
        ('Emblem of Severed Fate Sands', '/images/artifact/emblem-of-severed-fate-sands.png', 'Sands of Eon'),
        ('Emblem of Severed Fate Goblet', '/images/artifact/emblem-of-severed-fate-goblet.png', 'Goblet of Eonothem'),
        ('Emblem of Severed Fate Circlet', '/images/artifact/emblem-of-severed-fate-circlet.png', 'Circlet of Logos'),
        
        -- Flower of Paradise Lost Set
        ('Flower of Paradise Lost Flower', '/images/artifact/flower-of-paradise-lost-flower.png', 'Flower of Life'),
        ('Flower of Paradise Lost Plume', '/images/artifact/flower-of-paradise-lost-plume.png', 'Plume of Death'),
        ('Flower of Paradise Lost Sands', '/images/artifact/flower-of-paradise-lost-sands.png', 'Sands of Eon'),
        ('Flower of Paradise Lost Goblet', '/images/artifact/flower-of-paradise-lost-goblet.png', 'Goblet of Eonothem'),
        ('Flower of Paradise Lost Circlet', '/images/artifact/flower-of-paradise-lost-circlet.png', 'Circlet of Logos'),
        
        -- Gambler Set
        ('Gambler''s Flower', '/images/artifact/gambler-flower.png', 'Flower of Life'),
        ('Gambler''s Plume', '/images/artifact/gambler-plume.png', 'Plume of Death'),
        ('Gambler''s Sands', '/images/artifact/gambler-sands.png', 'Sands of Eon'),
        ('Gambler''s Goblet', '/images/artifact/gambler-goblet.png', 'Goblet of Eonothem'),
        ('Gambler''s Circlet', '/images/artifact/gambler-circlet.png', 'Circlet of Logos'),
        
        -- Gilded Dreams Set
        ('Gilded Dreams Flower', '/images/artifact/gilded-dreams-flower.png', 'Flower of Life'),
        ('Gilded Dreams Plume', '/images/artifact/gilded-dreams-plume.png', 'Plume of Death'),
        ('Gilded Dreams Sands', '/images/artifact/gilded-dreams-sands.png', 'Sands of Eon'),
        ('Gilded Dreams Goblet', '/images/artifact/gilded-dreams-goblet.png', 'Goblet of Eonothem'),
        ('Gilded Dreams Circlet', '/images/artifact/gilded-dreams-circlet.png', 'Circlet of Logos'),
        
        -- Gladiator's Finale Set
        ('Gladiator''s Finale Flower', '/images/artifact/gladiators-finale-flower.png', 'Flower of Life'),
        ('Gladiator''s Finale Plume', '/images/artifact/gladiators-finale-plume.png', 'Plume of Death'),
        ('Gladiator''s Finale Sands', '/images/artifact/gladiators-finale-sands.png', 'Sands of Eon'),
        ('Gladiator''s Finale Goblet', '/images/artifact/gladiators-finale-goblet.png', 'Goblet of Eonothem'),
        ('Gladiator''s Finale Circlet', '/images/artifact/gladiators-finale-circlet.png', 'Circlet of Logos'),
        
        -- Heart of Depth Set
        ('Heart of Depth Flower', '/images/artifact/heart-of-depth-flower.png', 'Flower of Life'),
        ('Heart of Depth Plume', '/images/artifact/heart-of-depth-plume.png', 'Plume of Death'),
        ('Heart of Depth Sands', '/images/artifact/heart-of-depth-sands.png', 'Sands of Eon'),
        ('Heart of Depth Goblet', '/images/artifact/heart-of-depth-goblet.png', 'Goblet of Eonothem'),
        ('Heart of Depth Circlet', '/images/artifact/heart-of-depth-circlet.png', 'Circlet of Logos'),
        
        -- Husk of Opulent Dreams Set
        ('Husk of Opulent Dreams Flower', '/images/artifact/husk-of-opulent-dreams-flower.png', 'Flower of Life'),
        ('Husk of Opulent Dreams Plume', '/images/artifact/husk-of-opulent-dreams-plume.png', 'Plume of Death'),
        ('Husk of Opulent Dreams Sands', '/images/artifact/husk-of-opulent-dreams-sands.png', 'Sands of Eon'),
        ('Husk of Opulent Dreams Goblet', '/images/artifact/husk-of-opulent-dreams-goblet.png', 'Goblet of Eonothem'),
        ('Husk of Opulent Dreams Circlet', '/images/artifact/husk-of-opulent-dreams-circlet.png', 'Circlet of Logos'),
        
        -- Instructor Set
        ('Instructor''s Flower', '/images/artifact/instructor-flower.png', 'Flower of Life'),
        ('Instructor''s Plume', '/images/artifact/instructor-plume.png', 'Plume of Death'),
        ('Instructor''s Sands', '/images/artifact/instructor-sands.png', 'Sands of Eon'),
        ('Instructor''s Goblet', '/images/artifact/instructor-goblet.png', 'Goblet of Eonothem'),
        ('Instructor''s Circlet', '/images/artifact/instructor-circlet.png', 'Circlet of Logos'),
        
        -- Lavawalker Set
        ('Lavawalker''s Flower', '/images/artifact/lavawalker-flower.png', 'Flower of Life'),
        ('Lavawalker''s Plume', '/images/artifact/lavawalker-plume.png', 'Plume of Death'),
        ('Lavawalker''s Sands', '/images/artifact/lavawalker-sands.png', 'Sands of Eon'),
        ('Lavawalker''s Goblet', '/images/artifact/lavawalker-goblet.png', 'Goblet of Eonothem'),
        ('Lavawalker''s Circlet', '/images/artifact/lavawalker-circlet.png', 'Circlet of Logos'),
        
        -- Lucky Dog Set
        ('Lucky Dog''s Flower', '/images/artifact/lucky-dog-flower.png', 'Flower of Life'),
        ('Lucky Dog''s Plume', '/images/artifact/lucky-dog-plume.png', 'Plume of Death'),
        ('Lucky Dog''s Sands', '/images/artifact/lucky-dog-sands.png', 'Sands of Eon'),
        ('Lucky Dog''s Goblet', '/images/artifact/lucky-dog-goblet.png', 'Goblet of Eonothem'),
        ('Lucky Dog''s Circlet', '/images/artifact/lucky-dog-circlet.png', 'Circlet of Logos'),
        
        -- Maiden Beloved Set
        ('Maiden Beloved Flower', '/images/artifact/maiden-beloved-flower.png', 'Flower of Life'),
        ('Maiden Beloved Plume', '/images/artifact/maiden-beloved-plume.png', 'Plume of Death'),
        ('Maiden Beloved Sands', '/images/artifact/maiden-beloved-sands.png', 'Sands of Eon'),
        ('Maiden Beloved Goblet', '/images/artifact/maiden-beloved-goblet.png', 'Goblet of Eonothem'),
        ('Maiden Beloved Circlet', '/images/artifact/maiden-beloved-circlet.png', 'Circlet of Logos'),
        
        -- Martial Artist Set
        ('Martial Artist''s Flower', '/images/artifact/martial-artist-flower.png', 'Flower of Life'),
        ('Martial Artist''s Plume', '/images/artifact/martial-artist-plume.png', 'Plume of Death'),
        ('Martial Artist''s Sands', '/images/artifact/martial-artist-sands.png', 'Sands of Eon'),
        ('Martial Artist''s Goblet', '/images/artifact/martial-artist-goblet.png', 'Goblet of Eonothem'),
        ('Martial Artist''s Circlet', '/images/artifact/martial-artist-circlet.png', 'Circlet of Logos'),
        
        -- Noblesse Oblige Set
        ('Noblesse Oblige Flower', '/images/artifact/noblesse-oblige-flower.png', 'Flower of Life'),
        ('Noblesse Oblige Plume', '/images/artifact/noblesse-oblige-plume.png', 'Plume of Death'),
        ('Noblesse Oblige Sands', '/images/artifact/noblesse-oblige-sands.png', 'Sands of Eon'),
        ('Noblesse Oblige Goblet', '/images/artifact/noblesse-oblige-goblet.png', 'Goblet of Eonothem'),
        ('Noblesse Oblige Circlet', '/images/artifact/noblesse-oblige-circlet.png', 'Circlet of Logos'),
        
        -- Ocean-Hued Clam Set
        ('Ocean-Hued Clam Flower', '/images/artifact/ocean-hued-clam-flower.png', 'Flower of Life'),
        ('Ocean-Hued Clam Plume', '/images/artifact/ocean-hued-clam-plume.png', 'Plume of Death'),
        ('Ocean-Hued Clam Sands', '/images/artifact/ocean-hued-clam-sands.png', 'Sands of Eon'),
        ('Ocean-Hued Clam Goblet', '/images/artifact/ocean-hued-clam-goblet.png', 'Goblet of Eonothem'),
        ('Ocean-Hued Clam Circlet', '/images/artifact/ocean-hued-clam-circlet.png', 'Circlet of Logos'),
        
        -- Pale Flame Set
        ('Pale Flame Flower', '/images/artifact/pale-flame-flower.png', 'Flower of Life'),
        ('Pale Flame Plume', '/images/artifact/pale-flame-plume.png', 'Plume of Death'),
        ('Pale Flame Sands', '/images/artifact/pale-flame-sands.png', 'Sands of Eon'),
        ('Pale Flame Goblet', '/images/artifact/pale-flame-goblet.png', 'Goblet of Eonothem'),
        ('Pale Flame Circlet', '/images/artifact/pale-flame-circlet.png', 'Circlet of Logos'),
        
        -- Resolution of Sojourner Set
        ('Resolution of Sojourner Flower', '/images/artifact/resolution-of-sojourner-flower.png', 'Flower of Life'),
        ('Resolution of Sojourner Plume', '/images/artifact/resolution-of-sojourner-plume.png', 'Plume of Death'),
        ('Resolution of Sojourner Sands', '/images/artifact/resolution-of-sojourner-sands.png', 'Sands of Eon'),
        ('Resolution of Sojourner Goblet', '/images/artifact/resolution-of-sojourner-goblet.png', 'Goblet of Eonothem'),
        ('Resolution of Sojourner Circlet', '/images/artifact/resolution-of-sojourner-circlet.png', 'Circlet of Logos'),
        
        -- Retracing Bolide Set
        ('Retracing Bolide Flower', '/images/artifact/retracing-bolide-flower.png', 'Flower of Life'),
        ('Retracing Bolide Plume', '/images/artifact/retracing-bolide-plume.png', 'Plume of Death'),
        ('Retracing Bolide Sands', '/images/artifact/retracing-bolide-sands.png', 'Sands of Eon'),
        ('Retracing Bolide Goblet', '/images/artifact/retracing-bolide-goblet.png', 'Goblet of Eonothem'),
        ('Retracing Bolide Circlet', '/images/artifact/retracing-bolide-circlet.png', 'Circlet of Logos'),
        
        -- Scholar Set
        ('Scholar''s Flower', '/images/artifact/scholar-flower.png', 'Flower of Life'),
        ('Scholar''s Plume', '/images/artifact/scholar-plume.png', 'Plume of Death'),
        ('Scholar''s Sands', '/images/artifact/scholar-sands.png', 'Sands of Eon'),
        ('Scholar''s Goblet', '/images/artifact/scholar-goblet.png', 'Goblet of Eonothem'),
        ('Scholar''s Circlet', '/images/artifact/scholar-circlet.png', 'Circlet of Logos'),
        
        -- Shimenawa's Reminiscence Set
        ('Shimenawa''s Reminiscence Flower', '/images/artifact/shimenawas-reminiscence-flower.png', 'Flower of Life'),
        ('Shimenawa''s Reminiscence Plume', '/images/artifact/shimenawas-reminiscence-plume.png', 'Plume of Death'),
        ('Shimenawa''s Reminiscence Sands', '/images/artifact/shimenawas-reminiscence-sands.png', 'Sands of Eon'),
        ('Shimenawa''s Reminiscence Goblet', '/images/artifact/shimenawas-reminiscence-goblet.png', 'Goblet of Eonothem'),
        ('Shimenawa''s Reminiscence Circlet', '/images/artifact/shimenawas-reminiscence-circlet.png', 'Circlet of Logos'),
        
        -- Tenacity of the Millelith Set
        ('Tenacity of the Millelith Flower', '/images/artifact/tenacity-of-the-millelith-flower.png', 'Flower of Life'),
        ('Tenacity of the Millelith Plume', '/images/artifact/tenacity-of-the-millelith-plume.png', 'Plume of Death'),
        ('Tenacity of the Millelith Sands', '/images/artifact/tenacity-of-the-millelith-sands.png', 'Sands of Eon'),
        ('Tenacity of the Millelith Goblet', '/images/artifact/tenacity-of-the-millelith-goblet.png', 'Goblet of Eonothem'),
        ('Tenacity of the Millelith Circlet', '/images/artifact/tenacity-of-the-millelith-circlet.png', 'Circlet of Logos'),
        
        -- The Exile Set
        ('The Exile Flower', '/images/artifact/the-exile-flower.png', 'Flower of Life'),
        ('The Exile Plume', '/images/artifact/the-exile-plume.png', 'Plume of Death'),
        ('The Exile Sands', '/images/artifact/the-exile-sands.png', 'Sands of Eon'),
        ('The Exile Goblet', '/images/artifact/the-exile-goblet.png', 'Goblet of Eonothem'),
        ('The Exile Circlet', '/images/artifact/the-exile-circlet.png', 'Circlet of Logos'),
        
        -- Thundering Fury Set
        ('Thundering Fury Flower', '/images/artifact/thundering-fury-flower.png', 'Flower of Life'),
        ('Thundering Fury Plume', '/images/artifact/thundering-fury-plume.png', 'Plume of Death'),
        ('Thundering Fury Sands', '/images/artifact/thundering-fury-sands.png', 'Sands of Eon'),
        ('Thundering Fury Goblet', '/images/artifact/thundering-fury-goblet.png', 'Goblet of Eonothem'),
        ('Thundering Fury Circlet', '/images/artifact/thundering-fury-circlet.png', 'Circlet of Logos'),
        
        -- Thundersoother Set
        ('Thundersoother''s Flower', '/images/artifact/thundersoother-flower.png', 'Flower of Life'),
        ('Thundersoother''s Plume', '/images/artifact/thundersoother-plume.png', 'Plume of Death'),
        ('Thundersoother''s Sands', '/images/artifact/thundersoother-sands.png', 'Sands of Eon'),
        ('Thundersoother''s Goblet', '/images/artifact/thundersoother-goblet.png', 'Goblet of Eonothem'),
        ('Thundersoother''s Circlet', '/images/artifact/thundersoother-circlet.png', 'Circlet of Logos'),
        
        -- Tiny Miracle Set
        ('Tiny Miracle''s Flower', '/images/artifact/tiny-miracle-flower.png', 'Flower of Life'),
        ('Tiny Miracle''s Plume', '/images/artifact/tiny-miracle-plume.png', 'Plume of Death'),
        ('Tiny Miracle''s Sands', '/images/artifact/tiny-miracle-sands.png', 'Sands of Eon'),
        ('Tiny Miracle''s Goblet', '/images/artifact/tiny-miracle-goblet.png', 'Goblet of Eonothem'),
        ('Tiny Miracle''s Circlet', '/images/artifact/tiny-miracle-circlet.png', 'Circlet of Logos'),
        
        -- Traveling Doctor Set
        ('Traveling Doctor''s Flower', '/images/artifact/traveling-doctor-flower.png', 'Flower of Life'),
        ('Traveling Doctor''s Plume', '/images/artifact/traveling-doctor-plume.png', 'Plume of Death'),
        ('Traveling Doctor''s Sands', '/images/artifact/traveling-doctor-sands.png', 'Sands of Eon'),
        ('Traveling Doctor''s Goblet', '/images/artifact/traveling-doctor-goblet.png', 'Goblet of Eonothem'),
        ('Traveling Doctor''s Circlet', '/images/artifact/traveling-doctor-circlet.png', 'Circlet of Logos'),
        
        -- Defender's Will Set
        ('Defender''s Will Flower', '/images/artifact/defenders-will-flower.png', 'Flower of Life'),
        ('Defender''s Will Plume', '/images/artifact/defenders-will-plume.png', 'Plume of Death'),
        ('Defender''s Will Sands', '/images/artifact/defenders-will-sands.png', 'Sands of Eon'),
        ('Defender''s Will Goblet', '/images/artifact/defenders-will-goblet.png', 'Goblet of Eonothem'),
        ('Defender''s Will Circlet', '/images/artifact/defenders-will-circlet.png', 'Circlet of Logos'),
        
        -- Vermillion Hereafter Set
        ('Vermillion Hereafter Flower', '/images/artifact/vermillion-hereafter-flower.png', 'Flower of Life'),
        ('Vermillion Hereafter Plume', '/images/artifact/vermillion-hereafter-plume.png', 'Plume of Death'),
        ('Vermillion Hereafter Sands', '/images/artifact/vermillion-hereafter-sands.png', 'Sands of Eon'),
        ('Vermillion Hereafter Goblet', '/images/artifact/vermillion-hereafter-goblet.png', 'Goblet of Eonothem'),
        ('Vermillion Hereafter Circlet', '/images/artifact/vermillion-hereafter-circlet.png', 'Circlet of Logos'),
        
        -- Viridescent Venerer Set
        ('Viridescent Venerer Flower', '/images/artifact/viridescent-venerer-flower.png', 'Flower of Life'),
        ('Viridescent Venerer Plume', '/images/artifact/viridescent-venerer-plume.png', 'Plume of Death'),
        ('Viridescent Venerer Sands', '/images/artifact/viridescent-venerer-sands.png', 'Sands of Eon'),
        ('Viridescent Venerer Goblet', '/images/artifact/viridescent-venerer-goblet.png', 'Goblet of Eonothem'),
        ('Viridescent Venerer Circlet', '/images/artifact/viridescent-venerer-circlet.png', 'Circlet of Logos'),
        
        -- Wanderer's Troupe Set
        ('Wanderer''s Troupe Flower', '/images/artifact/wanderers-troupe-flower.png', 'Flower of Life'),
        ('Wanderer''s Troupe Plume', '/images/artifact/wanderers-troupe-plume.png', 'Plume of Death'),
        ('Wanderer''s Troupe Sands', '/images/artifact/wanderers-troupe-sands.png', 'Sands of Eon'),
        ('Wanderer''s Troupe Goblet', '/images/artifact/wanderers-troupe-goblet.png', 'Goblet of Eonothem'),
        ('Wanderer''s Troupe Circlet', '/images/artifact/wanderers-troupe-circlet.png', 'Circlet of Logos')
    `, (err) => {
        if (err) console.error("Errore durante l'inserimento degli artefatti:", err.message);
    });

});

