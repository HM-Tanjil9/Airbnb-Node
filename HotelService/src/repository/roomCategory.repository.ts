import RoomCategory from "../db/models/roomCategory";
import { NotFoundError } from "../utils/errors/app.error";
import BaseRepository from "./base.repository";

class RoomCategoryRepository extends BaseRepository<RoomCategory> {
  constructor() {
    super(RoomCategory);
  }
  async findAllByHotelId(hotelId: number) {
    const roomCategory = await this.model.findAll({
      where: {
        hotelId: hotelId,
        deletedAt: null,
      },
    });
    if (!roomCategory || roomCategory.length === 0) {
      throw new NotFoundError(
        `No room categories found for hotel with id ${hotelId} `,
      );
    }
    return roomCategory;
  }
}

export default RoomCategoryRepository;
