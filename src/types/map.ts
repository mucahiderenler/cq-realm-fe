export interface GameMap {
  villages: Village[]
}

export interface Village {
  id: number,
  ownerID: number,
  ownerName: string, // Player name
  name: string, // Village name
  x: number,
  y: number,
  point: number,
}