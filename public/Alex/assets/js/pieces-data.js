/* =========================================================
   pieces-data.js
   20 piezas IMAGINADAS a modo de propuesta/ejemplo para el
   borrador de la web. No son obra real de Alex todavía: son
   un ejercicio creativo para mostrar cómo se contaría cada
   pieza (material, historia, motivación) una vez tengamos
   sus fotos y textos reales.
   ========================================================= */

var ALEX_PIECES = [
  {
    id: 1, slug: "farolillo-de-amaia", category: "mar", icon: "pz-lamp-table",
    image: "assets/img/pieces/pieza-01.jpg", status: "disponible", featured: true,
    dimensions: "38 × 22 × 22 cm",
    material: { es: "Casco de txalupa + latón de brújula", eu: "Txalupa-kaskoa + brujula-latoia", en: "Boat hull + ship's compass brass", fr: "Coque de bateau de pêche + laiton de boussole" },
    title: { es: "Farolillo de Amaia", eu: "Amaiaren farolitoa", en: "Amaia's Lantern", fr: "La lanterne d’Amaia" },
    short: {
      es: "Lámpara de mesa tallada en un fragmento de casco de txalupa, con la carcasa de una vieja brújula reconvertida en base y una tulipa de vidrio ahumado soplado a mano.",
      eu: "Txalupa-kasko zati batean landutako mahai-lanpara, itsasontzi baten brujula zahar bat oinarri bihurtuta eta eskuz egindako beira ilun-tulipa batekin.",
      en: "A table lamp carved from a fragment of a fishing boat's hull, its base a repurposed ship's compass housing, topped with a hand-blown smoked-glass shade.",
      fr: "Lampe de table taillée dans un fragment de coque de bateau de pêche, avec le boîtier d’une vieille boussole reconverti en base et un abat-jour en verre fumé soufflé à la main."
    },
    motivation: { es: "El mar de Lekeitio y sus txalupas retiradas", eu: "Lekeitioko itsasoa eta erretiratutako txalupak", en: "The sea of Lekeitio and its retired fishing boats", fr: "La mer de Lekeitio et ses bateaux de pêche retirés du service" },
    story: {
      es: "Amaia era el nombre pintado en la proa de una pequeña txalupa que llevaba más de veinte años saliendo a diario del puerto de Lekeitio, hasta que el astillero la dio de baja. Alex rescató un fragmento curvado de su casco —la madera oscurecida por décadas de sal y sol— antes de que acabara en la hoguera de la lonja. Lo lijó a mano durante semanas, respetando cada golpe y cada veta, y encontró en un mercadillo la carcasa de latón de una vieja brújula de barco que ya no marcaba el norte. La convirtió en la base de la lámpara, y remató el conjunto con una tulipa de vidrio ahumado soplada por un artesano vidriero de la zona. Cuando se enciende, la luz atraviesa la madera como si todavía llevara dentro la memoria de sus salidas de madrugada.",
      eu: "Amaia zen Lekeitioko portutik egunero ateratzen zen txalupa txiki baten aurrean margotutako izena, harik eta itsasontziolak erretiratu zuen arte. Alexek kasko horren zati kurbatu bat —gatzak eta eguzkiak urteetan ilundutako egurra— salbatu zuen, lonjako sutara bota baino lehen. Astez eskuz leundu zuen, beti bere marka eta zauri bakoitza errespetatuz, eta merkatu txiki batean itsasontzi baten brujula zaharraren latoizko kaxa aurkitu zuen, jada iparra erakusten ez zuena. Lanparearen oinarri bihurtu zuen, eta beira ilun eskuz eginiko tulipa batekin osatu zuen multzoa. Pizten denean, argiak egurra zeharkatzen du, oraindik goizaldeko irteeren oroimena barnean balu bezala.",
      en: "Amaia was the name painted on the bow of a small fishing boat that left Lekeitio's harbour every day for over twenty years, until the shipyard finally retired her. Alex rescued a curved fragment of her hull — the wood darkened by decades of salt and sun — before it was thrown onto the quayside bonfire. He sanded it by hand for weeks, respecting every knock and grain line, and found at a flea market the brass housing of an old ship's compass that no longer pointed north. It became the lamp's base, finished with a hand-blown smoked-glass shade made by a local glassblower. When lit, the light passes through the wood as if it still carried the memory of its dawn departures.",
      fr: "Amaia était le nom peint à la proue d’un petit bateau de pêche qui quittait chaque jour le port de Lekeitio depuis plus de vingt ans, jusqu’à ce que le chantier naval le retire du service. Alex a sauvé un fragment courbé de sa coque — le bois assombri par des décennies de sel et de soleil — avant qu’il ne finisse dans le bûcher de la criée. Il l’a poncé à la main pendant des semaines, en respectant chaque marque et chaque veine, et a trouvé sur un marché aux puces le boîtier en laiton d’une vieille boussole de bateau qui n’indiquait plus le nord. Il en a fait la base de la lampe, et a complété l’ensemble avec un abat-jour en verre fumé soufflé par un artisan verrier de la région. Une fois allumée, la lumière traverse le bois comme s’il portait encore en lui le souvenir de ses départs à l’aube."
    }
  },
  {
    id: 2, slug: "cuaderno-de-bitacora", category: "mar", icon: "pz-mirror-round",
    image: "assets/img/pieces/pieza-02.jpg", status: "encargo", featured: false,
    dimensions: "50 × 50 × 6 cm",
    material: { es: "Caña de timón + bisagra de bronce", eu: "Lema-kanabera + brontzezko bisagra", en: "Rudder tiller + bronze hinge", fr: "Barre de gouvernail + charnière en bronze" },
    title: { es: "Cuaderno de bitácora", eu: "Ontzi-egunkaria", en: "Logbook Mirror", fr: "Journal de bord" },
    short: {
      es: "Espejo redondo enmarcado con los listones de una caña de timón, con una bisagra de bronce oxidado reconvertida en soporte decorativo.",
      eu: "Lema-kanaberaren listoiekin markatutako biribileko ispilua, brontzezko erdoildutako bisagra bat euskarri apaingarri bihurtuta.",
      en: "A round mirror framed with the slats of an old rudder tiller, finished with an oxidised bronze hinge repurposed as a decorative bracket.",
      fr: "Miroir rond encadré avec les lattes d’une barre de gouvernail, avec une charnière en bronze oxydé reconvertie en support décoratif."
    },
    motivation: { es: "Los timones que ya no gobiernan ningún barco", eu: "Jada itsasontzirik gobernatzen ez duten lemak", en: "Rudders that no longer steer any boat", fr: "Les gouvernails qui ne dirigent plus aucun bateau" },
    story: {
      es: "El marco nace de la caña de un timón partido que un patrón de Lekeitio guardaba en su garaje «por si acaso». Alex la despiezó en listones finos y los curvó al vapor para formar el aro del espejo.",
      eu: "Markoa Lekeitioko patroi batek «zer edo zer gertatuz gero» bere garajean gordetzen zuen lema-kanabera hautsi batetik dator. Alexek listo mehe bihurtu zuen eta lurrunaren bidez kurbatu zituen ispiluaren eraztuna osatzeko.",
      en: "The frame comes from a broken rudder tiller that a Lekeitio boat skipper had kept in his garage «just in case.» Alex split it into thin slats and steam-bent them to form the mirror's ring.",
      fr: "Le cadre est né de la barre d’un gouvernail cassé qu’un patron pêcheur de Lekeitio gardait dans son garage « au cas où ». Alex l’a découpée en fines lattes et les a cintrées à la vapeur pour former l’anneau du miroir."
    }
  },
  {
    id: 3, slug: "redes-de-xemein", category: "mar", icon: "pz-lamp-pendant",
    image: "assets/img/pieces/pieza-03.jpg", status: "vendido", featured: false,
    dimensions: "Ø 34 × 40 cm",
    material: { es: "Cabo marino + vidrio reciclado", eu: "Itsas-soka + birziklatutako beira", en: "Marine rope + recycled glass", fr: "Cordage marin + verre recyclé" },
    title: { es: "Redes de Xemein", eu: "Xemeingo sareak", en: "Nets of Xemein", fr: "Filets de Xemein" },
    short: {
      es: "Lámpara colgante tejida con cabo marino recuperado de la lonja, envolviendo una tulipa de vidrio reciclado soplado.",
      eu: "Lonjatik berreskuratutako sokaz ehundutako argi-esekia, birziklatutako beira-tulipa bat bilduz.",
      en: "A pendant lamp woven from reclaimed marine rope, wrapped around a recycled hand-blown glass shade.",
      fr: "Suspension tissée avec du cordage marin récupéré à la criée, enveloppant un abat-jour en verre recyclé soufflé."
    },
    motivation: { es: "Las redes remendadas a mano en el muelle", eu: "Kaian eskuz konpondutako sareak", en: "The nets mended by hand on the quay", fr: "Les filets rapiécés à la main sur le quai" },
    story: {
      es: "El cabo llegó de la lonja de Lekeitio, donde ya no servía para faenar pero conservaba los nudos hechos a mano por generaciones de pescadores. Alex lo tejió en espiral alrededor de una tulipa de vidrio reciclado.",
      eu: "Sokaren jatorria Lekeitioko lonja da; jada arrantzarako balio ez bazuen ere, arrantzale belaunaldiek eskuz eginiko korapiloak gordetzen zituen. Alexek espiralean ehundu zuen birziklatutako beira-tulipa baten inguruan.",
      en: "The rope came from Lekeitio's fish market, no longer fit for work but still holding the hand-tied knots of generations of fishermen. Alex wove it in a spiral around a recycled glass shade.",
      fr: "Le cordage vient de la criée de Lekeitio, où il ne servait plus à la pêche mais conservait les nœuds faits à la main par des générations de pêcheurs. Alex l’a tissé en spirale autour d’un abat-jour en verre recyclé."
    }
  },
  {
    id: 4, slug: "ancla-menuda", category: "mar", icon: "pz-coat-standing",
    image: "assets/img/pieces/pieza-04.jpg", status: "disponible", featured: true,
    dimensions: "180 × 34 × 34 cm",
    material: { es: "Mástil de velero + ancla pequeña", eu: "Belaontziko masta + aingura txikia", en: "Sailboat mast + small anchor", fr: "Mât de voilier + petite ancre" },
    title: { es: "Ancla menuda", eu: "Aingura txikia", en: "Little Anchor", fr: "Petite ancre" },
    short: {
      es: "Perchero de pie hecho con el mástil partido de un pequeño velero, con ganchos forjados a partir de una vieja ancla en miniatura.",
      eu: "Belaontzi txiki baten masta hautsiaz eginiko oinezko arropa-euskarria, aingura miniatura zahar batetik forjatutako kakoekin.",
      en: "A standing coat rack made from the broken mast of a small sailboat, fitted with hooks forged from a miniature anchor.",
      fr: "Portemanteau sur pied fabriqué avec le mât cassé d’un petit voilier, avec des crochets forgés à partir d’une vieille ancre miniature."
    },
    motivation: { es: "Los veleros que envejecen varados en el astillero", eu: "Itsasontziolan zahartzen diren belaontziak", en: "Sailboats growing old, beached at the boatyard", fr: "Les voiliers qui vieillissent échoués au chantier naval" },
    story: {
      es: "El mástil llevaba tres inviernos tirado detrás de un astillero de Ondarroa. Alex lo enderezó, lo lijó y forjó tres ganchos a partir de las uñas de un ancla pequeña que ya no sujetaba nada.",
      eu: "Masta hiru negu zeramatzan Ondarroako itsasontziola baten atzealdean botata. Alexek zuzendu, leundu eta hiru kako forjatu zituen jada ezer eusten ez zuen aingura txiki baten atzaparretatik.",
      en: "The mast had spent three winters cast aside behind a boatyard in Ondarroa. Alex straightened it, sanded it, and forged three hooks from the flukes of a small anchor that no longer held anything.",
      fr: "Le mât était resté trois hivers derrière un chantier naval d’Ondarroa. Alex l’a redressé, poncé, et a forgé trois crochets à partir des pattes d’une petite ancre qui ne retenait plus rien."
    }
  },
  {
    id: 5, slug: "marea-baja", category: "mar", icon: "pz-coasters",
    image: "assets/img/pieces/pieza-05.jpg", status: "disponible", featured: true,
    dimensions: "Ø 10 cm (set de 6)",
    material: { es: "Madera de deriva pulida", eu: "Landutako itsas-egurra", en: "Polished driftwood", fr: "Bois flotté poli" },
    title: { es: "Marea baja", eu: "Itsas-behera", en: "Low Tide", fr: "Marée basse" },
    short: {
      es: "Set de posavasos de madera de deriva recogida en la playa de Karraspio, cada uno con la veta que el propio mar dibujó.",
      eu: "Karraspio hondartzan bildutako itsas-egur zatiekin eginiko azpilen sorta, bakoitzak itsasoak berak marraztutako barrunbea du.",
      en: "A set of coasters made from driftwood gathered on Karraspio beach, each one bearing the grain pattern the sea itself drew.",
      fr: "Ensemble de dessous-de-verre en bois flotté ramassé sur la plage de Karraspio, chacun avec le veinage que la mer elle-même a dessiné."
    },
    motivation: { es: "Lo que el mar deja en la orilla tras cada temporal", eu: "Ekaitz bakoitzaren ondoren itsasoak hondartzan uzten duena", en: "What the sea leaves on the shore after every storm", fr: "Ce que la mer laisse sur le rivage après chaque tempête" },
    story: {
      es: "Alex recoge la madera de deriva tras los temporales de otoño en Karraspio. No la talla apenas: solo pule lo que el agua y la arena ya habían empezado a esculpir.",
      eu: "Alexek udazkeneko ekaitzen ondoren biltzen du itsas-egurra Karraspion. Ia ez du landu: uraren eta hondarrak jadanik zizelkatzen hasia zutena leundu baino ez du egiten.",
      en: "Alex collects the driftwood after the autumn storms at Karraspio. He barely carves it at all — he simply polishes what the water and sand had already begun to sculpt.",
      fr: "Alex ramasse le bois flotté après les tempêtes d’automne à Karraspio. Il ne le taille presque pas : il se contente de polir ce que l’eau et le sable avaient déjà commencé à sculpter."
    }
  },
  {
    id: 6, slug: "el-aitite-pescador", category: "rural", icon: "pz-bench",
    image: "assets/img/pieces/pieza-06.jpg", status: "encargo", featured: false,
    dimensions: "140 × 42 × 46 cm",
    material: { es: "Cuadernas de pesquero + lona de vela", eu: "Arrantza-ontziko kuadernak + belaren olana", en: "Fishing-boat ribs + sailcloth", fr: "Membrures de bateau de pêche + toile de voile" },
    title: { es: "El aitite pescador", eu: "Arrantzale aitxitxa", en: "The Fisherman Grandfather", fr: "Le grand-père pêcheur" },
    short: {
      es: "Banco bajo construido con las cuadernas de un pesquero desguazado en Lekeitio, con cojines de lona de vela reutilizada.",
      eu: "Lekeitioko txatarreratutako arrantza-ontzi baten kuadernekin eraikitako banku apala, berrerabilitako belaren olanazko koltxoiekin.",
      en: "A low bench built from the ribs of a fishing boat scrapped in Lekeitio, topped with cushions of reused sailcloth.",
      fr: "Banc bas construit avec les membrures d’un bateau de pêche démantelé à Lekeitio, avec des coussins en toile de voile réutilisée."
    },
    motivation: { es: "El abuelo que enseñó a Alex a mirar el mar con paciencia", eu: "Alexi itsasoa pazientziaz begiratzen erakutsi zion aitona", en: "The grandfather who taught Alex to watch the sea with patience", fr: "Le grand-père qui a appris à Alex à regarder la mer avec patience" },
    story: {
      es: "Encargado por una familia para su porche, este banco recuerda las tardes en la lonja escuchando historias de patrones jubilados. Las cuadernas curvadas del casco actúan como reposabrazos naturales.",
      eu: "Familia batek bere atarirako eskatuta, banku honek erretiratutako patroien istorioak lonjan entzuten ziren arratsaldeak gogorarazten ditu. Kaskoaren kuadern kurbatuek berezko besaulki gisa jarduten dute.",
      en: "Commissioned by a family for their porch, this bench recalls afternoons at the fish market listening to retired skippers' stories. The hull's curved ribs act as natural armrests.",
      fr: "Commandé par une famille pour sa véranda, ce banc rappelle les après-midis passés à la criée à écouter les histoires de patrons pêcheurs à la retraite. Les membrures courbées de la coque font office d’accoudoirs naturels."
    }
  },
  {
    id: 7, slug: "luz-de-faro", category: "mar", icon: "pz-sconce",
    image: "assets/img/pieces/pieza-07.jpg", status: "vendido", featured: false,
    dimensions: "24 × 18 × 30 cm",
    material: { es: "Cobre de barco + vidrio tallado", eu: "Itsasontziko kobrea + landutako beira", en: "Boat copper + carved glass", fr: "Cuivre de bateau + verre taillé" },
    title: { es: "Luz de faro", eu: "Itsasargiaren argia", en: "Lighthouse Light", fr: "Lumière de phare" },
    short: {
      es: "Aplique de pared que reinterpreta la linterna de un faro, con carcasa de cobre recuperado de una vieja embarcación.",
      eu: "Itsasargiaren linterna berrinterpretatzen duen horma-aplikea, itsasontzi zahar batetik berreskuratutako kobrezko egitura duena.",
      en: "A wall sconce reinterpreting a lighthouse lantern, its housing made from copper salvaged from an old boat.",
      fr: "Applique murale qui réinterprète la lanterne d’un phare, avec un boîtier en cuivre récupéré sur une vieille embarcation."
    },
    motivation: { es: "El faro de Santa Catalina guiando de noche a Lekeitio", eu: "Santa Catalina itsasargia, gauean Lekeitiora bidea erakusten", en: "The Santa Catalina lighthouse guiding Lekeitio home at night", fr: "Le phare de Santa Catalina guidant Lekeitio la nuit" },
    story: {
      es: "Inspirada en el faro de Santa Catalina, esta lámpara de pared combina cobre recuperado con un panel de vidrio tallado a mano que dispersa la luz en vetas cálidas.",
      eu: "Santa Catalina itsasargian oinarrituta, horma-lanpara honek berreskuratutako kobrea eta eskuz landutako beira-panel bat uztartzen ditu, argia bero-izpitan sakabanatzen duena.",
      en: "Inspired by the Santa Catalina lighthouse, this wall lamp combines salvaged copper with a hand-carved glass panel that scatters the light into warm streaks.",
      fr: "Inspirée du phare de Santa Catalina, cette applique murale associe du cuivre récupéré à un panneau de verre taillé à la main qui diffuse la lumière en traits chauds."
    }
  },
  {
    id: 8, slug: "el-roble-caido-de-oiz", category: "rural", icon: "pz-table-slab",
    image: "assets/img/pieces/pieza-08.jpg", status: "disponible", featured: true,
    dimensions: "130 × 62 × 40 cm",
    material: { es: "Roble centenario + hierro forjado", eu: "Mendeko haritza + burdina forjatua", en: "Century-old oak + wrought iron", fr: "Chêne centenaire + fer forgé" },
    title: { es: "El roble caído de Oiz", eu: "Oizko amildutako haritza", en: "The Fallen Oak of Oiz", fr: "Le chêne tombé de l’Oiz" },
    short: {
      es: "Mesa de centro tallada de una sola pieza de un roble centenario derribado por el viento en el monte Oiz.",
      eu: "Oiz mendian haizeak eraitsitako mendeko haritz batetik pieza bakarrean landutako erdiko mahaia.",
      en: "A coffee table carved from a single slab of a century-old oak felled by the wind on Mount Oiz.",
      fr: "Table basse taillée d’une seule pièce dans un chêne centenaire abattu par le vent sur le mont Oiz."
    },
    motivation: { es: "Lo rural y la memoria de los árboles que ya no están", eu: "Landa-eremua eta jada ez dauden zuhaitzen oroimena", en: "The countryside and the memory of trees no longer standing", fr: "La campagne et la mémoire des arbres qui ne sont plus" },
    story: {
      es: "Un temporal de febrero derribó un roble que llevaba más de cien años en la ladera del Oiz, junto a un caserío abandonado. El propietario del terreno, que no sabía qué hacer con el tronco, contactó a Alex a través de una vecina. Cuando lo vio, decidió no cortarlo en tablas: quería conservar una única sección completa, con su corteza, sus nudos y el hueco que había dejado una rama caída años atrás. Tardó meses en secarlo correctamente antes de poder trabajarlo, y cuando por fin lo hizo, solo lijó y selló la superficie, dejando que las vetas —anillo a anillo, año a año— contaran la historia del árbol. Las patas, de hierro forjado a mano, son deliberadamente sencillas: no querían competir con la madera, solo sostenerla.",
      eu: "Otsaileko ekaitz batek Oiz mendiko mazelan ehun urte baino gehiago zeraman haritz bat eraitsi zuen, baserri abandonatu batetik gertu. Lursailaren jabeak, enborrarekin zer egin ez zekienez, auzokide baten bidez Alexekin harremanetan jarri zen. Ikustean, ez zuen ohol bihurtu nahi izan: atal bakar eta osoa mantendu nahi zuen, azal, korapilo eta duela urte batzuk erori zen adar batek utzitako hutsuneaz. Hilabeteak behar izan zituen ondo lehortzeko lanean hasi ahal izan aurretik, eta azkenean, azala leundu eta zigilatu baino ez zuen egin, barrunbeek —eraztun bat eraztun bat, urte bat urte bat— zuhaitzaren istorioa konta zezaten. Eskuz forjatutako burdinazko hankak nahita sinpleak dira: ez zuten egurrarekin lehiatu nahi, eutsi bakarrik.",
      en: "A February storm brought down an oak that had stood for over a hundred years on the slopes of Oiz, beside an abandoned farmhouse. The landowner, unsure what to do with the trunk, reached Alex through a neighbour. When he saw it, he decided not to cut it into planks: he wanted to keep a single, complete cross-section — bark, knots, and the hollow left by a branch that had fallen years before. It took months to season it properly before he could work it, and when he finally did, he only sanded and sealed the surface, letting the rings — one by one, year by year — tell the tree's story. The hand-forged iron legs are deliberately simple: they were never meant to compete with the wood, only to hold it.",
      fr: "Une tempête de février a abattu un chêne qui se dressait depuis plus de cent ans sur le versant de l’Oiz, près d’une ferme abandonnée. Le propriétaire du terrain, ne sachant que faire du tronc, a contacté Alex par l’intermédiaire d’une voisine. En le voyant, celui-ci a décidé de ne pas le débiter en planches : il voulait conserver une seule section complète, avec son écorce, ses nœuds et le creux laissé par une branche tombée des années auparavant. Il lui a fallu des mois pour le sécher correctement avant de pouvoir le travailler, et quand il l’a enfin fait, il s’est contenté de poncer et de sceller la surface, laissant les cernes — anneau après anneau, année après année — raconter l’histoire de l’arbre. Les pieds, en fer forgé à la main, sont délibérément sobres : ils n’étaient pas censés rivaliser avec le bois, seulement le soutenir."
    }
  },
  {
    id: 9, slug: "colmena-silenciosa", category: "rural", icon: "pz-shelf",
    image: "assets/img/pieces/pieza-09.jpg", status: "encargo", featured: false,
    dimensions: "160 × 180 × 32 cm (modular)",
    material: { es: "Paneles de caserío + clavos originales", eu: "Baserriko panelak + iltze originalak", en: "Farmhouse panels + original nails", fr: "Panneaux de ferme + clous d’origine" },
    title: { es: "Colmena silenciosa", eu: "Isilpeko erlauntza", en: "The Silent Hive", fr: "La ruche silencieuse" },
    short: {
      es: "Estantería modular construida con paneles de un caserío en ruinas, conservando marcas de herramientas de generaciones pasadas.",
      eu: "Hondatutako baserri baten paneletatik eraikitako apalategi modularra, iraganeko belaunaldien tresna-arrastoak gordetzen dituena.",
      en: "A modular shelving unit built from the panels of a ruined farmhouse, keeping the tool marks left by past generations.",
      fr: "Étagère modulaire construite avec des panneaux d’une ferme en ruine, conservant des marques d’outils de générations passées."
    },
    motivation: { es: "Los caseríos vacíos del interior de Bizkaia", eu: "Bizkaiko barnealdeko baserri hutsak", en: "The empty farmhouses of inland Bizkaia", fr: "Les fermes vides de l’arrière-pays de Biscaye" },
    story: {
      es: "Los paneles vienen de un caserío del interior que lleva quince años vacío. Alex conservó los agujeros de clavos y las marcas de azuela como parte del diseño, no como defectos a esconder.",
      eu: "Paneleak hamabost urte hutsik dagoen barnealdeko baserri batetik datoz. Alexek iltze-zuloak eta aizkora-arrastoak diseinuaren zati gisa gorde zituen, ezkutatu beharreko akats gisa ez.",
      en: "The panels come from an inland farmhouse that has stood empty for fifteen years. Alex kept the nail holes and adze marks as part of the design, not as flaws to hide.",
      fr: "Les panneaux proviennent d’une ferme de l’arrière-pays vide depuis quinze ans. Alex a conservé les trous de clous et les marques d’herminette comme partie intégrante du design, non comme des défauts à cacher."
    }
  },
  {
    id: 10, slug: "camino-de-helechos", category: "rural", icon: "pz-mirror-organic",
    image: "assets/img/pieces/pieza-10.jpg", status: "disponible", featured: false,
    dimensions: "56 × 62 × 8 cm",
    material: { es: "Ramas de haya entrelazadas", eu: "Elkarlotutako pago-adarrak", en: "Interlaced beech branches", fr: "Branches de hêtre entrelacées" },
    title: { es: "Camino de helechos", eu: "Iratzeen bidea", en: "Fern Path", fr: "Chemin de fougères" },
    short: {
      es: "Espejo orgánico enmarcado con ramas de haya entrelazadas, recogidas tras un temporal en un hayedo del Urdaibai.",
      eu: "Urdaibaiko pagadi batean ekaitz baten ondoren bildutako pago-adar bihurrituekin markatutako ispilu organikoa.",
      en: "An organic mirror framed with interlaced beech branches gathered after a storm in an Urdaibai beech forest.",
      fr: "Miroir organique encadré de branches de hêtre entrelacées, ramassées après une tempête dans une hêtraie d’Urdaibai."
    },
    motivation: { es: "Los paseos por el bosque después de la lluvia", eu: "Basoan euria egin ondoren egindako paseoak", en: "Walks through the forest after the rain", fr: "Les promenades en forêt après la pluie" },
    story: {
      es: "Cada rama se eligió por su curva natural, sin forzar ninguna. El resultado es un marco que parece haber crecido alrededor del espejo, no construido.",
      eu: "Adar bakoitza bere kurba naturalagatik aukeratu zen, bat ere behartu gabe. Emaitza ispiluaren inguruan hazi izan balitz bezalako markoa da, eraikia izan beharrean.",
      en: "Each branch was chosen for its natural curve, none of them forced. The result is a frame that looks as if it grew around the mirror rather than being built.",
      fr: "Chaque branche a été choisie pour sa courbe naturelle, sans en forcer aucune. Le résultat est un cadre qui semble avoir poussé autour du miroir, plutôt que d’avoir été construit."
    }
  },
  {
    id: 11, slug: "pastor-de-gorbeia", category: "rural", icon: "pz-lamp-staff",
    image: "assets/img/pieces/pieza-11.jpg", status: "vendido", featured: false,
    dimensions: "165 × 24 × 24 cm",
    material: { es: "Fresno + asta de ciervo", eu: "Lizarra + oreinaren adarra", en: "Ash wood + deer antler", fr: "Frêne + bois de cerf" },
    title: { es: "Pastor de Gorbeia", eu: "Gorbeiako artzaina", en: "The Shepherd of Gorbeia", fr: "Le berger du Gorbeia" },
    short: {
      es: "Lámpara de pie tallada de una rama de fresno con forma de cayado, con una incrustación de asta de ciervo encontrada en el monte.",
      eu: "Artzain-makila itxurako lizar-adar batean landutako zutiko lanpara, mendian aurkitutako oreinaren adar-txertaketa batekin.",
      en: "A floor lamp carved from an ash branch shaped like a shepherd's crook, inlaid with a deer antler found on the mountain.",
      fr: "Lampadaire taillé dans une branche de frêne en forme de houlette, avec une incrustation de bois de cerf trouvé en montagne."
    },
    motivation: { es: "Los pastores y rebaños del Gorbeia", eu: "Gorbeiako artzainak eta artaldeak", en: "The shepherds and flocks of Mount Gorbeia", fr: "Les bergers et les troupeaux du Gorbeia" },
    story: {
      es: "Un pastor del Gorbeia le regaló a Alex una rama de fresno curvada de forma natural, casi un cayado ya hecho. El asta la encontró él mismo, blanqueada por el sol, en un paseo por el mismo monte.",
      eu: "Gorbeiako artzain batek berez kurbatutako lizar-adar bat eman zion Alexi, ia eginda zegoen makila bat. Adarra berak aurkitu zuen, eguzkiak zuritua, mendi berean egindako paseo batean.",
      en: "A shepherd from Gorbeia gave Alex a naturally curved ash branch, almost a ready-made crook. He found the antler himself, bleached by the sun, on a walk across the same mountain.",
      fr: "Un berger du Gorbeia a offert à Alex une branche de frêne naturellement courbée, presque une houlette toute faite. Le bois de cerf, il l’a trouvé lui-même, blanchi par le soleil, lors d’une promenade sur cette même montagne."
    }
  },
  {
    id: 12, slug: "manzano-viejo", category: "rural", icon: "pz-bowl-large",
    image: "assets/img/pieces/pieza-12.jpg", status: "disponible", featured: false,
    dimensions: "Ø 46 × 14 cm",
    material: { es: "Tronco de manzano + cobre", eu: "Sagarrondo-enborra + kobrea", en: "Apple tree trunk + copper", fr: "Tronc de pommier + cuivre" },
    title: { es: "Manzano viejo", eu: "Sagarrondo zaharra", en: "The Old Apple Tree", fr: "Le vieux pommier" },
    short: {
      es: "Fuente decorativa tallada del tronco hueco de un manzano que dejó de dar fruto, con un fino borde de cobre incrustado.",
      eu: "Fruiturik gehiago ematen ez zuen sagarrondo baten enbor hutsean landutako apaingarrizko ontzia, kobrezko ertz mehe txertatuarekin.",
      en: "A decorative bowl carved from the hollow trunk of an apple tree that stopped bearing fruit, finished with a thin inlaid copper rim.",
      fr: "Coupe décorative taillée dans le tronc creux d’un pommier qui a cessé de donner des fruits, avec une fine bordure en cuivre incrustée."
    },
    motivation: { es: "Los huertos de caserío y sus árboles longevos", eu: "Baserrietako baratzeak eta beren luzaroko zuhaitzak", en: "Farmhouse orchards and their long-lived trees", fr: "Les vergers de ferme et leurs arbres séculaires" },
    story: {
      es: "El manzano llevaba treinta años en el mismo huerto y ya no daba fruto, pero nadie quería talarlo. Cuando finalmente cayó por su propio peso, Alex aprovechó el tronco hueco para esta pieza.",
      eu: "Sagarrondoak hogeita hamar urte zeramatzan baratze berean eta jada frutu ematen ez zuen, baina inork ez zuen moztu nahi. Azkenean bere pisuagatik erori zenean, Alexek enbor hutsa baliatu zuen pieza hau egiteko.",
      en: "The apple tree had stood in the same orchard for thirty years and no longer bore fruit, but no one wanted to fell it. When it finally collapsed under its own weight, Alex used the hollow trunk for this piece.",
      fr: "Le pommier était planté dans le même verger depuis trente ans et ne donnait plus de fruits, mais personne n’osait l’abattre. Quand il s’est finalement effondré sous son propre poids, Alex a récupéré le tronc creux pour cette pièce."
    }
  },
  {
    id: 13, slug: "corteza-y-musgo", category: "rural", icon: "pz-bowl-set",
    image: "assets/img/pieces/pieza-13.jpg", status: "disponible", featured: false,
    dimensions: "Ø 12–18 cm (set de 3)",
    material: { es: "Castaño + cera de abeja", eu: "Gaztainondo-egurra + erle-argizaria", en: "Chestnut wood + beeswax", fr: "Châtaignier + cire d’abeille" },
    title: { es: "Corteza y musgo", eu: "Azala eta lizuna", en: "Bark and Moss", fr: "Écorce et mousse" },
    short: {
      es: "Set de tres cuencos de madera de castaño de un bosque gestionado de forma sostenible, con acabado natural en cera de abeja local.",
      eu: "Modu jasangarrian kudeatutako baso bateko gaztainondo-egurrezko hiru katiluren sorta, bertako erle-argizariz akabatua.",
      en: "A set of three chestnut wood bowls from a sustainably managed forest, finished naturally with local beeswax.",
      fr: "Ensemble de trois bols en bois de châtaignier issu d’une forêt gérée durablement, avec une finition naturelle à la cire d’abeille locale."
    },
    motivation: { es: "Los bosques de castaño de la comarca", eu: "Eskualdeko gaztainondo basoak", en: "The chestnut forests of the region", fr: "Les châtaigneraies de la région" },
    story: {
      es: "Cada cuenco se torneó de una rama distinta de la misma tala de mantenimiento forestal, y se acabó a mano con cera de abeja de un apicultor vecino.",
      eu: "Katilu bakoitza baso-mantenimenduko moztze bereko adar ezberdin batetik bira-landu zen, eta eskuz akabatu zen auzoko erlezain baten argizariarekin.",
      en: "Each bowl was turned from a different branch of the same forest-management felling, and hand-finished with beeswax from a neighbouring beekeeper.",
      fr: "Chaque bol a été tourné dans une branche différente de la même coupe d’entretien forestier, et fini à la main avec la cire d’un apiculteur voisin."
    }
  },
  {
    id: 14, slug: "persiana-de-la-calle-correo", category: "urbano", icon: "pz-lamp-slats",
    image: "assets/img/pieces/pieza-14.jpg", status: "disponible", featured: false,
    dimensions: "150 × 30 × 30 cm",
    material: { es: "Persiana antigua + tubo de cobre", eu: "Pertsiana zaharra + kobrezko hodia", en: "Old shutter + copper pipe", fr: "Volet ancien + tube de cuivre" },
    title: { es: "Persiana de la calle Correo", eu: "Correo kaleko pertsiana", en: "The Correo Street Shutter", fr: "Le volet de la rue Correo" },
    short: {
      es: "Lámpara de pie hecha con las lamas de una persiana de un comercio de Lekeitio a punto de derribo, combinada con tubo de cobre.",
      eu: "Eraisketaren zorian zegoen Lekeitioko denda baten pertsiana-xaflekin eginiko zutiko lanpara, kobrezko hodiarekin konbinatua.",
      en: "A floor lamp made from the slats of a shutter salvaged from a Lekeitio shop about to be demolished, combined with a copper pipe.",
      fr: "Lampadaire fabriqué avec les lattes du volet d’un commerce de Lekeitio sur le point d’être démoli, associées à un tube de cuivre."
    },
    motivation: { es: "Los comercios de siempre que van cerrando en el pueblo", eu: "Herrian pixkanaka itxi diren betiko dendak", en: "The old shops of the town that keep closing down", fr: "Les commerces d’autrefois qui ferment peu à peu" },
    story: {
      es: "La persiana llevaba el verde desconchado de una ferretería que cerró tras 40 años. Alex conservó la pintura original en vez de lijarla del todo, como homenaje al comercio.",
      eu: "Pertsianak 40 urteren ondoren itxi zen burdindegi baten kolore berde xaflatua zeukan. Alexek margo originala gorde zuen erabat leundu gabe, dendari omenaldi gisa.",
      en: "The shutter carried the chipped green paint of a hardware shop that closed after 40 years. Alex kept the original paint instead of fully sanding it off, as a tribute to the shop.",
      fr: "Le volet portait le vert écaillé d’une quincaillerie fermée après 40 ans d’activité. Alex a conservé la peinture d’origine plutôt que de la poncer entièrement, en hommage au commerce."
    }
  },
  {
    id: 15, slug: "adoquin-viajero", category: "urbano", icon: "pz-bookend",
    image: "assets/img/pieces/pieza-15.jpg", status: "encargo", featured: false,
    dimensions: "12 × 10 × 12 cm (par)",
    material: { es: "Adoquín reciclado + latón", eu: "Birziklatutako adokina + latoia", en: "Recycled cobblestone + brass", fr: "Pavé recyclé + laiton" },
    title: { es: "Adoquín viajero", eu: "Adoki bidaiaria", en: "The Traveling Cobblestone", fr: "Le pavé voyageur" },
    short: {
      es: "Sujetalibros de piedra de adoquín recuperado de una reforma urbana, pulida y montada sobre una base de latón.",
      eu: "Hiri-birgaitze batean berreskuratutako adoki-harriz eginiko liburu-euskarriak, leunduta eta latoizko oinarri batean muntatuta.",
      en: "Bookends made from cobblestone salvaged from a street renovation, polished and mounted on a brass base.",
      fr: "Serre-livres en pierre de pavé récupérée lors d’une rénovation urbaine, polie et montée sur une base en laiton."
    },
    motivation: { es: "Las calles del pueblo que cambian de piel", eu: "Larrua aldatzen duten herriko kaleak", en: "The town's streets shedding their old skin", fr: "Les rues du village qui changent de peau" },
    story: {
      es: "Cuando repavimentaron una calle del centro, Alex pidió permiso para quedarse con algunos adoquines retirados. Cada par de sujetalibros lleva grabada la calle de origen en la base.",
      eu: "Erdialdeko kale bat berriro zolatzean, Alexek baimena eskatu zuen kendutako adoki batzuk gordetzeko. Liburu-euskarri bikote bakoitzak jatorrizko kalea grabatuta darama oinarrian.",
      en: "When a street in the town centre was repaved, Alex asked to keep some of the removed cobblestones. Each pair of bookends has the original street name engraved on its base.",
      fr: "Lors de la réfection d’une rue du centre, Alex a demandé la permission de garder quelques pavés retirés. Chaque paire de serre-livres porte gravé, sur sa base, le nom de la rue d’origine."
    }
  },
  {
    id: 16, slug: "ventana-de-la-fonda", category: "urbano", icon: "pz-window-mirror",
    image: "assets/img/pieces/pieza-16.jpg", status: "vendido", featured: true,
    dimensions: "70 × 90 × 6 cm",
    material: { es: "Marco de ventana original + cristal antiguo", eu: "Jatorrizko leiho-markoa + beira zaharra", en: "Original window frame + antique glass", fr: "Cadre de fenêtre d’origine + verre ancien" },
    title: { es: "Ventana de la fonda", eu: "Ostatuko leihoa", en: "The Inn's Window", fr: "La fenêtre de l’auberge" },
    short: {
      es: "Espejo montado en el bastidor original de una ventana de una antigua fonda del pueblo, con una esquina del cristal original conservada.",
      eu: "Herriko ostatu zahar baten leiho-egitura originalean muntatutako ispilua, beira originalaren izkina bat gordez.",
      en: "A mirror set inside the original window frame of the town's old inn, preserving a corner of the antique glass.",
      fr: "Miroir monté dans le cadre d’origine d’une fenêtre d’une ancienne auberge du village, avec un coin du verre d’origine conservé."
    },
    motivation: { es: "La memoria de los edificios que desaparecen del pueblo", eu: "Herritik desagertzen diren eraikinen oroimena", en: "The memory of buildings disappearing from the town", fr: "La mémoire des bâtiments qui disparaissent du village" },
    story: {
      es: "La Fonda Zaharra cerró sus puertas después de casi un siglo recibiendo viajeros, marineros de paso y algún forastero que se quedó para siempre. Antes de la demolición, Alex pidió permiso para retirar una de las ventanas del primer piso, la que según decían daba a la mejor vista del puerto. El marco de madera, pintado y repintado de azul a lo largo de las décadas, conservaba capas de pintura que contaban su propia historia. En una esquina sobrevivía un triángulo del cristal original, ondulado como solo el vidrio antiguo lo está. Alex decidió no sustituirlo: colocó un espejo nuevo en el resto del bastidor y dejó ese fragmento de cristal viejo intacto, como una pequeña ventana dentro de la ventana, para que quien se mire también pueda, por un instante, mirar a través del tiempo.",
      eu: "Ostatu Zaharrak bere ateak itxi zituen ia mende bete bidaiariak, iragaitzako itsasgizonak eta betiko gelditu zen atzerritarren bat hartu ondoren. Eraisketaren aurretik, Alexek baimena eskatu zuen lehen solairuko leiho bat kentzeko, portuko ikuspegi onena zuena omen. Egurrezko markoak, hamarkadetan zehar urdinez margotu eta birmargotuak, bere istorioa kontatzen zuten pintura-geruzak gordetzen zituen. Izkina batean jatorrizko beiraren triangelu bat bizirik zegoen, beira zaharrak bakarrik izaten duen uhin-itxurarekin. Alexek ez zuen ordezkatu: ispilu berri bat jarri zuen egitura gainerakoan eta beira-zati zahar hori ukitu gabe utzi zuen, leiho baten barruko leiho txiki bat balitz bezala, norbaitek ispiluan begiratzean, momentu batez, denboran zehar ere begira dezan.",
      en: "The old inn closed its doors after nearly a century of welcoming travellers, passing sailors, and the occasional stranger who stayed for good. Before the demolition, Alex asked to remove one of the first-floor windows — the one said to have the best view of the harbour. The wooden frame, painted and repainted blue over the decades, held layers of paint that told their own story. In one corner, a triangle of the original glass survived, rippled the way only old glass is. Alex chose not to replace it: he fitted a new mirror into the rest of the frame and left that fragment of old glass untouched, like a small window within the window, so that whoever looks into it can, for a moment, also look through time.",
      fr: "La Vieille Auberge a fermé ses portes après avoir accueilli pendant près d’un siècle des voyageurs, des marins de passage et quelque étranger resté pour de bon. Avant la démolition, Alex a demandé la permission de retirer l’une des fenêtres du premier étage, celle qui, disait-on, offrait la plus belle vue sur le port. Le cadre en bois, peint et repeint en bleu au fil des décennies, conservait des couches de peinture qui racontaient leur propre histoire. Dans un coin survivait un triangle du verre d’origine, ondulé comme seul l’est le verre ancien. Alex a choisi de ne pas le remplacer : il a posé un miroir neuf sur le reste du cadre et a laissé ce fragment de verre ancien intact, comme une petite fenêtre à l’intérieur de la fenêtre, pour que quiconque s’y regarde puisse aussi, un instant, regarder à travers le temps."
    }
  },
  {
    id: 17, slug: "herreria-de-zapatari", category: "urbano", icon: "pz-coat-wall",
    image: "assets/img/pieces/pieza-17.jpg", status: "disponible", featured: false,
    dimensions: "76 × 14 × 18 cm",
    material: { es: "Tabla de roble + hierro forjado de herrería", eu: "Haritz-tabla + burdindegiko burdina forjatua", en: "Oak board + blacksmith-forged iron", fr: "Planche de chêne + fer forgé de forge" },
    title: { es: "Herrería de Zapatari", eu: "Zapatariren burdindegia", en: "The Zapatari Forge", fr: "La forge de Zapatari" },
    short: {
      es: "Perchero de pared con ganchos forjados a partir de herramientas antiguas de una herrería del barrio de Zapatari, ya cerrada.",
      eu: "Zapatari auzoko itxita dagoen burdindegi baten tresna zaharretatik forjatutako kakoekin eginiko horma-arropa-euskarria.",
      en: "A wall coat rack with hooks forged from old tools of a now-closed blacksmith's workshop in the Zapatari quarter.",
      fr: "Portemanteau mural avec des crochets forgés à partir d’outils anciens d’une forge du quartier de Zapatari, aujourd’hui fermée."
    },
    motivation: { es: "Los oficios que se apagan en los barrios antiguos", eu: "Auzo zaharretan itzaltzen diren lanbideak", en: "The trades fading away in the old quarters", fr: "Les métiers qui s’éteignent dans les vieux quartiers" },
    story: {
      es: "El último herrero de Zapatari le dejó a Alex un cajón de herramientas oxidadas antes de jubilarse. De un martillo y dos tenazas nacieron los ganchos de este perchero.",
      eu: "Zapatariko azken errementariak Alexi erretiratu aurretik erdoildutako tresna-kaxa bat utzi zion. Mailu batetik eta bi tenazatatik jaio ziren arropa-euskarri honen kakoak.",
      en: "The last blacksmith of Zapatari gave Alex a drawer of rusted tools before retiring. A hammer and a pair of tongs became the hooks of this coat rack.",
      fr: "Le dernier forgeron de Zapatari a laissé à Alex un tiroir d’outils rouillés avant de prendre sa retraite. D’un marteau et de deux tenailles sont nés les crochets de ce portemanteau."
    }
  },
  {
    id: 18, slug: "tonel-del-txakoli", category: "urbano", icon: "pz-stool-barrel",
    image: "assets/img/pieces/pieza-18.jpg", status: "disponible", featured: false,
    dimensions: "Ø 34 × 46 cm",
    material: { es: "Duelas de tonel + cuero reciclado", eu: "Upel-dolareak + birziklatutako larrua", en: "Barrel staves + recycled leather", fr: "Douelles de tonneau + cuir recyclé" },
    title: { es: "Tonel del txakoli", eu: "Txakolin upela", en: "The Txakoli Barrel", fr: "Le tonneau de txakoli" },
    short: {
      es: "Taburete hecho con las duelas de un antiguo tonel de txakoli, con asiento de cuero reciclado.",
      eu: "Txakolin-upel zahar baten dolareekin eginiko aulkia, birziklatutako larruzko eserlekuarekin.",
      en: "A stool made from the staves of an old txakoli wine barrel, topped with a reused leather seat.",
      fr: "Tabouret fabriqué avec les douelles d’un ancien tonneau de txakoli, avec une assise en cuir recyclé."
    },
    motivation: { es: "Las bodegas familiares de la comarca", eu: "Eskualdeko familia-upategiak", en: "The family wineries of the region", fr: "Les caves familiales de la région" },
    story: {
      es: "El tonel llevaba treinta vendimias de txakoli antes de que una bodega familiar lo retirara. Alex conservó las marcas de los aros de hierro en las duelas como parte del diseño.",
      eu: "Upelak hogeita hamar txakolin-uzta zeramatzan familia-upategi batek erretiratu aurretik. Alexek burdinazko uztaien arrastoak gorde zituen dolaretan, diseinuaren zati gisa.",
      en: "The barrel had held thirty txakoli harvests before a family winery retired it. Alex kept the marks left by the iron hoops on the staves as part of the design.",
      fr: "Le tonneau avait connu trente vendanges de txakoli avant qu’une cave familiale ne le retire du service. Alex a conservé les marques des cercles de fer sur les douelles comme partie intégrante du design."
    }
  },
  {
    id: 19, slug: "cajon-de-pescaderia", category: "urbano", icon: "pz-crate-shelf",
    image: "assets/img/pieces/pieza-19.jpg", status: "encargo", featured: false,
    dimensions: "120 × 90 × 28 cm (modular)",
    material: { es: "Cajas de lonja numeradas", eu: "Lonjako zenbakidun kaxak", en: "Numbered fish-market crates", fr: "Caisses de criée numérotées" },
    title: { es: "Cajón de pescadería", eu: "Arrandegiko kaxa", en: "The Fish Market Crate", fr: "La caisse de la criée" },
    short: {
      es: "Estantería modular hecha con antiguas cajas de madera de la lonja de Lekeitio, cada módulo con su número de origen visible.",
      eu: "Lekeitioko lonjako egurrezko kaxa zaharrekin eginiko apalategi modularra, modulu bakoitzak jatorrizko zenbakia ikusgai duela.",
      en: "A modular shelving unit made from old wooden crates from Lekeitio's fish market, each module keeping its original stencilled number.",
      fr: "Étagère modulaire fabriquée avec d’anciennes caisses en bois de la criée de Lekeitio, chaque module conservant son numéro d’origine visible."
    },
    motivation: { es: "El bullicio silencioso de la lonja al amanecer", eu: "Egunsentian lonjak duen isiltasunezko iharduera", en: "The quiet bustle of the fish market at dawn", fr: "Le brouhaha silencieux de la criée à l’aube" },
    story: {
      es: "La lonja de Lekeitio renueva sus cajas cada pocos años. Alex recoge las descartadas y las convierte en estanterías, dejando visibles los números pintados a mano de cada lote.",
      eu: "Lekeitioko lonjak bere kaxak berritzen ditu urte gutxi batzuetan behin. Alexek baztertutakoak biltzen ditu eta apalategi bihurtzen ditu, sorta bakoitzeko eskuz margotutako zenbakiak ikusgai utziz.",
      en: "Lekeitio's fish market renews its crates every few years. Alex collects the discarded ones and turns them into shelving, leaving each batch's hand-painted number visible.",
      fr: "La criée de Lekeitio renouvelle ses caisses tous les quelques années. Alex récupère celles qui sont mises au rebut et les transforme en étagères, en laissant visibles les numéros peints à la main de chaque lot."
    }
  },
  {
    id: 20, slug: "reloj-de-la-estacion", category: "urbano", icon: "pz-clock-wheel",
    image: "assets/img/pieces/pieza-20.jpg", status: "vendido", featured: false,
    dimensions: "Ø 70 × 12 cm",
    material: { es: "Rueda de vagón de tren", eu: "Tren-bagoiaren gurpila", en: "Train-carriage wheel", fr: "Roue de wagon de train" },
    title: { es: "Reloj de la estación", eu: "Geltokiko erlojua", en: "The Station Clock", fr: "L’horloge de la gare" },
    short: {
      es: "Reloj de pared de gran formato con la esfera integrada en una vieja rueda de vagón de tren en desuso.",
      eu: "Erabilera gabeko tren-bagoi baten gurpil zaharrean integratutako esfera duen tamaina handiko horma-erlojua.",
      en: "A large wall clock with its face built into an old, disused train-carriage wheel.",
      fr: "Horloge murale de grand format dont le cadran est intégré dans une vieille roue de wagon de train hors d’usage."
    },
    motivation: { es: "La vía abandonada que unía Lekeitio con el interior", eu: "Lekeitio barnealdearekin lotzen zuen bide abandonatua", en: "The disused railway line that once linked Lekeitio to the interior", fr: "La voie ferrée désaffectée qui reliait Lekeitio à l’arrière-pays" },
    story: {
      es: "La rueda llevaba años oxidándose junto a una vía en desuso. Alex la rescató, la trató contra la corrosión y le insertó un mecanismo de reloj silencioso, dejando el óxido visible como parte del diseño.",
      eu: "Gurpila urteak zeramatzan erabilera gabeko bide baten ondoan erdoiltzen. Alexek salbatu zuen, herdoiaren aurka tratatu eta erloju-mekanismo isil bat txertatu zion, herdoia diseinuaren zati gisa ikusgai utziz.",
      en: "The wheel had spent years rusting beside a disused railway line. Alex rescued it, treated it against corrosion, and fitted it with a silent clock mechanism, leaving the rust visible as part of the design.",
      fr: "La roue rouillait depuis des années à côté d’une voie désaffectée. Alex l’a récupérée, l’a traitée contre la corrosion et y a inséré un mécanisme d’horloge silencieux, en laissant la rouille visible comme partie intégrante du design."
    }
  }
];

var ALEX_CATEGORY_LABELS = {
  mar:    { es: "Mar", eu: "Itsasoa", en: "Sea", fr: "Mer" },
  rural:  { es: "Rural", eu: "Landa", en: "Countryside", fr: "Campagne" },
  urbano: { es: "Recuperado urbano", eu: "Hiriko materiala", en: "Urban salvage", fr: "Récupération urbaine" }
};

var ALEX_STATUS_LABELS = {
  disponible: { es: "Disponible", eu: "Eskuragarri", en: "Available", fr: "Disponible" },
  vendido:    { es: "Vendido", eu: "Saldua", en: "Sold", fr: "Vendue" },
  encargo:    { es: "Bajo encargo", eu: "Eskarira", en: "Made to order", fr: "Sur commande" }
};
