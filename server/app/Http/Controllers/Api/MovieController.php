<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\MovieResource;
use App\Models\Movie;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MovieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Movie::with(['screenings.room', 'screenings.bookings']);

        if ($request->has('week_number')) {
            $query->whereHas('screenings', function ($query) use ($request) {
                $query->where('week_number', $request->week_number);
            })->with(['screenings' => function ($query) use ($request) {
                $query->where('week_number', $request->week_number)
                      ->with(['room', 'bookings']);
            }]);
        }

        $movies = $query->get();

        return ApiResponse::success($movies->map(function ($movie) {
            return [
                'id' => $movie->id,
                'title' => $movie->title,
                'description' => $movie->description,
                'image_path' => $movie->image_path,
                'duration' => $movie->duration,
                'genre' => $movie->genre,
                'release_year' => $movie->release_year,
                'screenings' => $movie->screenings->map(function ($screening) {
                    $unavailableSeats = [];
                    foreach ($screening->bookings as $booking) {
                        if ($booking->status !== 'cancelled' && $booking->seats) {
                            $seats = is_string($booking->seats) ? json_decode($booking->seats, true) : $booking->seats;
                            foreach ($seats as $seat) {
                                $unavailableSeats[] = [
                                    'row' => $seat['row'],
                                    'seat' => $seat['seat']
                                ];
                            }
                        }
                    }
                    
                    return [
                        'id' => $screening->id,
                        'room' => [
                            'rows' => $screening->room->rows,
                            'seatsPerRow' => $screening->room->seats_per_row
                        ],
                        'start_time' => $screening->start_time->format('H:i'),
                        'date' => $screening->date,
                        'week_number' => $screening->week_number,
                        'week_day' => $screening->week_day,
                        'bookings' => $unavailableSeats
                    ];
                })
            ];
        }));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'image_path' => 'required|string|url',
                'duration' => 'required|integer|min:1',
                'genre' => 'required|string|max:255',
                'release_year' => 'required|integer|min:1900|max:' . (date('Y') + 1)
            ]);

            $movie = Movie::create([
                'title' => $request->title,
                'description' => $request->description,
                'image_path' => $request->image_path,
                'duration' => $request->duration,
                'genre' => $request->genre,
                'release_year' => $request->release_year
            ]);

            return ApiResponse::success(
                new MovieResource($movie),
                'Movie added successfully!',
            201);
        } catch (ValidationException $e) {
            return ApiResponse::error(
            'Movie addition failed due to validation errors: ',
            422,
            $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Failed to add movie. Please try again later.',
                500,
                $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Movie $movie)
    {
        $movie->load(['screenings.room', 'screenings.bookings']);
        return ApiResponse::success([
            'id' => $movie->id,
            'title' => $movie->title,
            'description' => $movie->description,
            'image_path' => $movie->image_path,
            'duration' => $movie->duration,
            'genre' => $movie->genre,
            'release_year' => $movie->release_year,
            'screenings' => $movie->screenings->map(function ($screening) {
                $unavailableSeats = [];
                foreach ($screening->bookings as $booking) {
                    if ($booking->status !== 'cancelled' && $booking->seats) {
                        $seats = is_string($booking->seats) ? json_decode($booking->seats, true) : $booking->seats;
                        foreach ($seats as $seat) {
                            $unavailableSeats[] = [
                                'row' => $seat['row'],
                                'seat' => $seat['seat']
                            ];
                        }
                    }
                }
                
                return [
                    'id' => $screening->id,
                    'room' => [
                        'rows' => $screening->room->rows,
                        'seatsPerRow' => $screening->room->seats_per_row
                    ],
                    'start_time' => $screening->start_time->format('H:i'),
                    'date' => $screening->date,
                    'week_number' => $screening->week_number,
                    'week_day' => $screening->week_day,
                    'bookings' => $unavailableSeats
                ];
            })
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Movie $movie)
    {
        $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'image_path' => 'string|url',
            'duration' => 'integer|min:1',
            'genre' => 'string|max:255',
            'release_year' => 'integer|min:1900|max:' . (date('Y') + 1)
        ]);

        $movie->update($request->all());
        return ApiResponse::success(new MovieResource($movie));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Movie $movie)
    {
        $movie->delete();
        return ApiResponse::success(null, "OK", 204);
    }

    /**
     * Get movies by week number.
     */
    public function byWeek(Request $request)
    {
        $weekNumber = $request->query('week_number');
        
        if (!$weekNumber) {
            return ApiResponse::error(
                'Week number is required',
                400
            );
        }

        $movies = Movie::with(['screenings' => function ($query) use ($weekNumber) {
            $query->where('week_number', $weekNumber)
                  ->with(['room', 'bookings']);
        }])->get();

        return ApiResponse::success($movies->map(function ($movie) {
            return [
                'id' => $movie->id,
                'title' => $movie->title,
                'description' => $movie->description,
                'image_path' => $movie->image_path,
                'duration' => $movie->duration,
                'genre' => $movie->genre,
                'release_year' => $movie->release_year,
                'screenings' => $movie->screenings->map(function ($screening) {
                    $unavailableSeats = [];
                    foreach ($screening->bookings as $booking) {
                        if ($booking->status !== 'cancelled' && $booking->seats) {
                            $seats = is_string($booking->seats) ? json_decode($booking->seats, true) : $booking->seats;
                            foreach ($seats as $seat) {
                                $unavailableSeats[] = [
                                    'row' => $seat['row'],
                                    'seat' => $seat['seat']
                                ];
                            }
                        }
                    }
                    
                    return [
                        'id' => $screening->id,
                        'room' => [
                            'rows' => $screening->room->rows,
                            'seatsPerRow' => $screening->room->seats_per_row
                        ],
                        'start_time' => $screening->start_time->format('H:i'),
                        'date' => $screening->date,
                        'week_number' => $screening->week_number,
                        'week_day' => $screening->week_day,
                        'bookings' => $unavailableSeats
                    ];
                })
            ];
        }));
    }
}
