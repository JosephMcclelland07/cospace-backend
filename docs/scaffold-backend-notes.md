# Layered Architecture Refactor Notes

## Overview

The CoSpace backend was refactored from a single route file into a four-layer architecture consisting of Routes, Controllers, Services, and Repositories. This separation of concerns improves maintainability, scalability, readability, and testing.

## Directory Structure

```text
src/
├── controllers/
│   └── booking.controller.ts
├── repositories/
│   └── booking.repository.ts
├── routes/
│   └── booking.routes.ts
├── services/
│   └── booking.service.ts
└── index.ts

Layer Responsibilities
Routes

The Routes layer acts as a routing table, mapping HTTP endpoints to controller methods. It contains no business or data logic.

Controllers

The Controller layer handles Express request and response objects. It receives incoming requests, extracts parameters and request bodies, calls the Service layer, and returns appropriate HTTP responses.

Services

The Service layer contains business logic and validation rules. For example, a booking cannot be created if the desk name is fewer than three characters.

Repositories

The Repository layer manages access to booking data. It stores and retrieves information from the in-memory bookings array and has no knowledge of HTTP or Express.

Request Flow

A request travels through the application in the following order:

Plain Text
Client
↓
Routes
↓
Controller
↓
Service
↓
Repository
Show more lines

Each layer communicates only with the layer directly beneath it, reducing coupling and improving maintainability.

Validation Example

The Service layer enforces business rules before data reaches the Repository layer.

Example:

TypeScript
if (booking.desk.length < 3) {
throw new Error('Desk name must be at least 3 characters long');
}
Show more lines

When an invalid booking is submitted, the Service throws an error which is caught by the Controller and returned as a 400 Bad Request response.

Architectural Improvements
Separated responsibilities into four dedicated layers.
Removed all Express dependencies from the Service layer.
Kept HTTP status codes and response handling inside Controllers.
Prevented Repositories from containing HTTP-specific logic.
Added Controller-to-Route context binding to avoid loss of this.
Improved maintainability, readability, and scalability.
Made future database integration easier by isolating data access within the Repository layer.