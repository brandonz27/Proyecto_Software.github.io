<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SHOOT & LEARN</title>
    <link rel="stylesheet" href="style.css" />
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
</head>

<?php
    function isMobile() {
        return preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
    }
    $device_class = isMobile() ? 'mobile' : 'desktop';
?>

<body class="<?php echo $device_class; ?>">
    <div id="contenedor-juego">
        <video autoplay muted loop id="video-fondo">
            <source src="videos/video.mp4" type="video/mp4" />
            Tu navegador no soporta videos HTML5.
        </video>
        <div id="pantalla-inicio" class="pantalla-juego active">
            <h1>SHOOT & LEARN</h1>
            <button id="boton-jugar">Jugar</button>
            <button id="boton-seleccionar-nivel">Seleccionar Nivel</button>
            <button id="boton-opciones">Opciones</button>
            <button id="boton-controles">Controles</button>
            <button id="boton-ranking">Ranking</button>
        </div>

        <div id="pantalla-opciones" class="pantalla-juego">
            <h2>Opciones</h2>
            <div class="opcion-control">
                <label for="volumen-musica">Volumen Música</label>
                <input type="range" id="volumen-musica" min="0" max="1" step="0.1" value="1" />
            </div>
            <div class="opcion-control">
                <label for="volumen-sonido">Volumen Sonido</label>
                <input type="range" id="volumen-sonido" min="0" max="1" step="0.1" value="1" />
            </div>
            <div class="opcion-control">
                <label>Dificultad</label>
                <div class="grupo-botones-dificultad">
                    <button class="boton-dificultad" data-dificultad="facil">
                        Fácil
                    </button>
                    <button class="boton-dificultad" data-dificultad="medio">
                        Medio
                    </button>
                    <button class="boton-dificultad" data-dificultad="dificil">
                        Difícil
                    </button>
                </div>
            </div>
            <button class="boton-volver">Volver</button>
        </div>

        <div id="pantalla-controles" class="pantalla-juego">
            <h2>Controles</h2>
            <ul>
                <li>
                    <strong>Flechas Izquierda/Derecha</strong>: Mover personaje
                    horizontalmente
                </li>
                <li><strong>Click del Ratón</strong>: Disparar (fase de disparo)</li>
            </ul>
            <button class="boton-volver">Volver</button>
        </div>

        <div id="pantalla-seleccion-nivel" class="pantalla-juego">
            <h2>Seleccionar Nivel</h2>
            <div id="contenedor-botones-nivel"></div>
            <button class="boton-volver">Volver</button>
        </div>

        <div id="pantalla-pregunta" class="pantalla-pregunta"></div>

        <canvas id="lienzo-juego"></canvas>

        <div id="ui-juego">
            <div id="puntaje">Puntuación: 0</div>
            <div id="nivel">Nivel: 1</div>
            <div id="disparos-restantes">Disparos:</div>
            <button id="boton-pausa">Pausa</button>
        </div>

        <div id="indicador-nivel" class="indicador-nivel"></div>

        <div id="pantalla-pausa" class="pantalla-juego">
            <h2>Juego en Pausa</h2>
            <button id="boton-continuar">Continuar</button>
            <button id="boton-salir-pausa">Salir al Menú</button>
            <button id="boton-silenciar">Silenciar</button>
        </div>

        <div id="pantalla-gameover" class="pantalla-juego">
            <h2>¡Juego Terminado!</h2>
            <p id="puntaje-final"></p>
            <p id="razon-gameover"></p>
            <button id="boton-reiniciar">Volver a Jugar</button>
            <button id="boton-menu-gameover">Menú Principal</button>
        </div>

        <div id="pantalla-nivel-completado" class="pantalla-juego">
            <h2 id="titulo-nivel-completado">¡Nivel 1 Completado!</h2>
            <p id="puntaje-nivel-completado"></p>
            <button id="boton-siguiente-nivel">Comenzar Nivel 2</button>
        </div>

        <div id="pantalla-ganaste" class="pantalla-juego">
            <h2>¡Felicidades, Ganaste!</h2>
            <p>Completaste todos los niveles.</p>
            <p id="puntaje-final-ganaste"></p>
            <button id="boton-jugar-de-nuevo">Jugar de Nuevo</button>
        </div>

        <div id="pantalla-ranking" class="pantalla-juego">
            <h2>Ranking</h2>
            <table id="tabla-ranking">
                <thead>
                    <tr>
                        <th>Puesto</th>
                        <th>Puntaje</th>
                    </tr>
                </thead>
                <tbody>
                <?php
                    $servername = "161.97.124.87";
                    $username = "ucekcom_juego1";
                    $password = 'HK}P$E];spPuz0{w';
                    $dbname = "ucekcom_juego";

                    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['puntaje'])) {
                        header('Content-Type: application/json');
                        $conn = new mysqli($servername, $username, $password, $dbname);

                        if ($conn->connect_error) {
                            http_response_code(500);
                            echo json_encode(array("error" => "Conexión fallida: " . $conn->connect_error));
                            exit;
                        }

                        $puntaje = filter_input(INPUT_POST, 'puntaje', FILTER_VALIDATE_INT);

                        if ($puntaje !== false && $puntaje > 0) {
                            $stmt_check = $conn->prepare("SELECT COUNT(*) FROM juego_progreso WHERE puntaje_maximo = ?");
                            $stmt_check->bind_param("i", $puntaje);
                            $stmt_check->execute();
                            $stmt_check->bind_result($count);
                            $stmt_check->fetch();
                            $stmt_check->close();

                            if ($count == 0) {
                                $stmt_insert = $conn->prepare("INSERT INTO juego_progreso (puntaje_maximo) VALUES (?)");
                                $stmt_insert->bind_param("i", $puntaje);
                                if ($stmt_insert->execute()) {
                                    echo json_encode(array("success" => "Puntaje guardado"));
                                } else {
                                    http_response_code(500);
                                    echo json_encode(array("error" => "Error al guardar el puntaje: " . $stmt_insert->error));
                                }
                            } else {
                                echo json_encode(array("success" => "El puntaje ya existe, no se guardó de nuevo"));
                            }
                        } else {
                            http_response_code(400);
                            echo json_encode(array("error" => "Puntaje inválido"));
                        }
                        $conn->close();
                        exit; 
                    }

                    $conn = new mysqli($servername, $username, $password, $dbname);
                    if ($conn->connect_error) {
                        echo "<tr><td colspan='2'>Conexión fallida: " . $conn->connect_error . "</td></tr>";
                    } else {
                        $sql = "SELECT puntaje_maximo FROM juego_progreso ORDER BY puntaje_maximo DESC LIMIT 10";
                        $result = $conn->query($sql);
                        if ($result && $result->num_rows > 0) {
                            $puesto = 1;
                            while($row = $result->fetch_assoc()) {
                                echo "<tr><td>" . $puesto++ . "</td><td>" . $row["puntaje_maximo"] . "</td></tr>";
                            }
                        } else {
                            echo "<tr><td colspan='2'>No hay puntajes.</td></tr>";
                        }
                        $conn->close();
                    }
                ?>
                </tbody>
            </table>
            <button class="boton-volver">Volver</button>
        </div>
    </div>

    <div id="modal-personalizado" class="modal">
        <div class="modal-contenido">
            <p id="mensaje-modal"></p>
        </div>
    </div>

    <script src="script.js"></script>
    <audio id="musica-menu" loop autoplay>
        <source src="audios/musica3.mp3" type="audio/mpeg" />
    </audio>
    <audio id="sonido-juego">
        <source src="audios/sonido_juego.mp3" type="audio/mpeg" />
    </audio>

    <div id="controles-tactiles">
        <button id="boton-izquierda" class="control-tactil">&#9664;</button>
        <button id="boton-derecha" class="control-tactil">&#9654;</button>
        <button id="boton-disparo" class="control-tactil">&#11044;</button>
    </div>
</body>

</html>