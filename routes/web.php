<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'CodebaseStatsController@index');
Route::get('/api/activity/all', 'ActivityController@all');
Route::get('/api/tickets/{project}', 'TicketsController@all');
Route::get('/api/tickets/stats/{project}', 'TicketsStatsController@statistics');