# Movie Ticket Booking App (Advanced Version)

This project is an enhanced version of my previous movie ticket booking component.  
It features full backend integration through APIs, user authentication, and admin management.

## Features

- Fetches movies and showtimes from a backend API.
- User registration and login with protected routes — only logged-in users can make bookings.
- Users can view their bookings.
- Admin users can add new movies and showtimes via the admin panel.
- All interactions with data are performed through API calls.

## Live Demo

Try the live app here:  
[https://kliensoldali-bead2.vercel.app](https://kliensoldali-bead2.vercel.app)

## Running Locally

### Backend (Simulated API)

Before starting the frontend, you need to run the backend API server:

1. Run `composer install`  
2. Run `php artisan migrate`  
3. Run `php artisan db:seed`  
4. Run `php artisan key:generate`  
5. Run `php artisan serve`

### Frontend

Then, in a separate terminal, navigate to the frontend folder and run:

1. Run `npm install`  
2. Run `npm run dev`

## Admin Credentials

Use the following credentials to log in as an administrator:

- Email: `admin@example.com`  
- Password: `admin`
