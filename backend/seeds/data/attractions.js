// Curated, real-world tourist attractions for every destination in TravelMate's
// catalog. Every entry here is a genuine, well-known place — nothing is
// invented. This is the verified source of truth the AI itinerary generator
// (client/src/utils/generateTrip.js) selects from; it never fabricates a
// "City Center" / "Old Town" style placeholder for a destination.
//
// category drives interest-based selection (Adventure, Beach, Nature, History,
// Shopping, Food, Luxury/Culture, Nightlife, Religious, Landmark, Family).

const attractions = [
  // ---- Bali, Indonesia ----
  { name: 'Tanah Lot Temple', destination: 'Bali', country: 'Indonesia', category: 'Religious', description: 'An iconic sea temple perched on a rock formation, famous for sunset views.' },
  { name: 'Ubud Monkey Forest', destination: 'Bali', country: 'Indonesia', category: 'Nature', description: 'A forested sanctuary with hundreds of long-tailed macaques and ancient temples.' },
  { name: 'Tegallalang Rice Terrace', destination: 'Bali', country: 'Indonesia', category: 'Nature', description: 'Dramatic stepped rice paddies carved into the hillside near Ubud.' },
  { name: 'Seminyak Beach', destination: 'Bali', country: 'Indonesia', category: 'Beach', description: 'A fashionable stretch of sand known for beach clubs and sunsets.' },
  { name: 'Mount Batur', destination: 'Bali', country: 'Indonesia', category: 'Adventure', description: 'An active volcano popular for sunrise trekking.' },
  { name: 'Uluwatu Temple', destination: 'Bali', country: 'Indonesia', category: 'Culture', description: 'A clifftop temple famous for Kecak fire dance performances at dusk.' },
  { name: 'Seminyak Art Market', destination: 'Bali', country: 'Indonesia', category: 'Shopping', description: 'Local market for batik, sarongs and handmade souvenirs.' },

  // ---- Maldives ----
  { name: 'House Reef Snorkeling (Maafushi)', destination: 'Maldives', country: 'Maldives', category: 'Beach', description: 'Shallow coral reef accessible right off the beach, rich with marine life.' },
  { name: 'Sandbank Picnic Island', destination: 'Maldives', country: 'Maldives', category: 'Nature', description: 'A private sandbar surrounded by turquoise lagoon water, ideal for a day trip.' },
  { name: 'Maldives Fish Market, Malé', destination: 'Maldives', country: 'Maldives', category: 'Culture', description: 'A bustling local market showing the everyday life of the capital island.' },
  { name: 'Hulhumalé Beach', destination: 'Maldives', country: 'Maldives', category: 'Beach', description: 'A popular public beach with calm, swimmable waters.' },
  { name: 'Banana Reef', destination: 'Maldives', country: 'Maldives', category: 'Adventure', description: 'One of the Maldives’ original dive sites, known for coral canyons and reef sharks.' },
  { name: 'Dolphin Watching Cruise, North Malé Atoll', destination: 'Maldives', country: 'Maldives', category: 'Nature', description: 'Sunset cruise to spot spinner dolphins in the open atoll waters.' },

  // ---- Goa, India ----
  { name: 'Baga Beach', destination: 'Goa', country: 'India', category: 'Beach', description: 'One of North Goa’s liveliest beaches, lined with shacks and water sports.' },
  { name: 'Fort Aguada', destination: 'Goa', country: 'India', category: 'History', description: 'A 17th-century Portuguese fort overlooking the Arabian Sea.' },
  { name: 'Basilica of Bom Jesus', destination: 'Goa', country: 'India', category: 'Religious', description: 'A UNESCO World Heritage baroque church in Old Goa.' },
  { name: 'Anjuna Flea Market', destination: 'Goa', country: 'India', category: 'Shopping', description: 'A famous Wednesday market for textiles, jewelry and local crafts.' },
  { name: 'Dudhsagar Falls', destination: 'Goa', country: 'India', category: 'Nature', description: 'A four-tiered waterfall on the Goa-Karnataka border, reached by jeep safari.' },
  { name: 'Tito’s Lane, Baga', destination: 'Goa', country: 'India', category: 'Nightlife', description: 'Goa’s best-known nightlife strip of clubs and bars.' },

  // ---- Paris, France ----
  { name: 'Eiffel Tower', destination: 'Paris', country: 'France', category: 'Landmark', description: 'Paris’ iconic iron tower and most famous landmark.' },
  { name: 'Louvre Museum', destination: 'Paris', country: 'France', category: 'History', description: 'The world’s largest art museum, home to the Mona Lisa.' },
  { name: 'Musée d’Orsay', destination: 'Paris', country: 'France', category: 'Culture', description: 'A former railway station turned museum of Impressionist masterpieces.' },
  { name: 'Arc de Triomphe', destination: 'Paris', country: 'France', category: 'History', description: 'A monumental arch honoring those who fought for France.' },
  { name: 'Notre-Dame Cathedral', destination: 'Paris', country: 'France', category: 'Religious', description: 'A medieval Catholic cathedral renowned for its Gothic architecture.' },
  { name: 'Montmartre', destination: 'Paris', country: 'France', category: 'Culture', description: 'A hilltop artists’ quarter crowned by the Sacré-Cœur basilica.' },
  { name: 'Seine River Cruise', destination: 'Paris', country: 'France', category: 'Nature', description: 'A relaxed boat cruise past Paris’ landmarks along the river.' },
  { name: 'Champs-Élysées', destination: 'Paris', country: 'France', category: 'Shopping', description: 'Paris’ grand boulevard of flagship stores and cafés.' },
  { name: 'Luxembourg Gardens', destination: 'Paris', country: 'France', category: 'Nature', description: 'Formal gardens popular for a quiet stroll in central Paris.' },
  { name: 'Palace of Versailles', destination: 'Paris', country: 'France', category: 'History', description: 'The opulent former royal residence, a short day trip from Paris.' },

  // ---- Dubai, UAE ----
  { name: 'Burj Khalifa', destination: 'Dubai', country: 'UAE', category: 'Landmark', description: 'The world’s tallest building, with an observation deck over the city.' },
  { name: 'Dubai Mall', destination: 'Dubai', country: 'UAE', category: 'Shopping', description: 'One of the world’s largest malls, with an aquarium and ice rink.' },
  { name: 'Palm Jumeirah', destination: 'Dubai', country: 'UAE', category: 'Landmark', description: 'A man-made palm-shaped island with resorts and beach clubs.' },
  { name: 'Desert Safari, Dubai Desert Conservation Reserve', destination: 'Dubai', country: 'UAE', category: 'Adventure', description: 'Dune bashing, camel rides and a Bedouin-style evening in the desert.' },
  { name: 'Dubai Marina Walk', destination: 'Dubai', country: 'UAE', category: 'Nightlife', description: 'A waterfront promenade of restaurants, cafés and skyline views.' },
  { name: 'Al Fahidi Historical Neighbourhood', destination: 'Dubai', country: 'UAE', category: 'History', description: 'Dubai’s old quarter of wind-tower architecture and the Dubai Museum.' },
  { name: 'Jumeirah Beach', destination: 'Dubai', country: 'UAE', category: 'Beach', description: 'A clean public beach with views of the Burj Al Arab.' },

  // ---- Switzerland ----
  { name: 'Matterhorn, Zermatt', destination: 'Switzerland', country: 'Switzerland', category: 'Nature', description: 'Switzerland’s most iconic peak, viewed from the car-free resort town of Zermatt.' },
  { name: 'Jungfraujoch – Top of Europe', destination: 'Switzerland', country: 'Switzerland', category: 'Adventure', description: 'A high-altitude rail excursion to one of Europe’s highest train stations.' },
  { name: 'Lake Geneva', destination: 'Switzerland', country: 'Switzerland', category: 'Nature', description: 'A vast alpine lake bordered by vineyards and lakeside towns.' },
  { name: 'Chapel Bridge, Lucerne', destination: 'Switzerland', country: 'Switzerland', category: 'History', description: 'A 14th-century wooden bridge, Lucerne’s best-known landmark.' },
  { name: 'Rhine Falls', destination: 'Switzerland', country: 'Switzerland', category: 'Nature', description: 'The largest plain waterfall in Europe, near Schaffhausen.' },
  { name: 'Bahnhofstrasse, Zurich', destination: 'Switzerland', country: 'Switzerland', category: 'Shopping', description: 'Zurich’s premier shopping avenue.' },

  // ---- Manali, India ----
  { name: 'Solang Valley', destination: 'Manali', country: 'India', category: 'Adventure', description: 'A valley known for paragliding, zorbing and winter skiing.' },
  { name: 'Rohtang Pass', destination: 'Manali', country: 'India', category: 'Nature', description: 'A high mountain pass with snow-capped views (seasonal access).' },
  { name: 'Hadimba Temple', destination: 'Manali', country: 'India', category: 'Religious', description: 'A wooden cave temple set in a cedar forest.' },
  { name: 'Old Manali', destination: 'Manali', country: 'India', category: 'Culture', description: 'A laid-back village of cafés, riverside walks and boutique stores.' },
  { name: 'Mall Road, Manali', destination: 'Manali', country: 'India', category: 'Shopping', description: 'The town’s main shopping and dining stretch.' },
  { name: 'Beas River Rafting, Kullu', destination: 'Manali', country: 'India', category: 'Adventure', description: 'White-water rafting along the Beas river near Kullu.' },

  // ---- Jaipur, India ----
  { name: 'Hawa Mahal', destination: 'Jaipur', country: 'India', category: 'History', description: 'The "Palace of Winds", a pink sandstone façade of 953 small windows.' },
  { name: 'Amber Fort', destination: 'Jaipur', country: 'India', category: 'History', description: 'A majestic hilltop fort of mirrored halls and courtyards.' },
  { name: 'City Palace, Jaipur', destination: 'Jaipur', country: 'India', category: 'Culture', description: 'A palace complex still partly home to the former royal family.' },
  { name: 'Jantar Mantar, Jaipur', destination: 'Jaipur', country: 'India', category: 'History', description: 'An 18th-century astronomical observatory, a UNESCO World Heritage Site.' },
  { name: 'Johari Bazaar', destination: 'Jaipur', country: 'India', category: 'Shopping', description: 'Jaipur’s famous jewelry and gemstone market.' },
  { name: 'Chokhi Dhani', destination: 'Jaipur', country: 'India', category: 'Food', description: 'A Rajasthani ethnic village resort known for traditional thali dinners.' },

  // ---- Kerala, India ----
  { name: 'Alleppey Backwaters', destination: 'Kerala', country: 'India', category: 'Nature', description: 'A network of lagoons and canals explored by traditional houseboat.' },
  { name: 'Munnar Tea Gardens', destination: 'Kerala', country: 'India', category: 'Nature', description: 'Rolling hills blanketed in tea plantations.' },
  { name: 'Fort Kochi', destination: 'Kerala', country: 'India', category: 'History', description: 'A historic coastal area known for Chinese fishing nets and colonial architecture.' },
  { name: 'Periyar Wildlife Sanctuary', destination: 'Kerala', country: 'India', category: 'Adventure', description: 'A tiger reserve offering boat safaris on Periyar Lake, Thekkady.' },
  { name: 'Varkala Beach', destination: 'Kerala', country: 'India', category: 'Beach', description: 'A dramatic cliffside beach with Ayurvedic resorts.' },
  { name: 'Kathakali Performance, Kochi', destination: 'Kerala', country: 'India', category: 'Culture', description: 'A traditional Keralan dance-drama performance.' },

  // ---- Rishikesh, India ----
  { name: 'Laxman Jhula', destination: 'Rishikesh', country: 'India', category: 'Landmark', description: 'An iron suspension bridge over the Ganges.' },
  { name: 'Ram Jhula & Triveni Ghat', destination: 'Rishikesh', country: 'India', category: 'Religious', description: 'Riverside ghats known for the evening Ganga Aarti ceremony.' },
  { name: 'Beatles Ashram', destination: 'Rishikesh', country: 'India', category: 'Culture', description: 'The former ashram where The Beatles stayed in 1968, now an art space.' },
  { name: 'White-water Rafting, Ganges', destination: 'Rishikesh', country: 'India', category: 'Adventure', description: 'Rafting stretches on the Ganges ranging from mild to challenging rapids.' },
  { name: 'Neelkanth Mahadev Temple', destination: 'Rishikesh', country: 'India', category: 'Religious', description: 'A forested hillside Shiva temple near Rishikesh.' },

  // ---- Udaipur, India ----
  { name: 'City Palace, Udaipur', destination: 'Udaipur', country: 'India', category: 'History', description: 'A grand palace complex overlooking Lake Pichola.' },
  { name: 'Lake Pichola', destination: 'Udaipur', country: 'India', category: 'Nature', description: 'An artificial lake with boat rides past the Lake Palace.' },
  { name: 'Jag Mandir', destination: 'Udaipur', country: 'India', category: 'Landmark', description: 'A palace built on an island in Lake Pichola.' },
  { name: 'Saheliyon ki Bari', destination: 'Udaipur', country: 'India', category: 'Nature', description: 'A garden of fountains built for royal ladies-in-waiting.' },
  { name: 'Hathi Pol Bazaar', destination: 'Udaipur', country: 'India', category: 'Shopping', description: 'A market street for miniature paintings and handicrafts.' },

  // ---- Andaman Islands, India ----
  { name: 'Radhanagar Beach, Havelock', destination: 'Andaman Islands', country: 'India', category: 'Beach', description: 'A pristine white-sand beach repeatedly ranked among Asia’s best.' },
  { name: 'Cellular Jail, Port Blair', destination: 'Andaman Islands', country: 'India', category: 'History', description: 'A colonial-era prison, now a national memorial with a light-and-sound show.' },
  { name: 'Ross Island', destination: 'Andaman Islands', country: 'India', category: 'History', description: 'Former British administrative headquarters, now scenic ruins.' },
  { name: 'Elephant Beach Snorkeling, Havelock', destination: 'Andaman Islands', country: 'India', category: 'Adventure', description: 'A coral reef cove popular for snorkeling and water sports.' },
  { name: 'Neil Island', destination: 'Andaman Islands', country: 'India', category: 'Nature', description: 'A quieter island known for natural rock bridges and lagoons.' },

  // ---- Darjeeling, India ----
  { name: 'Tiger Hill', destination: 'Darjeeling', country: 'India', category: 'Nature', description: 'A sunrise viewpoint over the Kanchenjunga range.' },
  { name: 'Darjeeling Himalayan Railway', destination: 'Darjeeling', country: 'India', category: 'History', description: 'The UNESCO-listed "Toy Train" through the hills.' },
  { name: 'Batasia Loop', destination: 'Darjeeling', country: 'India', category: 'Landmark', description: 'A spiral railway loop with a war memorial and mountain views.' },
  { name: 'Peace Pagoda, Darjeeling', destination: 'Darjeeling', country: 'India', category: 'Religious', description: 'A Japanese Buddhist peace pagoda overlooking the town.' },
  { name: 'Happy Valley Tea Estate', destination: 'Darjeeling', country: 'India', category: 'Food', description: 'A working tea garden offering tours and tastings.' },

  // ---- Coorg, India ----
  { name: 'Abbey Falls', destination: 'Coorg', country: 'India', category: 'Nature', description: 'A cascading waterfall surrounded by coffee and spice plantations.' },
  { name: 'Raja’s Seat', destination: 'Coorg', country: 'India', category: 'Nature', description: 'A garden viewpoint once used by Kodagu kings to watch the sunset.' },
  { name: 'Namdroling Monastery', destination: 'Coorg', country: 'India', category: 'Religious', description: 'The "Golden Temple", a large Tibetan Buddhist monastery.' },
  { name: 'Dubare Elephant Camp', destination: 'Coorg', country: 'India', category: 'Family', description: 'A riverside camp for elephant interaction and care.' },
  { name: 'Talacauvery', destination: 'Coorg', country: 'India', category: 'Religious', description: 'The sacred source of the River Cauvery, high in the Western Ghats.' },

  // ---- Bangkok, Thailand ----
  { name: 'Grand Palace', destination: 'Bangkok', country: 'Thailand', category: 'History', description: 'The former royal residence and home to the Temple of the Emerald Buddha.' },
  { name: 'Wat Arun', destination: 'Bangkok', country: 'Thailand', category: 'Religious', description: 'The "Temple of Dawn" on the banks of the Chao Phraya River.' },
  { name: 'Chatuchak Weekend Market', destination: 'Bangkok', country: 'Thailand', category: 'Shopping', description: 'One of the world’s largest weekend markets.' },
  { name: 'Wat Pho', destination: 'Bangkok', country: 'Thailand', category: 'Religious', description: 'Home to the giant Reclining Buddha statue.' },
  { name: 'Chao Phraya River Cruise', destination: 'Bangkok', country: 'Thailand', category: 'Nature', description: 'An evening dinner cruise past the city’s illuminated riverside temples.' },
  { name: 'Khao San Road', destination: 'Bangkok', country: 'Thailand', category: 'Nightlife', description: 'Bangkok’s famous backpacker street of bars and street food.' },

  // ---- Singapore ----
  { name: 'Gardens by the Bay', destination: 'Singapore', country: 'Singapore', category: 'Nature', description: 'Futuristic Supertree gardens and the Cloud Forest conservatory.' },
  { name: 'Marina Bay Sands SkyPark', destination: 'Singapore', country: 'Singapore', category: 'Landmark', description: 'An observation deck atop Marina Bay Sands with skyline views.' },
  { name: 'Sentosa Island', destination: 'Singapore', country: 'Singapore', category: 'Family', description: 'A resort island with beaches, rides and attractions.' },
  { name: 'Universal Studios Singapore', destination: 'Singapore', country: 'Singapore', category: 'Family', description: 'A movie-themed amusement park on Sentosa Island.' },
  { name: 'Singapore Zoo', destination: 'Singapore', country: 'Singapore', category: 'Family', description: 'An open-concept zoo known for its naturalistic habitats.' },
  { name: 'Orchard Road', destination: 'Singapore', country: 'Singapore', category: 'Shopping', description: 'Singapore’s premier shopping boulevard.' },

  // ---- Bhutan ----
  { name: 'Tiger’s Nest Monastery (Paro Taktsang)', destination: 'Bhutan', country: 'Bhutan', category: 'Religious', description: 'A sacred monastery clinging to a cliffside above Paro valley.' },
  { name: 'Punakha Dzong', destination: 'Bhutan', country: 'Bhutan', category: 'History', description: 'A fortress-monastery at the confluence of two rivers.' },
  { name: 'Thimphu Chorten', destination: 'Bhutan', country: 'Bhutan', category: 'Religious', description: 'A memorial stupa and a focal point of daily worship in the capital.' },
  { name: 'Dochula Pass', destination: 'Bhutan', country: 'Bhutan', category: 'Nature', description: 'A mountain pass with 108 memorial chortens and Himalayan views.' },
  { name: 'Buddha Dordenma', destination: 'Bhutan', country: 'Bhutan', category: 'Landmark', description: 'A giant golden Buddha statue overlooking Thimphu valley.' },

  // ---- Sri Lanka ----
  { name: 'Sigiriya Rock Fortress', destination: 'Sri Lanka', country: 'Sri Lanka', category: 'History', description: 'An ancient rock citadel and UNESCO World Heritage Site.' },
  { name: 'Temple of the Sacred Tooth Relic, Kandy', destination: 'Sri Lanka', country: 'Sri Lanka', category: 'Religious', description: 'A Buddhist temple housing a relic of the Buddha’s tooth.' },
  { name: 'Galle Fort', destination: 'Sri Lanka', country: 'Sri Lanka', category: 'History', description: 'A fortified colonial-era town on the southern coast.' },
  { name: 'Nuwara Eliya Tea Plantations', destination: 'Sri Lanka', country: 'Sri Lanka', category: 'Nature', description: 'Cool-climate hill country covered in tea estates.' },
  { name: 'Yala National Park', destination: 'Sri Lanka', country: 'Sri Lanka', category: 'Adventure', description: 'A wildlife reserve known for leopard sightings on jeep safari.' },
  { name: 'Mirissa Beach', destination: 'Sri Lanka', country: 'Sri Lanka', category: 'Beach', description: 'A south-coast beach known for whale watching and surfing.' },
]

module.exports = attractions
