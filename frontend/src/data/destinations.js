// This file is now a thin, mutable cache populated from MongoDB via
// CatalogContext (src/context/CatalogContext.jsx) at app startup — it is no
// longer the source of truth for destination data. Existing code that does
// `import destinations from './destinations.js'` keeps working unchanged
// because this stays the SAME array object; CatalogContext just fills it.
export const destinations = []

export function setDestinations(list) {
  destinations.length = 0
  destinations.push(...list)
}

export default destinations
