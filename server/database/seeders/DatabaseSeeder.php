<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Movie;
use App\Models\Room;
use App\Models\Screening;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => "admin",
            'role' => 'admin',
        ]);

        // Create rooms
        $rooms = [
            [
                'name' => 'Grand Hall',
                'rows' => 10,
                'seats_per_row' => 10,
            ],
            [
                'name' => 'Small Theater',
                'rows' => 7,
                'seats_per_row' => 8,
            ],
        ];

        foreach ($rooms as $room) {
            Room::create($room);
        }

        // Sample movies
        $movies = [
            [
                'title' => 'Dune: Part Two',
                'description' => 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
                'duration' => 166,
                'genre' => 'Sci-Fi',
                'release_year' => 2024,
                'image_path' => 'https://api-tikera.codence.hu/public/storage/movies/dune.jpg'
            ],
            [
                'title' => 'Poor Things',
                'description' => 'The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.',
                'duration' => 141,
                'genre' => 'Drama',
                'release_year' => 2024,
                'image_path' => 'https://api-tikera.codence.hu/public/storage/movies/poor-things.jpg'
            ],
            [
                'title' => 'Oppenheimer',
                'description' => 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
                'duration' => 180,
                'genre' => 'Drama',
                'release_year' => 2023,
                'image_path' => 'https://api-tikera.codence.hu/public/storage/movies/oppenheimer.jpg'
            ],
            [
                'title' => 'Godzilla x Kong: The New Empire',
                'description' => 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island\'s mysteries.',
                'duration' => 115,
                'genre' => 'Action',
                'release_year' => 2024,
                'image_path' => 'https://api-tikera.codence.hu/public/storage/movies/godzilla-kong.jpg'
            ],
            [
                'title' => 'Civil War',
                'description' => 'In a near-future America, a civil war is unfolding as journalists try to navigate the dangerous landscape.',
                'duration' => 109,
                'genre' => 'Action',
                'release_year' => 2024,
                'image_path' => 'https://api-tikera.codence.hu/public/storage/movies/civil-war.jpg'
            ],
            [
                'title' => 'Ghostbusters: Frozen Empire',
                'description' => 'When the discovery of an ancient artifact unleashes an evil force, Ghostbusters new and old must join forces to protect their home and save the world from a second Ice Age.',
                'duration' => 115,
                'genre' => 'Comedy',
                'release_year' => 2024,
                'image_path' => 'https://api-tikera.codence.hu/public/storage/movies/ghostbusters.jpg'
            ],
            [
                'title' => 'Inside Out 2',
                'description' => 'Follow Riley in her teenage years as new emotions join Joy, Sadness, Anger, Fear, and Disgust in headquarters.',
                'duration' => 100,
                'genre' => 'Animation',
                'release_year' => 2024,
                'image_path' => 'https://api-tikera.codence.hu/public/storage/movies/inside-out-2.jpg'
            ],
            [
                'title' => 'Kung Fu Panda 4',
                'description' => 'Po must train a new warrior when he\'s chosen to become the spiritual leader of the Valley of Peace.',
                'duration' => 94,
                'genre' => 'Animation',
                'release_year' => 2024,
                'image_path' => 'https://api-tikera.codence.hu/public/storage/movies/kung-fu-panda-4.jpg'
            ],
        ];

        $movies = array_map(function($movieData) {
            return Movie::create($movieData);
        }, $movies);
        echo "Movies seeded: " . count($movies) . "\n";

        // Create screenings for the next 2 months
        $startDate = Carbon::now();
        $endDate = Carbon::now()->addMonths(2);
        
        while ($startDate->lte($endDate)) {
            // For each movie, create 2-4 screenings per day
            foreach ($movies as $movie) {
                // 2-4 screenings per day for this movie
                $screeningsPerDay = rand(2, 4);
                
                // Morning, afternoon, and evening screenings
                $timeSlots = [
                    ['start' => 10, 'end' => 13], // Morning
                    ['start' => 14, 'end' => 17], // Afternoon
                    ['start' => 18, 'end' => 22], // Evening
                ];
                
                // Randomly select time slots for this movie's screenings
                // Ensure we don't try to select more slots than available
                $numSlots = min($screeningsPerDay, count($timeSlots));
                $selectedSlots = array_rand($timeSlots, $numSlots);
                if (!is_array($selectedSlots)) {
                    $selectedSlots = [$selectedSlots];
                }
                
                foreach ($selectedSlots as $slotIndex) {
                    $slot = $timeSlots[$slotIndex];
                    $room = Room::find(rand(1, 2));
                    $hour = rand($slot['start'], $slot['end']);
                    
                    $start_time = $startDate->copy()->setHour($hour)->setMinute(0);
                    $screening = Screening::create([
                        'movie_id' => $movie->id,
                        'room_id' => $room->id,
                        'start_time' => $start_time,
                        'date' => $start_time->toDateString(),
                        'week_number' => $start_time->isoWeek(),
                        'week_day' => $start_time->isoWeekday()
                    ]);

                    // Add random bookings for this screening
                    $numBookings = rand(3, 10);
                    for ($j = 0; $j < $numBookings; $j++) {
                        $row = rand(1, $room->rows);
                        $seat = rand(1, $room->seats_per_row);
                        
                        \App\Models\Booking::create([
                            'user_id' => 1, // Using the admin user
                            'screening_id' => $screening->id,
                            'total_price' => rand(1500, 2500),
                            'status' => 'confirmed',
                            'seats' => [['row' => $row, 'seat' => $seat]],
                            'ticket_types' => [['type' => 'adult', 'count' => 1]]
                        ]);
                    }
                }
            }
            
            $startDate->addDay();
        }
    }
}
