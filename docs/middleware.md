# Middleware Notes

## Custom Request Logger

Created a custom logging middleware in `src/middleware/logger.ts`.

The middleware logs the following information for every incoming request:

- HTTP request method
- Request URL
- Timestamp

Example output:

```text
[2026-09-23T08:35:00.000Z] GET /bookings
```

After logging the request, the middleware calls `next()` to pass control to the next middleware or route handler. Without `next()`, the request would stop and the client would never receive a response.

## Header Authentication Middleware

Created a custom authentication middleware in `src/middleware/auth.ts`.

The middleware checks the `Authorization` header on incoming requests.

Valid token:

```text
super-secret-key
```

If the token is valid, the middleware calls:

```ts
next();
```

and allows the request to continue.

If the token is missing or incorrect, the middleware immediately returns:

```json
{
  "error": "Unauthorized"
}
```

with a `401 Unauthorized` status code.

This demonstrates how middleware can block requests before they reach application logic when authentication requirements are not satisfied.

## Body Schema Validation Middleware

Created a reusable validation middleware in `src/middleware/validate.ts`.

The middleware uses a higher-order function that accepts an array of required field names.

Example:

```ts
validate([
  'id',
  'desk',
  'floor',
  'date',
  'active'
]);
```

The middleware checks whether all required fields exist in `req.body`.

If fields are missing, it returns:

```json
{
  "error": "Missing required fields",
  "missingFields": [
    "desk",
    "floor"
  ]
}
```

with a `400 Bad Request` status code.

If validation passes, the middleware calls:

```ts
next();
```

to continue processing the request.

This approach allows validation logic to be reused across multiple routes without duplication.

## Global Error Handling

Created a global error-handling middleware in `src/middleware/errorHandler.ts`.

The middleware uses Express's required four-parameter signature:

```ts
(err, req, res, next)
```

Responsibilities:

- Catch unhandled exceptions
- Log stack traces to the console
- Return a consistent error response
- Prevent internal implementation details from being exposed to clients

Example response:

```json
{
  "error": "Internal Server Error"
}
```

with a `500 Internal Server Error` status code.

The error handler is registered after all routes and middleware so that Express can forward uncaught errors to it automatically.

## Middleware Flow Verification

Reviewed all middleware to ensure every execution path either:

- Calls `next()` to continue request processing, or
- Returns a response using `res.status(...).json(...)`

Example:

```ts
if (token === 'super-secret-key') {
  next();
  return;
}

res.status(401).json({
  error: 'Unauthorized'
});
```

This prevents requests from hanging indefinitely due to middleware failing to pass control or return a response.

## Error Handler Verification

Verified that the global error handler contains all four required parameters:

```ts
(err, req, res, next)
```

Express only recognises middleware as an error handler when all four parameters are present.

This ensures unhandled exceptions are correctly routed to the global error handler and returned as clean, consistent API responses.

## Type Safety Improvements
 
Reviewed all middleware and removed the use of `any` where possible.
 
Each middleware now imports and uses the correct Express types:
 
```ts
import {
Request,
Response,
NextFunction
} from 'express';

