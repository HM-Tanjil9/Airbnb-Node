import { createRoomCategoryDto } from "../dto/roomCategory.dto";
import { HotelRepository } from "../repository/hotel.repository";
import RoomCategoryRepository from "../repository/roomCategory.repository";
import { NotFoundError } from "../utils/errors/app.error";

const roomCategoryRepository = new RoomCategoryRepository();
const hotelRepository = new HotelRepository();

export async function createRoomCategoryService(
  roomCategoryData: createRoomCategoryDto,
) {
  const roomCategory = await roomCategoryRepository.create(roomCategoryData);
  return roomCategory;
}

export async function getRoomCategoryByIdService(id: number) {
  const roomCategory = await roomCategoryRepository.findById(id);
  return roomCategory;
}

export async function getAllRoomCategoriesByHotelIdService(hotelId: number) {
  // Checking hotel categories exist or not
  const hotel = await hotelRepository.findById(hotelId);
  if (!hotel) {
    throw new NotFoundError(`Hotel with id ${hotelId} not found`);
  }
  // Find all room categories by hotel id
  const roomCategories = await roomCategoryRepository.findAllByHotelId(hotelId);
  return roomCategories;
}

export async function deleteRoomCategoryService(id: number) {
  const roomCategory = await roomCategoryRepository.findById(id);
  if (!roomCategory) {
    throw new NotFoundError(`Room category with id ${id} not found`);
  }
  await roomCategoryRepository.deleteById({ id });
  return true;
}
