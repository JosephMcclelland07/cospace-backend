# Desk Booking System — User Stories

Product Owner: [Name]
Epic: Desk Booking System

---

## 1. Book a Desk

**As a** employee,
**I want** to book a desk for a specific day,
**so that** I have a guaranteed workspace when I come into the office.

### Acceptance Criteria
- Given I am logged in, when I select an available desk and a valid future date, then the desk is reserved under my name for that date.
- Given a desk is already booked for the selected date, when I try to book it, then I see an error message and the booking is rejected.
- Given I have successfully booked a desk, when the booking is confirmed, then I receive a confirmation message/notification showing the desk number and date.
- Given I try to book a desk for a past date, when I submit the booking, then the system prevents it and shows a validation error.
- A user cannot hold more than one active booking per day (configurable limit).

---

## 2. Cancel a Booking

**As a** employee,
**I want** to cancel a desk booking I've made,
**so that** the desk becomes available for others if I no longer need it.

### Acceptance Criteria
- Given I have an existing booking, when I select "Cancel" on that booking, then the booking is removed and the desk status changes to available for that date.
- Given I cancel a booking, when the cancellation is processed, then I receive a confirmation that the booking was cancelled.
- Given a booking's date has already passed, when I view my bookings, then the cancel option is not available for that past booking.
- Given I try to cancel a booking that isn't mine, when the request is made, then it is rejected with an authorization error.

---

## 3. View Desk Availability for a Given Day

**As a** employee,
**I want** to see which desks are free on a given day,
**so that** I can choose an available desk before booking.

### Acceptance Criteria
- Given I select a specific date, when the availability view loads, then all desks are shown with a clear status of "Available" or "Booked" for that date.
- Given a desk is booked for the selected date, when I view it, then I cannot select it for booking (it is visibly disabled/greyed out).
- Given no date is selected, when I open the availability view, then it defaults to showing today's availability.
- Given desk data changes (e.g., a new booking or cancellation), when I refresh or revisit the view, then availability reflects the latest state.

---

## 4. View My Bookings

**As a** employee,
**I want** to see a list of all my current and upcoming desk bookings,
**so that** I can keep track of where and when I'm booked in.

### Acceptance Criteria
- Given I am logged in, when I navigate to "My Bookings", then I see a list of all my active/future bookings with desk number and date.
- Given I have no bookings, when I view "My Bookings", then I see a clear empty state message (e.g., "You have no upcoming bookings").
- Given a booking's date has passed, when I view "My Bookings", then it is either removed or shown separately under booking history.
- Each listed booking provides quick access to cancel it (linking to Story 2).

---

## 5. Receive a Reminder Notification for an Upcoming Booking

**As a** employee,
**I want** to receive a reminder notification before my booked day,
**so that** I don't forget I have a desk reserved and can cancel it if my plans change.

### Acceptance Criteria
- Given I have a booking for the next day, when the reminder schedule triggers (e.g., evening before, or morning of), then I receive a notification with the desk number and date.
- Given I cancel my booking before the reminder is sent, when the reminder job runs, then no notification is sent for that booking.
- Given notifications are disabled in my settings, when a reminder would normally be sent, then it is suppressed.
- The notification includes a direct link/action to view or cancel the booking.
