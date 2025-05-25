<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Screening;
use App\Models\TicketType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ApiResponse::success(Booking::with(['screening.movie', 'screening.room'])
            ->where('user_id', Auth::id())
            ->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'screening_id' => 'required|exists:screenings,id',
                'seats' => 'required|array|min:1',
                'seats.*.row' => 'required|integer|min:1',
                'seats.*.number' => 'required|integer|min:1',
                'ticket_types' => 'required|array',
                'ticket_types.*.type' => 'required|exists:ticket_types,name',
                'ticket_types.*.quantity' => 'required|integer|min:1'
            ]);

            $screening = Screening::with('room')->findOrFail($request->screening_id);
            $room = $screening->room;
            
            // Check if screening is in the future
            if ($screening->start_time->isPast()) {
                return ApiResponse::error(
                    'Cannot book tickets for past screenings',
                    422);
            }

            // Validate seat positions against room dimensions
            foreach ($request->seats as $seat) {
                if ($seat['row'] > $room->rows || $seat['number'] > $room->seats_per_row) {
                    return ApiResponse::error(
                        "Invalid seat position: row {$seat['row']}, number {$seat['number']}",
                        422);
                }
            }

            // Check if any of the requested seats are already taken
            $existingBookings = Booking::where('screening_id', $screening->id)
                ->where('status', '!=', 'cancelled')
                ->get();

            foreach ($request->seats as $requestedSeat) {
                foreach ($existingBookings as $booking) {
                    if (!$booking->seats) continue;
                    
                    $bookedSeats = is_string($booking->seats) ? json_decode($booking->seats, true) : $booking->seats;
                    if (!is_array($bookedSeats)) continue;
                    
                    foreach ($bookedSeats as $bookedSeat) {
                        if (!isset($bookedSeat['row']) || !isset($bookedSeat['number'])) continue;
                        
                        if ($bookedSeat['row'] == $requestedSeat['row'] && 
                            $bookedSeat['number'] == $requestedSeat['number']) {
                            return ApiResponse::error(
                                "Seat row {$requestedSeat['row']}, number {$requestedSeat['number']} is already taken",
                            422);
                        }
                    }
                }
            }

            // Calculate total price based on ticket types
            $totalPrice = 0;
            $ticketTypes = TicketType::all()->keyBy('name');
            
            foreach ($request->ticket_types as $ticketType) {
                $type = $ticketTypes[$ticketType['type']];
                $totalPrice += $screening->base_price * $type->price_multiplier * $ticketType['quantity'];
            }

            // Format seats data consistently
            $formattedSeats = array_map(function($seat) {
                return [
                    'row' => (int)$seat['row'],
                    'seat' => (int)$seat['number']
                ];
            }, $request->seats);

            $booking = Booking::create([
                'user_id' => Auth::id(),
                'screening_id' => $request->screening_id,
                'seats' => $formattedSeats,
                'ticket_types' => $request->ticket_types,
                'total_price' => $totalPrice,
                'status' => 'confirmed'
            ]);

            return ApiResponse::success($booking->load(['screening.movie', 'screening.room']));

        } catch (\Exception $e) {
            return ApiResponse::error(
                'Booking failed: ' . $e->getMessage(),
                500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        if (Auth::id() !== $booking->user_id) {
            return ApiResponse::error(
                'Unauthorized',
                403);
        }

        return ApiResponse::success($booking->load(['screening.movie', 'screening.room']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        if (Auth::id() !== $booking->user_id) {
            return ApiResponse::error(
                'Unauthorized',
                403);
        }

        if ($booking->screening->start_time->isPast()) {
            return ApiResponse::error(
                'Cannot modify bookings for past screenings',
                422);
        }

        $request->validate([
            'status' => 'required|in:confirmed,cancelled'
        ]);

        $booking->update([
            'status' => $request->status
        ]);

        return ApiResponse::success($booking->load(['screening.movie', 'screening.room']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        if (Auth::id() !== $booking->user_id) {
            return ApiResponse::error(
                'Unauthorized',
                403);
        }

        if ($booking->screening->start_time->isPast()) {
            return ApiResponse::error(
                'Cannot cancel bookings for past screenings',
                422);
        }

        $booking->delete();
        
        return ApiResponse::success(null, "OK", 204);
    }
}
