export const ROOMS = [
  {
    name: "Standard Room",
    price: 100,
    inventory: 5,
    image: "/images/pexels-didsss.jpg",
    description:
      "A cozy and affordable room perfect for solo travelers or short stays.",
  },
  {
    name: "Deluxe Room",
    price: 180,
    inventory: 3,
    image: "/images/polinaunsplash.jpg",
    description:
      "A spacious room designed for comfort and relaxation. Ideal for couples and business travelers seeking a premium stay.",
  },
  {
    name: "Ocean Suite",
    price: 250,
    inventory: 2,
    image: "/images/pexels-andreaedavis-30018003.jpg",
    description:
      "Experience luxury with breathtaking ocean views, elegant interiors, and premium amenities crafted for unforgettable stays.",
  },
];

export function findRoomByPrice(price) {
  return ROOMS.find((room) => room.price === Number(price));
}
