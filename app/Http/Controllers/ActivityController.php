<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Input;

class ActivityController extends Controller
{

    /**
     * Get all activities
     * @return \Illuminate\Http\JsonResponse
     */
    public function all()
    {
        $project = Input::get('project') ? : '';
        $raw_data = $this->sendRequest('GET', $project.'/activity');
        $events = $raw_data->event;

        $html = view('activity.all')->with('events', $events)->render();

        return response()->json([
            'raw_data' => $raw_data,
            'html' => $html
        ]);
    }
}
