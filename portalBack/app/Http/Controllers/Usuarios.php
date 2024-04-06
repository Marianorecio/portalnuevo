<?php
namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Usuarios extends Controller
{
    use AuthorizesRequests, ValidatesRequests;
    /*
    * Obtener usuario y contraseña para inicio de sesión
    * correo: correo con el cual se ingresa
    * contraseña: contraseña del usuario 
    */
    public function getConId(Request $request)
    {
      
        $data = DB::select('SELECT * FROM users WHERE correo = ? AND contra = ?;',array($request->correo, $request->contra));
        if(sizeof($data) == 0){
            return response()->json([
                'mensaje' => 'El usuario no existe o la contraseña es incorrecta.'
            ], 400);
        }
        return response()->json([
            'data' => $data
        ], 200);
    }

    /*
    * Guardar un nuevo usuario
    * correo: correo con el cual se registra
    * contraseña: contraseña del usuario 
    * nombre: nombre del usuario nuevo
    */
    public function save(Request $request){
        $data = array(
            $request->correo,
            $request->contra,
            $request->nombre
        );

        $existe = DB::select('SELECT * FROM users WHERE correo = ?;',array($request->correo));
        
        if(sizeof($existe) > 0){
            return response()->json([
                'mensaje' => 'El usuario ya existe.'
            ], 400);
        }

        try {

            DB::insert("INSERT INTO users (correo, contra, nombre) 
                         VALUES (?,?,?)",$data);

        } catch (Exception $e) {

            return response()->json([
                'message' => $e->errorInfo[2],
                'request' => $request,
            ], 400);
        }
        return response()->json([
            'message' => 'USuario guardado con éxito',
            'data' => $data
        ], 200);
    }
       /*
    * teActualiza un usuario
    * correo: correo con el que se registra
    * contraseña: contraseña del usuario 
    * nombre: nombre del usuario
    */
    public function update(Request $request){
        $data = array(
            $request->correo,
            $request->contra,
            $request->nombre
        );

        try {

            DB::insert("INSERT INTO users (correo, contra, nombre) 
                         VALUES (?,?,?)",$data);

        } catch (Exception $e) {

            return response()->json([
                'message' => $e->errorInfo[2],
                'request' => $request,
            ], 400);
        }
        return response()->json([
            'message' => 'Usuario actualizado con éxito',
            'data' => $data
        ], 200);
    }
}
