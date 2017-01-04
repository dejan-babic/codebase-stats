<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * @var Client|null
     */
    private $client = null;

    private $username = 'redeye-int/vladimir-vuckovic-68';
    private $password = '3e3e947c383159455c62e15ad471ea0ce3c70d88';
    private $base_uri = 'http://api3.codebasehq.com/';

    /**
     * Create Guzzle client
     * Controller constructor.
     */
    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => $this->base_uri,
            'headers' => ['Accept' => 'application/xml', 'Content-type' => 'application/xml'],
            'auth' => [$this->username, $this->password]
        ]);
    }

    /**
     * Send request to Codebase API
     * @param $method
     * @param $uri
     * @param null $query
     * @return array|\SimpleXMLElement
     */
    public function sendRequest($method, $uri, $query = null)
    {
        $headers_arr = [];

        if($query !== null) {
            $headers_arr['query'] = $query;
        }

        $response = $this->client->request($method, $uri, $headers_arr);

        return $response->getStatusCode() == 200 ? simplexml_load_string($response->getBody()) : [];
    }
}
