// Source (departure) cities used by the planner to estimate transport cost.
// "region" is compared against a domestic destination's region in
// utils/transportCost.js — same-region trips are estimated as cheaper than
// cross-country ones.

const cities = [
  { id: 1, name: 'Delhi', region: 'North' },
  { id: 2, name: 'Mumbai', region: 'West' },
  { id: 3, name: 'Bengaluru', region: 'South' },
  { id: 4, name: 'Chennai', region: 'South' },
  { id: 5, name: 'Kolkata', region: 'East' },
  { id: 6, name: 'Hyderabad', region: 'South' },
  { id: 7, name: 'Pune', region: 'West' },
  { id: 8, name: 'Ahmedabad', region: 'West' },
  { id: 9, name: 'Jaipur', region: 'North' },
  { id: 10, name: 'Lucknow', region: 'North' },
  { id: 11, name: 'Bhopal', region: 'Central' },
  { id: 12, name: 'Guwahati', region: 'East' },
  { id: 13, name: 'Chandigarh', region: 'North' },
  { id: 14, name: 'Kochi', region: 'South' },
]

export default cities
