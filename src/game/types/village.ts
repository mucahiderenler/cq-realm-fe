
export interface Village {
  id: number,
  ownerID: number,
  ownerName: string, // Player name
  name: string, // Village name
  x: number,
  y: number,
  point: number,
}

export interface Building {
  buildTime: string
  buildingType: number
  id: number
  lastUpgrade: string
  level: number
  name: string
  productionRate: number | null // Buildings like headquarter has no production rate (might change later)
  tileX: number
  tileY: number
  villageID: number
}

export interface FullVillage {
  village: Village,
  buildings: Building[]
}