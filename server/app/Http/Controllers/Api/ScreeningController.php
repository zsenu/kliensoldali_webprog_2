<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ScreeningResource;
use App\Models\Screening;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ScreeningController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $screenings = Screening::with(['movie', 'room', 'bookings'])->get();
        return ApiResponse::success(ScreeningResource::collection($screenings));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'movie_id' => 'required|exists:movies,id',
                'room_id' => 'exists:rooms,id',
                'date' => 'required|date',
                'start_time' => ['required', 'regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/']
            ]);

            // Calculate week_number and week_day from date
            $data = $request->all();
            $carbonDate = Carbon::parse($data['date']);
            $data['week_number'] = $carbonDate->weekOfYear;
            $data['week_day'] = $carbonDate->isoWeekday();

            // Set default room_id if not provided
            if (!isset($data['room_id'])) {
                $data['room_id'] = 1; // Default to Grand Hall
            }

            // Check for time conflicts in the same room (logic may need to be adapted for string time)
            $conflictingScreenings = Screening::where('room_id', $data['room_id'])
                ->where('start_time', $request->start_time)
                ->exists();

            if ($conflictingScreenings) {
                return ApiResponse::error(
                    'There is already a screening scheduled in this room at this time',
                    422);
            }

            $screening = Screening::create($data);
            return ApiResponse::success(new ScreeningResource($screening->load(['movie', 'room'])), 'OK', 201);
        } catch (ValidationException $e) {
            return ApiResponse::error(
                'Screening addition failed due to validation errors',
                422,
                $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Failed to add screening. Please try again later.',
                500,
                $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Screening $screening)
    {
        $screening->load(['movie', 'room', 'bookings']);
        return ApiResponse::success(new ScreeningResource($screening));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Screening $screening)
    {
        $request->validate([
            'movie_id' => 'exists:movies,id',
            'room_id' => 'exists:rooms,id',
            'date' => 'date',
            'start_time' => ['regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/']
        ]);

        $data = $request->all();
        if (isset($data['date'])) {
            $carbonDate = Carbon::parse($data['date']);
            $data['week_number'] = $carbonDate->weekOfYear;
            $data['week_day'] = $carbonDate->format('l');
        }

        if ($request->has('start_time') || $request->has('room_id')) {
            $conflictingScreenings = Screening::where('room_id', $request->room_id ?? $screening->room_id)
                ->where('id', '!=', $screening->id)
                ->where('start_time', $request->start_time ?? $screening->start_time)
                ->exists();

            if ($conflictingScreenings) {
                return ApiResponse::error(
                    'There is already a screening scheduled in this room at this time',
                    422);
            }
        }

        $screening->update($data);
        return ApiResponse::success(new ScreeningResource($screening->load(['movie', 'room'])));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Screening $screening)
    {
        $screening->delete();
        return ApiResponse::success(null, 'OK', 204);
    }
}
