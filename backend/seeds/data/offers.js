// Realistic promotional offers — seeded so /api/offers has real data to serve.
// applicableCategories reuses the same Attraction.category vocabulary the
// itinerary generator already uses (see server/models/Attraction.js), so an
// offer only ever shows for a trip that genuinely matches both its
// destination AND at least one of these categories — never a destination-only
// match (see getApplicable in offerController.js).
const offers = [
  {
    title: 'Early Bird Beach Getaway',
    description: '15% off any Goa or Bali package when booked at least 30 days in advance.',
    discountPercent: 15,
    code: 'EARLYBIRD15',
    destination: '',
    applicableCategories: ['Beach'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    validTill: new Date('2026-12-31'),
    active: true,
  },
  {
    title: 'Honeymoon Special — Maldives',
    description: 'Complimentary candlelight dinner and spa session on all Maldives honeymoon packages.',
    discountPercent: 10,
    code: 'HONEYMOON10',
    destination: 'Maldives',
    applicableCategories: ['Beach'],
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    validTill: new Date('2026-12-31'),
    active: true,
  },
  {
    title: 'Weekend Escape — Goa',
    description: 'Flat 12% off short 3-4 day Goa getaways booked for weekend travel dates.',
    discountPercent: 12,
    code: 'GOAWEEKEND',
    destination: 'Goa',
    applicableCategories: ['Beach', 'Nightlife'],
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    validTill: new Date('2026-11-30'),
    active: true,
  },
  {
    title: 'Paris Shopping Offer',
    description: '₹5,000 off Paris packages with a shopping-focused itinerary.',
    discountPercent: 8,
    code: 'EUROSUMMER',
    destination: 'Paris',
    applicableCategories: ['Shopping'],
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    validTill: new Date('2027-06-30'),
    active: true,
  },
  {
    title: 'Adventure Seeker Discount',
    description: '10% off all packages tagged Adventure or Nature.',
    discountPercent: 10,
    code: 'ADVENTURE10',
    destination: '',
    applicableCategories: ['Adventure', 'Nature'],
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
    validTill: new Date('2026-12-31'),
    active: true,
  },
  {
    title: 'Rishikesh Adventure Offer',
    description: '15% off Rishikesh trips with river rafting, trekking or other adventure/nature activities.',
    discountPercent: 15,
    code: 'RISHIADV15',
    destination: 'Rishikesh',
    applicableCategories: ['Adventure', 'Nature'],
    minimumAmount: 0,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    validTill: new Date('2026-12-31'),
    active: true,
  },
]

module.exports = offers
