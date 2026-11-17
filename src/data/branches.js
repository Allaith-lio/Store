export const branches = [
  {
    id: "main", name: "Main Branch", location: "Downtown",
    address: "12 Central Street, Downtown", phone: "+963 11 000 0001",
    hours: "9:00 AM – 9:00 PM", opensAt: 9, closesAt: 21,
  },
  {
    id: "north", name: "North Branch", location: "North District",
    address: "48 Garden Avenue, North District", phone: "+963 11 000 0002",
    hours: "10:00 AM – 10:00 PM", opensAt: 10, closesAt: 22,
  },
  {
    id: "south", name: "South Branch", location: "South District",
    address: "7 Market Road, South District", phone: "+963 11 000 0003",
    hours: "9:00 AM – 8:00 PM", opensAt: 9, closesAt: 20,
  },
];

export const initialStockByProduct = {
  1: { main: 5, north: 0, south: 3 },
  2: { main: 2, north: 4, south: 0 },
  3: { main: 0, north: 3, south: 2 },
  4: { main: 4, north: 2, south: 0 },
  5: { main: 0, north: 5, south: 3 },
  6: { main: 3, north: 0, south: 4 },
  7: { main: 2, north: 3, south: 0 },
  8: { main: 0, north: 2, south: 5 },
  9: { main: 4, north: 0, south: 3 },
  10: { main: 3, north: 4, south: 0 },
  11: { main: 0, north: 2, south: 3 },
  12: { main: 5, north: 0, south: 2 },
  13: { main: 2, north: 3, south: 0 },
};
