<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScreeningResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $unavailableSeats = [];
        
        foreach ($this->bookings as $booking) {
            if ($booking->status !== 'cancelled' && $booking->seats) {
                $seats = is_string($booking->seats) ? json_decode($booking->seats, true) : $booking->seats;
                if (is_array($seats)) {
                    foreach ($seats as $seat) {
                        $unavailableSeats[] = [
                            'row' => $seat['row'],
                            'seat' => $seat['number'] ?? $seat['seat'] ?? null
                        ];
                    }
                }
            }
        }

        return [
            'id' => $this->id,
            'room' => [
                'rows' => $this->room->rows,
                'seatsPerRow' => $this->room->seats_per_row
            ],
            'start_time' => $this->start_time->format('H:i'),
            'bookings' => $unavailableSeats
        ];
    }
} 