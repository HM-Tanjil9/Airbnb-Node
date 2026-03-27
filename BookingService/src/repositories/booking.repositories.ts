import { prisma as prismaClient } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

export async function createBooking(bookingInput: Prisma.BookingCreateInput) {
  const booking = await prismaClient.booking.create({
    data: bookingInput,
  });

  return booking;
}
