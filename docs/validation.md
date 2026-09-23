## Booking Schema

Created a Zod schema named `createBookingSchema` in `src/schemas/booking.schema.ts`.

Validation rules:

- `desk` must be a trimmed string between 3 and 100 characters.
- `floor` must be a trimmed string between 5 and 200 characters.
- `date` must be a valid ISO 8601 date string.
- `active` is an optional boolean that defaults to `true`.

The schema provides a single source of truth for validating incoming booking data before it reaches the service and repository layers.