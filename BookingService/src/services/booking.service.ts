import { CreateBookingDTO } from "../dto/booking.dto";
import {
  confirmBooking,
  createBooking,
  createIdempotencyKey,
  finalizedIdempotencyKey,
  getIdempotencyKey,
} from "../repositories/booking.repositories";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { generateIdempotencyKey } from "../utils/helpers/generateIdempotencyKey";
export async function createBookingService(createBookingDTO: CreateBookingDTO) {
  const booking = await createBooking({
    userId: createBookingDTO.userId,
    hotelId: createBookingDTO.hotelId,
    totalGuests: createBookingDTO.totalGuests,
    bookingAmount: createBookingDTO.bookingAmount,
  });
  const idempotencyKey = generateIdempotencyKey();
  await createIdempotencyKey(idempotencyKey, booking.id);
  return {
    bookingId: booking.id,
    idempotencyKey,
  };
}

export async function confirmBookingService(idempotencyKey: string) {
  const idempotencyKeyData = await getIdempotencyKey(idempotencyKey);
  if (!idempotencyKeyData) {
    throw new NotFoundError("Idempotency key not found");
  }
  if (idempotencyKeyData.finalized) {
    throw new BadRequestError("Idempotency key already finalized");
  }
  // payment steps
  const booking = await confirmBooking(idempotencyKeyData.bookingId);
  await finalizedIdempotencyKey(idempotencyKey);
  return booking;
}
