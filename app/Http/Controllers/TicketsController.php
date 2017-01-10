<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Input;

class TicketsController extends Controller
{
    /**
     * Get all tickets
     * @return \Illuminate\Http\JsonResponse
     */
    public function all(){

        $project = Input::get('project') ? : '';
        $raw_data = $this->sendRequest('GET', $project.'/tickets');
        $tickets = $raw_data->ticket;

        $html = view('tickets.all')->with('tickets', $tickets)->render();

        return response()->json([
            'raw_data' => $raw_data,
            'html' => $html
        ]);
    }
//
//    public function getAllProjectTickets($project){
//        $query = array('query' => 'sort:status order:desc');
//        $raw_data = $this->sendRequest('GET', "{$project}/tickets", $query);
//        return $raw_data;
//    }
//
//    public function getAllProjects(){
//        $project_names_whitelist = array('api', 'contour', 'cavity magnetron');
//        $all_projects = $this->sendRequest('GET', "projects");
//        $all_projects_assoc = $this->composeArrayOfProjects($all_projects);
//        $projects = $this->filterWhitelisted($project_names_whitelist, $all_projects_assoc);
//        return $projects;
//    }
//
//    public function composeArrayOfProjects($all_projects){
//        $all_projects_assoc = array();
//        foreach($all_projects->project as $project){
//            //this Ternary operator is necessary because Codebase API is throwing error when passing lower case "api" as name of the project.
//            $all_projects_assoc[strtolower($project->name)] = ((string) $project->permalink === 'api') ? strtoupper($project->permalink) : (string) $project->permalink;
//        }
//        return $all_projects_assoc;
//    }
//
//    public function filterWhitelisted(array $whitelist, array $projects) {
//            $flipped = array_flip($whitelist);
//            $result = array_intersect_key($projects, $flipped);
//            return $result;
//    }
}