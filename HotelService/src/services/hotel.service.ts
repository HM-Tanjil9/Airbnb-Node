import { createHotelDto } from "../dto/hotel.dto";
import { createHotel, getHotelById } from "../repository/hotel.repository";

const blockListedAddress = ["123 Fake St", "456 Fake St", "789 Fake St"];

const isBlockListedAddress = (address: string) => {
  return blockListedAddress.includes(address);
};

export async function createHotelService(hotelData: createHotelDto) {
  if (isBlockListedAddress(hotelData.address)) {
    throw new Error("Address is blacklisted");
  }
  const hotel = await createHotel(hotelData);
  return hotel;
}

export async function getHotelByIdService(id: number) {
  const hotel = await getHotelById(id);
  return hotel;
}
