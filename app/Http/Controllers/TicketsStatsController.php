<?php
/**
 * Created by PhpStorm.
 * User: vladimir.vuckovic
 * Date: 1/9/2017
 * Time: 2:33 PM
 */

namespace App\Http\Controllers;


use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class TicketsStatsController extends Controller
{
    public $hours = 24;
    public $statistics = array();
    public $store_key = 'ticket_chart_values';
    public $tickets_no = null;

    public function statistics($project){
        $today = Carbon::today('Europe/London');
        $now = Carbon::now('Europe/London');
        $diff = $now->diffInHours($today);

        $query = array('query' => 'sort:created_at order:desc');
        $raw_data = $this->sendRequest('GET', "{$project}/tickets", $query);

        $this->tickets_no = count($raw_data);
        $this->generateStats($diff, $now);
        $this->storeChartValues();

        $html = view('activity.tickets_stats')->with(['statistics' => json_encode(array_values($this->statistics))])->render();

        return response()->json([
            'raw_data' => $raw_data,
            'html' => $html
        ]);
    }

    public function generateStats($hour, $now){
            $now->minute = 0;
            $now->second = 0;
            $this->statistics[$hour] = array('time' => $now->toDateTimeString(), 'tickets' => $this->tickets_no);
    }

    public function generateDayFile(){
        $now = Carbon::today('Europe/London');
        $hours_of_day = array();
        for($i=0 ; $i<($this->hours); $i++){
            $hour_plus = ($i===0) ? $now->toDateTimeString() : $now->addHour()->toDateTimeString();
            $hours_of_day[$i] = array("time" => $hour_plus, "tickets" => 0);
        }
        return $hours_of_day;
    }


    public function storeChartValues(){
        if(!Cache::has($this->store_key)) {
            $day_array = $this->generateDayFile();
            Cache::forever($this->store_key, json_encode($day_array));
        }
        $stats_arr = json_decode(Cache::get($this->store_key), true);
        $this->statistics = array_replace($stats_arr, $this->statistics);
        Cache::forever($this->store_key, json_encode($this->statistics));
        return true;
    }
}