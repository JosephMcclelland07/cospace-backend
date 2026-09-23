# Pagination Documentation

## Page 1, Limit 3

Request:

```http
GET /bookings?page=1&limit=3
```

Response:

```json
{
  "data": [
    {
      "id": 1,
      "desk": "A1",
      "floor": "1",
      "date": "2026-09-22",
      "active": true
    },
    {
      "id": 2,
      "desk": "B3",
      "floor": "2",
      "date": "2026-09-23",
      "active": false
    },
    {
      "id": 3,
      "desk": "C5",
      "floor": "3",
      "date": "2026-09-24",
      "active": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 3,
    "total": 5,
    "totalPages": 2
  }
}
```

## Page 2, Limit 3

Request:

```http
GET /bookings?page=2&limit=3
```

Response:

```json
{
  "data": [
    {
      "id": 4,
      "desk": "D1",
      "floor": "1",
      "date": "2026-09-25",
      "active": true
    },
    {
      "id": 5,
      "desk": "E2",
      "floor": "2",
      "date": "2026-09-26",
      "active": false
    }
  ],
  "meta": {
    "page": 2,
    "limit": 3,
    "total": 5,
    "totalPages": 2
  }
}
```

No records are repeated between page 1 and page 2 because the repository uses:

```ts
slice(skip, skip + limit)
```

where:

```ts
skip = (page - 1) * limit
```

## Invalid Page Value

Request:

```http
GET /bookings?page=abc
```

Result:

```json
{
  "meta": {
    "page": 1
  }
}
```

The controller uses `parseInt()` and falls back to:

```ts
const safePage = 1;
```

when parsing fails.

## Excessive Limit Value

Request:

```http
GET /bookings?limit=999999
```

Result:

```json
{
  "meta": {
    "limit": 50
  }
}
```

The controller clamps the value using:

```ts
Math.min(limit, 50)
```

to prevent excessively large requests.

## Total Pages Formula

Formula:

```ts
Math.ceil(total / limit)
```

Example:

```ts
total = 21;
limit = 10;
```

Calculation:

```ts
Math.ceil(21 / 10)
Math.ceil(2.1)
= 3
```

Rounding up is required because a partially filled page still counts as a page. Without `Math.ceil()`, the API would return a decimal value such as `2.1` pages, which is not valid for pagination.