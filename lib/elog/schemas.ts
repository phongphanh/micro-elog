import { z } from "zod/v4"

export const bookingSchema = z.object({
  customer: z.string().min(2, "Customer is required"),
  bookingType: z.string().min(1, "Booking type is required"),
  shipmentType: z.string().min(1, "Shipment type is required"),
  originPort: z.string().min(2, "Origin port is required"),
  destinationPort: z.string().min(2, "Destination port is required"),
  pickupLocation: z.string().min(2, "Pickup location is required"),
  deliveryLocation: z.string().min(2, "Delivery location is required"),
  expectedDepartureDate: z.string().min(1, "Expected departure date is required"),
  expectedArrivalDate: z.string().min(1, "Expected arrival date is required"),
  cargoDescription: z.string().min(8, "Describe the cargo in more detail"),
  cargoWeight: z.coerce.number().positive("Cargo weight must be greater than 0"),
  cargoVolume: z.coerce.number().positive("Cargo volume must be greater than 0"),
  containerType: z.string().min(1, "Container type is required"),
  numberOfContainers: z.coerce.number().int().positive("At least one container is required"),
  specialInstructions: z.string().optional(),
})

export type BookingFormValues = z.infer<typeof bookingSchema>
