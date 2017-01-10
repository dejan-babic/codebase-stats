<?php

namespace App\Http\Controllers;

use Carbon\Carbon;

class ActivityController extends Controller
{

    /**
     * Get all activities
     * @return \Illuminate\Http\JsonResponse
     */
    public function all()
    {
        $today = Carbon::today('Europe/London')->toIso8601String();
        $query = array('raw' => true, 'since' => $today);
        $raw_data = $this->sendRequest('GET', '/activity');
        $html = view('activity.all')->with('events', $raw_data->event)->render();
        return response()->json([
            'raw_data' => $raw_data,
            'html' => $html
        ]);
    }
}
