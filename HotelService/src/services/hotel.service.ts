import { createHotelDto } from "../dto/hotel.dto";
import { HotelRepository } from "../repository/hotel.repository";

const hotelRepository = new HotelRepository();

const blockListedAddress = ["123 Fake St", "456 Fake St", "789 Fake St"];

const isBlockListedAddress = (address: string) => {
  return blockListedAddress.includes(address);
};

export async function createHotelService(hotelData: createHotelDto) {
  if (isBlockListedAddress(hotelData.address)) {
    throw new Error("Address is blacklisted");
  }
  const hotel = await hotelRepository.create(hotelData);
  return hotel;
}

export async function getHotelByIdService(id: number) {
  const hotel = await hotelRepository.findById(id);
  return hotel;
}

export async function getAllHotelsService() {
  const hotels = await hotelRepository.findAll();
  return hotels;
}

export async function deleteHotelService(id: number) {
  const hotel = await hotelRepository.softDelete(id);
  return hotel;
}
