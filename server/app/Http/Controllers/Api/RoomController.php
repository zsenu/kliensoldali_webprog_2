<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rooms = Room::with('screenings')->get();
        return ApiResponse::success($rooms);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'has_3d' => 'required|boolean'
        ]);

        $room = Room::create($request->all());
        return ApiResponse::success($room, 'OK', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Room $room)
    {
        return ApiResponse::success($room->load('screenings'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Room $room)
    {
        $request->validate([
            'name' => 'string|max:255',
            'capacity' => 'integer|min:1',
            'has_3d' => 'boolean'
        ]);

        $room->update($request->all());
        return ApiResponse::success($room);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room)
    {
        $room->delete();
        return ApiResponse::success(null, 'OK', 204);
    }
}
