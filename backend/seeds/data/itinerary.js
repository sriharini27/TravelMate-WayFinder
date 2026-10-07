// Day activity pools used by the AI itinerary generator (utils/generateTrip.js).
// Each destination has a bank of activities the generator draws from based on
// selected interests, trip length and travel style.

const itineraryBank = {
  Bali: {
    weather: '29°C · Tropical, light showers likely in the afternoon',
    attractions: ['Tanah Lot Temple', 'Ubud Monkey Forest', 'Tegallalang Rice Terrace', 'Seminyak Beach', 'Mount Batur'],
    tips: [
      'Carry cash — many warungs do not accept cards.',
      'Book sunrise Mount Batur treks a day in advance.',
      'Respect temple dress codes; sarongs are usually provided.',
    ],
    activities: {
      Arrival: 'Airport pickup and hotel check-in in Seminyak',
      Adventure: 'Mount Batur sunrise trek with local guide',
      Beach: 'Relax at Seminyak Beach with a sunset cocktail',
      Nature: 'Explore Tegallalang Rice Terrace and Ubud jungle swing',
      History: 'Guided tour of Tanah Lot Temple',
      Shopping: 'Browse boutiques and art markets in Ubud',
      Food: 'Traditional Balinese cooking class and food tour',
      Luxury: 'Private villa spa and infinity pool evening',
    },
  },
  Maldives: {
    weather: '31°C · Sunny with calm seas, ideal for water sports',
    attractions: ['House Reef Snorkeling', 'Sandbank Picnic Island', 'Local Fishing Village', 'Bioluminescent Beach'],
    tips: [
      'Pack reef-safe sunscreen to protect the coral.',
      'Inter-island transfers are by speedboat or seaplane — book early.',
      'Most resorts operate on an all-inclusive meal plan.',
    ],
    activities: {
      Arrival: 'Seaplane transfer and overwater villa check-in',
      Beach: 'Snorkeling at the house reef',
      Adventure: 'Sunset dolphin cruise and deep-sea fishing',
      Nature: 'Sandbank picnic on a private island',
      Luxury: 'In-villa spa treatment and candlelight dinner',
      Food: 'Underwater restaurant dining experience',
    },
  },
  Goa: {
    weather: '32°C · Warm and humid, sea breeze in the evenings',
    attractions: ['Baga Beach', 'Fort Aguada', 'Anjuna Flea Market', 'Basilica of Bom Jesus', 'Dudhsagar Falls'],
    tips: [
      'Rent a scooter for the most flexible way to explore.',
      'Weekend flea markets are best visited before noon.',
      'Try authentic Goan fish curry at a beach shack.',
    ],
    activities: {
      Arrival: 'Airport pickup and beach resort check-in',
      Beach: 'Water sports and sunbathing at Baga Beach',
      Adventure: 'Jet-ski and parasailing session',
      History: 'Fort Aguada and Basilica of Bom Jesus tour',
      Shopping: 'Anjuna flea market shopping spree',
      Food: 'Goan seafood dinner and beach shack hopping',
      Nature: 'Day trip to Dudhsagar Falls',
    },
  },
  Paris: {
    weather: '18°C · Mild with clear skies, light jacket recommended',
    attractions: ['Eiffel Tower', 'Louvre Museum', 'Montmartre', 'Seine River', 'Palace of Versailles'],
    tips: [
      'Buy skip-the-line tickets for the Louvre and Eiffel Tower online.',
      'The metro is the fastest way to move around the city.',
      'Sunday mornings are quieter at major landmarks.',
    ],
    activities: {
      Arrival: 'Airport transfer and boutique hotel check-in',
      History: 'Guided tour of the Louvre Museum',
      Luxury: 'Eiffel Tower dinner with city views',
      Nature: 'Evening Seine River cruise',
      Shopping: 'Champs-Élysées shopping walk',
      Food: 'Montmartre food and pastry tour',
      Adventure: 'Day trip to Palace of Versailles',
    },
  },
  Dubai: {
    weather: '36°C · Hot and dry, evenings are pleasant',
    attractions: ['Burj Khalifa', 'Dubai Marina', 'Desert Safari Camp', 'Palm Jumeirah', 'Gold Souk'],
    tips: [
      'Desert safaris typically depart late afternoon to avoid peak heat.',
      'Dress modestly when visiting cultural and religious sites.',
      'Uber and the metro are both reliable ways to get around.',
    ],
    activities: {
      Arrival: 'Airport pickup and marina hotel check-in',
      Luxury: 'Burj Khalifa observation deck and yacht cruise',
      Adventure: 'Desert safari with dune bashing and BBQ dinner',
      Shopping: 'Gold Souk and Dubai Mall shopping',
      Beach: 'Relax at Palm Jumeirah beach club',
      Food: 'Fine dining tour across Dubai Marina',
    },
  },
  Switzerland: {
    weather: '12°C · Crisp alpine air, pack warm layers',
    attractions: ['Jungfraujoch', 'Lake Lucerne', 'Glacier Express', 'Matterhorn Viewpoint', 'Chapel Bridge'],
    tips: [
      'Buy a Swiss Travel Pass for unlimited train and boat travel.',
      'Book Jungfraujoch tickets early — the "Top of Europe" sells out fast.',
      'Layer clothing as alpine weather changes quickly.',
    ],
    activities: {
      Arrival: 'Airport transfer and alpine chalet check-in',
      Nature: 'Scenic Glacier Express train ride',
      Adventure: 'Jungfraujoch "Top of Europe" excursion',
      Luxury: 'Lake Lucerne cruise with fondue dinner',
      History: 'Walk across the historic Chapel Bridge',
      Food: 'Traditional Swiss fondue and chocolate tasting',
    },
  },
}

module.exports = itineraryBank
