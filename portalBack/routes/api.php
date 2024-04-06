<?php
header('Access-Control-Allow-Origin: http://localhost:4200');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

use App\Http\Controllers\Comentarios;
use App\Http\Controllers\Noticias;
use App\Http\Controllers\Usuarios;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'portal'
], function ($router) {
    Route::get('/usuarios', [Usuarios::class, 'get']);
    Route::get('/comentarios/{id}', [Comentarios::class, 'get']);
    // POST //
    Route::post('/usuarios', [USuarios::class, 'save']);
    Route::post('/usuarios/login', [USuarios::class, 'getConId']);
    Route::post('/comentarios', [Comentarios::class, 'save']);
    // PUT //
    Route::put('/usuarios', [USuarios::class, 'update']);
    // DELETE //
});