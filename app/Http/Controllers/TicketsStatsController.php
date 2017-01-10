<?php
/**
 * Created by PhpStorm.
 * User: vladimir.vuckovic
 * Date: 1/9/2017
 * Time: 2:33 PM
 */

namespace App\Http\Controllers;


use Carbon\Carbon;

class TicketsStatsController extends Controller
{
    public $hours = 24;
    public $statistics = array();
    private $file = 'stats_day_data.txt';
    public $tickets_no = null;

    public function statistics($project){
        $today = Carbon::today('Europe/London');
        $now = Carbon::now('Europe/London');
        $diff = $now->diffInHours($today);
        $query = array('query' => 'sort:created_at order:desc');
        $raw_data = $this->sendRequest('GET', "{$project}/tickets", $query);
        $this->tickets_no = count($raw_data);
        $this->generateStats($diff, $now->toDateTimeString());
        $this->createFile();
        $this->writeToFile();

        $html = view('activity.tickets_stats')->with(['statistics' => json_encode(array_values($this->statistics))])->render();

        return response()->json([
            'raw_data' => $raw_data,
            'html' => $html
        ]);
    }

    public function generateStats($hour, $now){
            $this->statistics[$hour] = array('time' => $now, 'tickets' => $this->tickets_no);
    }


    public  function createFile()
    {
        touch($this->file);
        chmod($this->file, 0640);
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

    public function writeToFile(){
        $file = file_get_contents($this->file);
        if($file !== false){
            if(filesize($this->file) == 0){
                $day_array = $this->generateDayFile();
                file_put_contents($this->file, json_encode($day_array));
                $file = file_get_contents($this->file);
            }
            $stats_arr = json_decode($file, true);
            $this->statistics = array_replace($stats_arr, $this->statistics);
            file_put_contents($this->file, json_encode($this->statistics));
        }
        return true;
    }
}