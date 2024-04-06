<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Comentarios extends Controller
{
    use AuthorizesRequests, ValidatesRequests;
    /*
    * OBtener comentarios de la noticia seleccionada.
    * @param: $id -> se refiere al titulo de la noticia
    */
    public function get($id)
    {

        $data = DB::select('SELECT * FROM comentarios WHERE noticiaid LIKE "%'.$id.'%" ORDER BY fecha ASC;',array());
        
        return response()->json([
            'data' => $data
        ], 200);
    }

    /*
    * Guardar comentario a determinada noticia
    * comentario: comentario realizado
    * correo: correo que realizo el comentario
    * nombre: Nombre de la persona que realizó el comentario
    * noticiaid: titulo de la noticia al que se le hizo el comentario
    */ 
    public function save(Request $request)
    {
        
        $data = array(
            $request->comentario,
            $request->correo,
            $request->nombre,
            $request->noticiaid
        );
        
        try {

            DB::insert("INSERT INTO comentarios (comentario, correo, nombre, noticiaid,fecha) 
                         VALUES (?,?,?,?,'".date("Y-m-d H:i:s")."')",$data);
        } catch (Exception $e) {

            return response()->json([
                'message' => $e->errorInfo[2],
                'request' => $request,
            ], 400);
        }
        $data = DB::select('SELECT * FROM comentarios WHERE noticiaid = ? ORDER BY fecha ASC;',array($request->noticiaid));

        return response()->json([
            'message' => 'Comentario guardado con éxito',
            'data' => $data
        ], 200);
    }
 
}
