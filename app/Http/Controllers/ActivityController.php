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
        $raw_data = $this->sendRequest('GET', '/activity');
        $html = view('activity.all')->with('events', $raw_data->event)->render();
        return response()->json([
            'raw_data' => $raw_data,
            'html' => $html
        ]);
    }
}
