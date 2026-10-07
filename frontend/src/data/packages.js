// Mutable cache populated from MongoDB via CatalogContext — see destinations.js.
export const packages = []

export function setPackages(list) {
  packages.length = 0
  packages.push(...list)
}

export default packages
