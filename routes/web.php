<?php

use Illuminate\Support\Facades\Route;

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
use App\Post;
Route::get('/', function () {
	$posts = Post::All();
    return view('welcome', compact('posts'));
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

//Vue - route
Route::get('{path}', 'HomeController@index');