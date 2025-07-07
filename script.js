const pantallaInicio = document.getElementById("pantalla-inicio");
const botonJugar = document.getElementById("boton-jugar");
const botonSeleccionarNivel = document.getElementById(
  "boton-seleccionar-nivel"
);
const botonOpciones = document.getElementById("boton-opciones");
const botonControles = document.getElementById("boton-controles");
const pantallaOpciones = document.getElementById("pantalla-opciones");
const pantallaControles = document.getElementById("pantalla-controles");
const pantallaSeleccionNivel = document.getElementById(
  "pantalla-seleccion-nivel"
);
const contenedorBotonesNivel = document.getElementById(
  "contenedor-botones-nivel"
);
const pantallaGameOver = document.getElementById("pantalla-gameover");
const botonesVolver = document.querySelectorAll(".boton-volver");
const botonReiniciar = document.getElementById("boton-reiniciar");
const botonMenuGameOver = document.getElementById("boton-menu-gameover");
const puntajeFinalElemento = document.getElementById("puntaje-final");
const razonGameOverElemento = document.getElementById("razon-gameover");
const pantallaNivelCompletado = document.getElementById(
  "pantalla-nivel-completado"
);
const tituloNivelCompletado = document.getElementById(
  "titulo-nivel-completado"
);
const puntajeNivelCompletado = document.getElementById(
  "puntaje-nivel-completado"
);
const botonSiguienteNivel = document.getElementById("boton-siguiente-nivel");
const pantallaGanaste = document.getElementById("pantalla-ganaste");
const puntajeFinalGanaste = document.getElementById("puntaje-final-ganaste");
const botonJugarDeNuevo = document.getElementById("boton-jugar-de-nuevo");
const lienzo = document.getElementById("lienzo-juego");
const ctx = lienzo.getContext("2d");
const puntajeElemento = document.getElementById("puntaje");
const nivelElemento = document.getElementById("nivel");
const disparosRestantesElemento = document.getElementById("disparos-restantes");
const indicadorNivel = document.getElementById("indicador-nivel");
const botonPausa = document.getElementById("boton-pausa");
const pantallaPausa = document.getElementById("pantalla-pausa");
const botonContinuar = document.getElementById("boton-continuar");
const botonSalirPausa = document.getElementById("boton-salir-pausa");
const botonSilenciar = document.getElementById("boton-silenciar");
const modalPersonalizado = document.getElementById("modal-personalizado");
const mensajeModal = document.getElementById("mensaje-modal");
const pantallaPregunta = document.getElementById("pantalla-pregunta");
const videoFondo = document.getElementById("video-fondo");
const botonRanking = document.getElementById("boton-ranking");
const pantallaRanking = document.getElementById("pantalla-ranking");
const tablaRankingBody = document.querySelector("#tabla-ranking tbody");

// --- Variables del Juego ---
let puntajeActual = 0;
let nivelActual = 1;
let vidasJugador = 3;
let jugadorX = 400;
const jugadorY = 600 - 134;
const anchoJugador = 98; // Ancho de cada fotograma del jugador en el spritesheet (controla el 'zoom' horizontal)
const altoJugador = 134; // Alto de cada fotograma del jugador en el spritesheet (controla el 'zoom' vertical)
const velocidadJugador = 12;
let proyectiles = [];
const velocidadProyectil = 10;
let objetivos = [];
let obstaculos = [];
let intervaloJuego;
let juegoEnCurso = false;
let preguntaActual = null;
let opcionesActuales = [];
let disparosEnFase = 0;
let obstaculosSuperadosFase = 0;
let faseJuego = "corriendo";
let enPausa = false;
let pausaPorPregunta = false; // NUEVO: pausa especial para preguntas
let dioSegundaOportunidad = false;
let respuestasCorrectas = 0;
let aciertosParaPregunta = 7;
let preguntasRespondidas = 0;

// Define los umbrales de puntos en los que aparecerá una pregunta para cada nivel.
const puntosParaPreguntaPorNivel = {
  1: [70, 140, 210], // Nivel 1
  2: [280, 350, 420], // Nivel 2
  3: [490, 560, 630], // Nivel 3
  4: [700, 770, 840], // Nivel 4
  5: [910, 980, 1050], // Nivel 5
  6: [1120, 1190, 1260], // Nivel 6
  7: [1330, 1400, 1470], // Nivel 7
  8: [1540, 1610, 1680], // Nivel 8
};

let indiceProximoPuntoDePregunta = 0;

// Variables de animación del jugador
const imagenJugador = new Image();
imagenJugador.src = "jugador/jugador.png";
const totalFramesCorrer = 1;
let frameActualJugador = 0;
let temporizadorAnimacionJugador = 0;
const velocidadAnimacionJugador = 5;
let estaDisparando = false; // Se mantiene por ahora, pero la lógica de dibujado cambiará

// Imagen para el disparo
const imagenDisparo = new Image();
imagenDisparo.src = "municiones/bala.png"; // Usar imagen local para el disparo
const anchoDisparo = 20;
const altoDisparo = 20;

// Imagen y desplazamiento de la carretera
const imagenCarretera = new Image();
let desplazamientoCarreteraY = 0;
let velocidadDesplazamientoCarretera = 2;

// Obstáculos como imágenes
const imagenesObstaculo = [
  "proyectiles/socket2.png",
  "proyectiles/misil1.png",
  "proyectiles/misil2.png",
  "proyectiles/socket.png",
  "proyectiles/manzana.png",
  "proyectiles/bola_fuego.png",
];

// Propiedades de los obstáculos
let velocidadObstaculo = 3;
let retardoAparicionObstaculo = 1200;
let ultimoTiempoObstaculo = 0;

let preguntasRespondidasEnNivel = [];

const preguntasArray = [
  // NIVEL 1 - Preguntas Básicas (8 preguntas)
  {
    pregunta_id: 1,
    nivel_id: 1,
    pregunta: "🍎", // Imagen de una manzana
    respuesta_correcta: "Apple",
    puntos: 10,
    tipo: "opción_múltiple",
    opciones: ["Pear", "Apple", "Banana", "Orange"],
  },
  {
    pregunta_id: 2,
    nivel_id: 1,
    pregunta: "🐶", // Imagen de un perro
    respuesta_correcta: "Dog",
    puntos: 10,
    tipo: "opción_múltiple",
    opciones: ["Cat", "Cow", "Dog", "Bird"],
  },
  {
    pregunta_id: 3,
    nivel_id: 1,
    pregunta: "🍌", // Imagen de una banana
    respuesta_correcta: "Banana",
    puntos: 10,
    tipo: "opción_múltiple",
    opciones: ["Banana", "Grape", "Pineapple", "Strawberry"],
  },
  {
    pregunta_id: 4,
    nivel_id: 1,
    pregunta: "🔵", // Imagen de un círculo azul
    respuesta_correcta: "Blue",
    puntos: 10,
    tipo: "opción_múltiple",
    opciones: ["Green", "Red", "Blue", "Yellow"],
  },
  {
    pregunta_id: 5,
    nivel_id: 1,
    pregunta: "🐱", // Imagen de un gato
    respuesta_correcta: "Cat",
    puntos: 10,
    tipo: "opción_múltiple",
    opciones: ["Dog", "Cat", "Bird", "Horse"],
  },
  {
    pregunta_id: 6,
    nivel_id: 1,
    pregunta: "🍇", // Imagen de uvas
    respuesta_correcta: "Grapes",
    puntos: 10,
    tipo: "opción_múltiple",
    opciones: ["Grapes", "Orange", "Apple", "Lemon"],
  },
  {
    pregunta_id: 7,
    nivel_id: 1,
    pregunta: "🌞", // Imagen de un sol
    respuesta_correcta: "Sun",
    puntos: 10,
    tipo: "opción_múltiple",
    opciones: ["Moon", "Star", "Sun", "Sky"],
  },
  {
    pregunta_id: 8,
    nivel_id: 1,
    pregunta: "📚", // Imagen de libros
    respuesta_correcta: "Books",
    puntos: 10,
    tipo: "opción_múltiple",
    opciones: ["Books", "Pens", "Chairs", "Shoes"],
  },

  // NIVEL 2 - Preguntas Intermedias (8 preguntas)
  {
    pregunta_id: 9,
    nivel_id: 2,
    pregunta: "Perro",
    respuesta_correcta: "Dog",
    puntos: 20,
    tipo: "opción_múltiple",
    opciones: ["Cat", "Bird", "Dog", "Cow"],
  },
  {
    pregunta_id: 10,
    nivel_id: 2,
    pregunta: "Mesa",
    respuesta_correcta: "Table",
    puntos: 20,
    tipo: "opción_múltiple",
    opciones: ["Chair", "Table", "Sofa", "Bed"],
  },
  {
    pregunta_id: 11,
    nivel_id: 2,
    pregunta: "Rojo",
    respuesta_correcta: "Red",
    puntos: 20,
    tipo: "opción_múltiple",
    opciones: ["Green", "Blue", "Red", "Black"],
  },
  {
    pregunta_id: 12,
    nivel_id: 2,
    pregunta: "Gracias",
    respuesta_correcta: "Thank you",
    puntos: 20,
    tipo: "opción_múltiple",
    opciones: ["Goodbye", "Please", "Thank you", "Sorry"],
  },
  {
    pregunta_id: 13,
    nivel_id: 2,
    pregunta: "Libro",
    respuesta_correcta: "Book",
    puntos: 20,
    tipo: "opción_múltiple",
    opciones: ["Pen", "Book", "Notebook", "Pencil"],
  },
  {
    pregunta_id: 14,
    nivel_id: 2,
    pregunta: "Agua",
    respuesta_correcta: "Water",
    puntos: 20,
    tipo: "opción_múltiple",
    opciones: ["Milk", "Juice", "Water", "Soda"],
  },
  {
    pregunta_id: 15,
    nivel_id: 2,
    pregunta: "Hola",
    respuesta_correcta: "Hello",
    puntos: 20,
    tipo: "opción_múltiple",
    opciones: ["Hi", "Hello", "Bye", "Thanks"],
  },
  {
    pregunta_id: 16,
    nivel_id: 2,
    pregunta: "Cielo",
    respuesta_correcta: "Sky",
    puntos: 20,
    tipo: "opción_múltiple",
    opciones: ["Ground", "Cloud", "Sky", "Sea"],
  },

  // NIVEL 3 - Preguntas Avanzadas (8 preguntas)
  {
    pregunta_id: 17,
    nivel_id: 3,
    pregunta: "¿Cómo estás?",
    respuesta_correcta: "How are you?",
    puntos: 30,
    tipo: "opción_múltiple",
    opciones: [
      "How are you?",
      "Who are you?",
      "Where are you?",
      "What is that?",
    ],
  },
  {
    pregunta_id: 18,
    nivel_id: 3,
    pregunta: "Me gusta el chocolate.",
    respuesta_correcta: "I like chocolate.",
    puntos: 30,
    tipo: "opción_múltiple",
    opciones: [
      "I eat chocolate.",
      "I have chocolate.",
      "I like chocolate.",
      "I want chocolate.",
    ],
  },
  {
    pregunta_id: 19,
    nivel_id: 3,
    pregunta: "Tengo un gato.",
    respuesta_correcta: "I have a cat.",
    puntos: 30,
    tipo: "opción_múltiple",
    opciones: ["I have a dog.", "I am a cat.", "I like cats.", "I have a cat."],
  },
  {
    pregunta_id: 20,
    nivel_id: 3,
    pregunta: "Vivo en una casa.",
    respuesta_correcta: "I live in a house.",
    puntos: 30,
    tipo: "opción_múltiple",
    opciones: [
      "I live in a car.",
      "I live in a school.",
      "I live in a house.",
      "I live in a city.",
    ],
  },
  {
    pregunta_id: 21,
    nivel_id: 3,
    pregunta: "Ella es mi hermana.",
    respuesta_correcta: "She is my sister.",
    puntos: 30,
    tipo: "opción_múltiple",
    opciones: [
      "She is my mother.",
      "She is my sister.",
      "She is my friend.",
      "She is my daughter.",
    ],
  },
  {
    pregunta_id: 22,
    nivel_id: 3,
    pregunta: "El libro está en la mesa.",
    respuesta_correcta: "The book is on the table.",
    puntos: 30,
    tipo: "opción_múltiple",
    opciones: [
      "The book is under the table.",
      "The book is on the table.",
      "The book is in the bag.",
      "The table is on the book.",
    ],
  },
  {
    pregunta_id: 23,
    nivel_id: 3,
    pregunta: "¿Qué hora es?",
    respuesta_correcta: "What time is it?",
    puntos: 30,
    tipo: "opción_múltiple",
    opciones: [
      "What day is it?",
      "Where is it?",
      "What time is it?",
      "How old are you?",
    ],
  },
  {
    pregunta_id: 24,
    nivel_id: 3,
    pregunta: "Tengo 10 años.",
    respuesta_correcta: "I am ten years old.",
    puntos: 30,
    tipo: "opción_múltiple",
    opciones: [
      "I have ten years.",
      "I am ten years old.",
      "I live ten years.",
      "I go to ten years.",
    ],
  },
  //nivel 4
  {
    pregunta_id: 25,
    nivel_id: 4,
    pregunta: "Yo no como carne.",
    respuesta_correcta: "I don't eat meat.",
    puntos: 40,
    tipo: "opción_múltiple",
    opciones: [
      "I no eat meat.",
      "I don't eat meat.",
      "I doesn't eat meat.",
      "I not eat meat.",
    ],
  },
  {
    pregunta_id: 26,
    nivel_id: 4,
    pregunta: "Ella trabaja todos los días.",
    respuesta_correcta: "She works every day.",
    puntos: 40,
    tipo: "opción_múltiple",
    opciones: [
      "She works every day.",
      "She work every day.",
      "She working every day.",
      "She worked every day.",
    ],
  },
  {
    pregunta_id: 27,
    nivel_id: 4,
    pregunta: "Tú hablas inglés muy bien.",
    respuesta_correcta: "You speak English very well.",
    puntos: 40,
    tipo: "opción_múltiple",
    opciones: [
      "You speaks English very well.",
      "You speak English very well.",
      "You speaking English very well.",
      "You is speak English very well.",
    ],
  },
  {
    pregunta_id: 28,
    nivel_id: 4,
    pregunta: "Nosotros no tenemos clases hoy.",
    respuesta_correcta: "We don't have classes today.",
    puntos: 40,
    tipo: "opción_múltiple",
    opciones: [
      "We not have classes today.",
      "We don't have classes today.",
      "We doesn't have classes today.",
      "We hasn't classes today.",
    ],
  },
  {
    pregunta_id: 29,
    nivel_id: 4,
    pregunta: "Ella no ve televisión.",
    respuesta_correcta: "She doesn't watch TV.",
    puntos: 40,
    tipo: "opción_múltiple",
    opciones: [
      "She no watch TV.",
      "She not watches TV.",
      "She doesn't watch TV.",
      "She don't watch TV.",
    ],
  },
  {
    pregunta_id: 30,
    nivel_id: 4,
    pregunta: "Él vive en Londres.",
    respuesta_correcta: "He lives in London.",
    puntos: 40,
    tipo: "opción_múltiple",
    opciones: [
      "He live in London.",
      "He living in London.",
      "He lives in London.",
      "He is live in London.",
    ],
  },
  {
    pregunta_id: 31,
    nivel_id: 4,
    pregunta: "Mi mamá cocina muy bien.",
    respuesta_correcta: "My mom cooks very well.",
    puntos: 40,
    tipo: "opción_múltiple",
    opciones: [
      "My mom cook very well.",
      "My mom cooks very good.",
      "My mom cooks very well.",
      "My mom is cook very well.",
    ],
  },
  {
    pregunta_id: 32,
    nivel_id: 4,
    pregunta: "Ellos leen libros en casa.",
    respuesta_correcta: "They read books at home.",
    puntos: 40,
    tipo: "opción_múltiple",
    opciones: [
      "They reads books at home.",
      "They read books at home.",
      "They reading books at home.",
      "They read book at home.",
    ],
  },
  //nivel 5
  {
    pregunta_id: 33,
    nivel_id: 5,
    pregunta: "Ella fue al mercado.",
    respuesta_correcta: "She went to the market.",
    puntos: 50,
    tipo: "opción_múltiple",
    opciones: [
      "She go to the market.",
      "She goes to the market.",
      "She went to the market.",
      "She gone to the market.",
    ],
  },
  {
    pregunta_id: 34,
    nivel_id: 5,
    pregunta: "Comí pizza ayer.",
    respuesta_correcta: "I ate pizza yesterday.",
    puntos: 50,
    tipo: "opción_múltiple",
    opciones: [
      "I eat pizza yesterday.",
      "I ate pizza yesterday.",
      "I eaten pizza yesterday.",
      "I was eat pizza yesterday.",
    ],
  },
  {
    pregunta_id: 35,
    nivel_id: 5,
    pregunta: "Ellos hicieron su tarea.",
    respuesta_correcta: "They did their homework.",
    puntos: 50,
    tipo: "opción_múltiple",
    opciones: [
      "They do their homework.",
      "They did their homework.",
      "They does their homework.",
      "They done their homework.",
    ],
  },
  {
    pregunta_id: 36,
    nivel_id: 5,
    pregunta: "Él vio una película.",
    respuesta_correcta: "He saw a movie.",
    puntos: 50,
    tipo: "opción_múltiple",
    opciones: [
      "He sees a movie.",
      "He saw a movie.",
      "He seen a movie.",
      "He see a movie.",
    ],
  },
  {
    pregunta_id: 37,
    nivel_id: 5,
    pregunta: "Nosotros tuvimos una fiesta.",
    respuesta_correcta: "We had a party.",
    puntos: 50,
    tipo: "opción_múltiple",
    opciones: [
      "We has a party.",
      "We had a party.",
      "We have a party.",
      "We haved a party.",
    ],
  },
  {
    pregunta_id: 38,
    nivel_id: 5,
    pregunta: "Tú escribiste una carta.",
    respuesta_correcta: "You wrote a letter.",
    puntos: 50,
    tipo: "opción_múltiple",
    opciones: [
      "You write a letter.",
      "You wrote a letter.",
      "You written a letter.",
      "You was write a letter.",
    ],
  },
  {
    pregunta_id: 39,
    nivel_id: 5,
    pregunta: "Él tomó el autobús.",
    respuesta_correcta: "He took the bus.",
    puntos: 50,
    tipo: "opción_múltiple",
    opciones: [
      "He take the bus.",
      "He takes the bus.",
      "He took the bus.",
      "He taked the bus.",
    ],
  },
  {
    pregunta_id: 40,
    nivel_id: 5,
    pregunta: "Yo encontré mi libro.",
    respuesta_correcta: "I found my book.",
    puntos: 50,
    tipo: "opción_múltiple",
    opciones: [
      "I find my book.",
      "I founded my book.",
      "I found my book.",
      "I finded my book.",
    ],
  },

  //nivel 6
  {
    pregunta_id: 41,
    nivel_id: 6,
    pregunta: "¿Dónde vives?",
    respuesta_correcta: "Where do you live?",
    puntos: 60,
    tipo: "opción_múltiple",
    opciones: [
      "Where do you live?",
      "Where you live?",
      "Where are you live?",
      "Where does you live?",
    ],
  },
  {
    pregunta_id: 42,
    nivel_id: 6,
    pregunta: "¿Qué haces?",
    respuesta_correcta: "What do you do?",
    puntos: 60,
    tipo: "opción_múltiple",
    opciones: [
      "What you do?",
      "What do you do?",
      "What are you do?",
      "What does you do?",
    ],
  },
  {
    pregunta_id: 43,
    nivel_id: 6,
    pregunta: "¿Cuándo comes?",
    respuesta_correcta: "When do you eat?",
    puntos: 60,
    tipo: "opción_múltiple",
    opciones: [
      "When you eat?",
      "When do you eat?",
      "When are you eat?",
      "When does you eat?",
    ],
  },
  {
    pregunta_id: 44,
    nivel_id: 6,
    pregunta: "¿Por qué estudias inglés?",
    respuesta_correcta: "Why do you study English?",
    puntos: 60,
    tipo: "opción_múltiple",
    opciones: [
      "Why do you study English?",
      "Why you study English?",
      "Why does you study English?",
      "Why are you study English?",
    ],
  },
  {
    pregunta_id: 45,
    nivel_id: 6,
    pregunta: "¿Quién es ella?",
    respuesta_correcta: "Who is she?",
    puntos: 60,
    tipo: "opción_múltiple",
    opciones: ["Who she is?", "Who is she?", "Who are she?", "Who she?"],
  },
  {
    pregunta_id: 46,
    nivel_id: 6,
    pregunta: "¿Cómo te llamas?",
    respuesta_correcta: "What is your name?",
    puntos: 60,
    tipo: "opción_múltiple",
    opciones: [
      "What your name is?",
      "What is your name?",
      "How is your name?",
      "What are your name?",
    ],
  },
  {
    pregunta_id: 47,
    nivel_id: 6,
    pregunta: "¿Él tiene un coche?",
    respuesta_correcta: "Does he have a car?",
    puntos: 60,
    tipo: "opción_múltiple",
    opciones: [
      "Does he have a car?",
      "Does he has a car?",
      "Do he have a car?",
      "Is he have a car?",
    ],
  },
  {
    pregunta_id: 48,
    nivel_id: 6,
    pregunta: "¿Qué hora es?",
    respuesta_correcta: "What time is it?",
    puntos: 60,
    tipo: "opción_múltiple",
    opciones: [
      "What time is it?",
      "What hour is it?",
      "What time it is?",
      "Is what time it?",
    ],
  },

  //nivel 7

  {
    pregunta_id: 49,
    nivel_id: 7,
    pregunta: "Voy a estudiar esta noche.",
    respuesta_correcta: "I am going to study tonight.",
    puntos: 70,
    tipo: "opción_múltiple",
    opciones: [
      "I go to study tonight.",
      "I will study tonight.",
      "I am going to study tonight.",
      "I studying tonight.",
    ],
  },
  {
    pregunta_id: 50,
    nivel_id: 7,
    pregunta: "Ellos van a viajar mañana.",
    respuesta_correcta: "They are going to travel tomorrow.",
    puntos: 70,
    tipo: "opción_múltiple",
    opciones: [
      "They are going to travel tomorrow.",
      "They will travel yesterday.",
      "They going travel tomorrow.",
      "They are travel to tomorrow.",
    ],
  },
  {
    pregunta_id: 51,
    nivel_id: 7,
    pregunta: "Va a llover.",
    respuesta_correcta: "It is going to rain.",
    puntos: 70,
    tipo: "opción_múltiple",
    opciones: [
      "It will rain yesterday.",
      "It going rain.",
      "It is going to rain.",
      "It will raining.",
    ],
  },
  {
    pregunta_id: 52,
    nivel_id: 7,
    pregunta: "Comeré pizza esta noche.",
    respuesta_correcta: "I will eat pizza tonight.",
    puntos: 70,
    tipo: "opción_múltiple",
    opciones: [
      "I will eat pizza tonight.",
      "I am eat pizza tonight.",
      "I going to eat pizza tonight.",
      "I eats pizza tonight.",
    ],
  },
  {
    pregunta_id: 53,
    nivel_id: 7,
    pregunta: "¿Vas a estudiar inglés?",
    respuesta_correcta: "Are you going to study English?",
    puntos: 70,
    tipo: "opción_múltiple",
    opciones: [
      "Do you going to study English?",
      "Are you going to study English?",
      "Are you study English?",
      "You going to study English?",
    ],
  },
  {
    pregunta_id: 54,
    nivel_id: 7,
    pregunta: "Él no va a venir.",
    respuesta_correcta: "He is not going to come.",
    puntos: 70,
    tipo: "opción_múltiple",
    opciones: [
      "He no going to come.",
      "He is not going to come.",
      "He is going not to come.",
      "He don't come.",
    ],
  },
  {
    pregunta_id: 55,
    nivel_id: 7,
    pregunta: "Nosotros vamos a leer un libro.",
    respuesta_correcta: "We are going to read a book.",
    puntos: 70,
    tipo: "opción_múltiple",
    opciones: [
      "We going to read a book.",
      "We are go to read a book.",
      "We are going to read a book.",
      "We will going to read a book.",
    ],
  },
  {
    pregunta_id: 56,
    nivel_id: 7,
    pregunta: "Ellos no trabajarán mañana.",
    respuesta_correcta: "They will not work tomorrow.",
    puntos: 70,
    tipo: "opción_múltiple",
    opciones: [
      "They won't work tomorrow.",
      "They don't work tomorrow.",
      "They are not work tomorrow.",
      "They will not works tomorrow.",
    ],
  },

  //nivel 8

  {
    pregunta_id: 57,
    nivel_id: 8,
    pregunta: "Estoy leyendo un libro.",
    respuesta_correcta: "I am reading a book.",
    puntos: 80,
    tipo: "opción_múltiple",
    opciones: [
      "I read a book.",
      "I am read a book.",
      "I am reading a book.",
      "I reading book.",
    ],
  },
  {
    pregunta_id: 58,
    nivel_id: 8,
    pregunta: "Ella está cocinando la cena.",
    respuesta_correcta: "She is cooking dinner.",
    puntos: 80,
    tipo: "opción_múltiple",
    opciones: [
      "She cooks dinner.",
      "She is cooking dinner.",
      "She cooking dinner.",
      "She is cook dinner.",
    ],
  },
  {
    pregunta_id: 59,
    nivel_id: 8,
    pregunta: "Estamos aprendiendo inglés.",
    respuesta_correcta: "We are learning English.",
    puntos: 80,
    tipo: "opción_múltiple",
    opciones: [
      "We learn English.",
      "We are learning English.",
      "We are learn English.",
      "We learning English.",
    ],
  },
  {
    pregunta_id: 60,
    nivel_id: 8,
    pregunta: "¿Estás viendo televisión?",
    respuesta_correcta: "Are you watching TV?",
    puntos: 80,
    tipo: "opción_múltiple",
    opciones: [
      "Are you watching TV?",
      "Do you watch TV?",
      "You watching TV?",
      "Are you watch TV?",
    ],
  },
  {
    pregunta_id: 61,
    nivel_id: 8,
    pregunta: "Mi casa es más grande que la tuya.",
    respuesta_correcta: "My house is bigger than yours.",
    puntos: 80,
    tipo: "opción_múltiple",
    opciones: [
      "My house is bigger than yours.",
      "My house is big than yours.",
      "My house is more big than yours.",
      "My house bigger than yours.",
    ],
  },
  {
    pregunta_id: 62,
    nivel_id: 8,
    pregunta: "Él es más alto que yo.",
    respuesta_correcta: "He is taller than me.",
    puntos: 80,
    tipo: "opción_múltiple",
    opciones: [
      "He is more tall than me.",
      "He is taller than I.",
      "He is taller than me.",
      "He taller than me.",
    ],
  },
  {
    pregunta_id: 63,
    nivel_id: 8,
    pregunta: "Este libro es más interesante.",
    respuesta_correcta: "This book is more interesting.",
    puntos: 80,
    tipo: "opción_múltiple",
    opciones: [
      "This book is interestinger.",
      "This book is more interesting.",
      "This book is most interesting.",
      "This book is interest.",
    ],
  },
  {
    pregunta_id: 64,
    nivel_id: 8,
    pregunta: "Hoy está lloviendo.",
    respuesta_correcta: "It is raining today.",
    puntos: 80,
    tipo: "opción_múltiple",
    opciones: [
      "It rains today.",
      "It is rain today.",
      "It is raining today.",
      "It raining today.",
    ],
  },
];

const configuracionNivel = [
  {
    nivel: 1,
    imagenCarretera: "fondos/carretera1.jpg",
    velocidadObstaculo: 3,
    retardoAparicionObstaculo: 1200,
    obstaculosParaSuperar: 21,
    disparosPermitidos: 99,
  },
  {
    nivel: 2,
    imagenCarretera: "fondos/carretera2.jpg",
    velocidadObstaculo: 5,
    retardoAparicionObstaculo: 900,
    obstaculosParaSuperar: 21,
    disparosPermitidos: 99,
  },
  {
    nivel: 3,
    imagenCarretera: "fondos/carretera3.avif",
    velocidadObstaculo: 7,
    retardoAparicionObstaculo: 700,
    obstaculosParaSuperar: 21,
    disparosPermitidos: 99,
  },
  {
    nivel: 4,
    imagenCarretera: "fondos/carretera4.png",
    velocidadObstaculo: 9,
    retardoAparicionObstaculo: 600,
    obstaculosParaSuperar: 22,
    disparosPermitidos: 90,
  },
  {
    nivel: 5,
    imagenCarretera: "fondos/carretera5.png",
    velocidadObstaculo: 11,
    retardoAparicionObstaculo: 500,
    obstaculosParaSuperar: 23,
    disparosPermitidos: 85,
  },
  {
    nivel: 6,
    imagenCarretera: "fondos/carretera6.png",
    velocidadObstaculo: 13,
    retardoAparicionObstaculo: 450,
    obstaculosParaSuperar: 24,
    disparosPermitidos: 80,
  },
  {
    nivel: 7,
    imagenCarretera: "fondos/carretera7.png",
    velocidadObstaculo: 15,
    retardoAparicionObstaculo: 400,
    obstaculosParaSuperar: 25,
    disparosPermitidos: 75,
  },
  {
    nivel: 8,
    imagenCarretera: "fondos/carretera8.png",
    velocidadObstaculo: 17,
    retardoAparicionObstaculo: 350,
    obstaculosParaSuperar: 26,
    disparosPermitidos: 70,
  },
];

let nivelesDesbloqueados = 1;

function mostrarModal(mensaje) {
  mensajeModal.textContent = mensaje;
  modalPersonalizado.classList.add("active");
  setTimeout(() => {
    modalPersonalizado.classList.remove("active");
  }, 2000);
}

function mostrarPantalla(pantalla) {
  document.querySelectorAll(".pantalla-juego").forEach((s) => {
    s.classList.remove("active");
  });
  pantalla.classList.add("active");

  // Controlar la visibilidad del video
  if (
    pantalla === pantallaInicio ||
    pantalla === pantallaSeleccionNivel ||
    pantalla === pantallaOpciones ||
    pantalla === pantallaControles
  ) {
    videoFondo.style.opacity = 1;
  } else {
    videoFondo.style.opacity = 0;
  }

  if (
    pantalla === pantallaInicio ||
    pantalla === pantallaOpciones ||
    pantalla === pantallaControles ||
    pantalla === pantallaSeleccionNivel ||
    pantalla === pantallaGameOver ||
    pantalla === pantallaPausa ||
    pantalla === pantallaNivelCompletado ||
    pantalla === pantallaGanaste
  ) {
    lienzo.style.display = "none";
    document.getElementById("ui-juego").style.display = "none";
    pantallaPregunta.classList.remove("active");
    pausaPorPregunta = false;
  } else {
    lienzo.style.display = "block";
    document.getElementById("ui-juego").style.display = "flex";
  }
}

function iniciarJuego(nivelAIniciar) {
  puntajeActual = 0;
  nivelActual = nivelAIniciar;
  indiceProximoPuntoDePregunta = 0; // Reiniciar el progreso de las preguntas
  vidasJugador = 3;
  jugadorX = lienzo.width / 2 - anchoJugador / 2;
  proyectiles = [];
  objetivos = [];
  obstaculos = [];
  disparosEnFase = 0;
  obstaculosSuperadosFase = 0;
  juegoEnCurso = true;
  enPausa = false;
  pausaPorPregunta = false;
  faseJuego = "corriendo";
  preguntasRespondidasEnNivel = [];
  dioSegundaOportunidad = false;
  respuestasCorrectas = 0;
  preguntasRespondidas = 0;
  actualizarUI();

  // Ocultar todas las pantallas de menú y mostrar los elementos del juego
  document.querySelectorAll(".pantalla-juego").forEach((s) => {
    s.classList.remove("active");
  });
  lienzo.style.display = "block";
  document.getElementById("ui-juego").style.display = "flex";

  clearInterval(intervaloJuego);
  cargarConfiguracionNivel(nivelActual);
  mostrarIndicadorNivel(nivelActual);
  pantallaPregunta.classList.remove("active");
  intervaloJuego = setInterval(bucleJuego, 1000 / 60);
}

let ultimoNivelGameOver = 1;
function terminarJuego(razon) {
  juegoEnCurso = false;
  enPausa = false;
  pausaPorPregunta = false;
  clearInterval(intervaloJuego);
  ultimoNivelGameOver = nivelActual;
  puntajeFinalElemento.textContent = `Puntuación Final: ${puntajeActual}`;
  razonGameOverElemento.textContent = razon;
  pantallaPregunta.classList.remove("active");
  modalPersonalizado.classList.remove("active");
  guardarPuntaje(puntajeActual);
  mostrarPantalla(pantallaGameOver);
}

function mostrarRanking() {
    fetch('ranking_handler.php?accion=obtener')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            tablaRankingBody.innerHTML = '';
            if (data.error) {
                console.error('Error del servidor:', data.error);
                tablaRankingBody.innerHTML = '<tr><td colspan="2">No se pudo cargar el ranking.</td></tr>';
                return;
            }
            if (data.length === 0) {
                tablaRankingBody.innerHTML = '<tr><td colspan="2">Aún no hay puntajes. ¡Sé el primero!</td></tr>';
                return;
            }
            data.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.puntaje_maximo}</td>
                `;
                tablaRankingBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al obtener el ranking:', error);
            tablaRankingBody.innerHTML = '<tr><td colspan="2">Error de conexión. Inténtalo más tarde.</td></tr>';
        });
}

function guardarPuntaje(puntaje) {
    if (puntaje <= 0) return;

    const formData = new FormData();
    formData.append('puntaje', puntaje);

    fetch('index..php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || 'Error desconocido del servidor');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor (guardado):', data);
        if (data.success) {
            mostrarModal(data.success); 
        }
    })
    .catch(error => {
        console.error('Error al guardar el puntaje:', error);
    });
}

function actualizarUI() {
  puntajeElemento.textContent = `Puntuación: ${puntajeActual}`;
  nivelElemento.textContent = `Nivel: ${nivelActual}`;
  disparosRestantesElemento.textContent = `Disparos: ∞ (Click para disparar)`;
}

function mostrarIndicadorNivel(nivel) {
  indicadorNivel.textContent = `Nivel ${nivel}`;
  indicadorNivel.classList.add("active");
  setTimeout(() => {
    indicadorNivel.classList.remove("active");
  }, 2000);
}

function alternarPausa() {
  // No permitir pausa manual durante preguntas
  if (pausaPorPregunta) return;

  enPausa = !enPausa;
  if (enPausa) {
    clearInterval(intervaloJuego);
    mostrarPantalla(pantallaPausa);
    pantallaPregunta.classList.remove("active");
  } else {
    intervaloJuego = setInterval(bucleJuego, 1000 / 60);
    mostrarPantalla(document.getElementById("ui-juego"));
    if (faseJuego === "pregunta") {
      pantallaPregunta.classList.add("active");
    }
  }
}

function dibujarJugador() {
  if (imagenJugador.complete && imagenJugador.naturalHeight !== 0) {
    // La animación cicla continuamente a través de los 4 fotogramas
    let sx = frameActualJugador * anchoJugador;
    let sy = 0;
    ctx.drawImage(
      imagenJugador,
      sx,
      sy,
      anchoJugador,
      altoJugador,
      jugadorX,
      jugadorY,
      anchoJugador,
      altoJugador
    );
  } else {
    // Fallback si la imagen no carga
    ctx.fillStyle = "blue";
    ctx.fillRect(jugadorX, jugadorY, anchoJugador, altoJugador);
  }
}

function dibujarProyectiles() {
  proyectiles.forEach((p) => {
    if (imagenDisparo.complete && imagenDisparo.naturalHeight !== 0) {
      ctx.drawImage(imagenDisparo, p.x, p.y, anchoDisparo, altoDisparo);
    } else {
      ctx.fillStyle = "red";
      ctx.fillRect(p.x, p.y, anchoDisparo, altoDisparo);
    }
  });
}

function dibujarObstaculos() {
  obstaculos.forEach((obstaculo) => {
    if (obstaculo.img && obstaculo.img.complete) {
      ctx.drawImage(
        obstaculo.img,
        obstaculo.x,
        obstaculo.y,
        obstaculo.width,
        obstaculo.height
      );
    } else {
      ctx.fillStyle = "brown";
      ctx.fillRect(obstaculo.x, obstaculo.y, obstaculo.width, obstaculo.height);
    }
  });
}

function moverJugador(direccion) {
  if (faseJuego === "corriendo") {
    if (direccion === "izquierda") {
      jugadorX = Math.max(0, jugadorX - velocidadJugador);
    } else if (direccion === "derecha") {
      jugadorX = Math.min(
        lienzo.width - anchoJugador,
        jugadorX + velocidadJugador
      );
    }
  }
}

lienzo.addEventListener("click", function (e) {
  e.preventDefault();
  disparar();
});

// También permitir disparar con la barra espaciadora cuando no esté en pregunta
window.addEventListener("keydown", function (e) {
  if (e.key === " " || e.key === "Spacebar") {
    e.preventDefault();
    if (
      juegoEnCurso &&
      !enPausa &&
      faseJuego === "corriendo" &&
      !pantallaPregunta.classList.contains("active")
    ) {
      disparar();
    }
    return;
  }
  if (!juegoEnCurso || enPausa) return;
  if (e.key === "ArrowLeft") {
    moverJugador("izquierda");
  } else if (e.key === "ArrowRight") {
    moverJugador("derecha");
  }
});

botonJugar.addEventListener("click", () => {
  iniciarJuego(1);
});

botonSeleccionarNivel.addEventListener("click", () => {
  poblarPantallaSeleccionNivel();
  mostrarPantalla(pantallaSeleccionNivel);
});

botonOpciones.addEventListener("click", () =>
  mostrarPantalla(pantallaOpciones)
);
botonControles.addEventListener("click", () =>
  mostrarPantalla(pantallaControles)
);

botonesVolver.forEach((boton) => {
  boton.addEventListener("click", () => mostrarPantalla(pantallaInicio));
});

botonReiniciar.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  // Limpia todo el estado y vuelve a nivel 1
  puntajeActual = 0;
  nivelActual = 1;
  vidasJugador = 3;
  jugadorX = lienzo.width / 2 - anchoJugador / 2;
  proyectiles = [];
  objetivos = [];
  obstaculos = [];
  disparosEnFase = 0;
  obstaculosSuperadosFase = 0;
  juegoEnCurso = false;
  enPausa = false;
  pausaPorPregunta = false;
  faseJuego = "corriendo";
  preguntasRespondidasEnNivel = [];
  dioSegundaOportunidad = false;
  respuestasCorrectas = 0;
  preguntasRespondidas = 0;
  clearInterval(intervaloJuego);
  // Oculta todas las pantallas y modales
  document
    .querySelectorAll(".pantalla-juego")
    .forEach((s) => s.classList.remove("active"));
  pantallaPregunta.classList.remove("active");
  modalPersonalizado.classList.remove("active");
  mostrarPantalla(pantallaInicio);
  // Espera un pequeño tiempo y luego inicia el juego en nivel 1
  setTimeout(() => iniciarJuego(1), 100);
});

botonMenuGameOver.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  // Limpia todo el estado y muestra la pantalla de inicio
  puntajeActual = 0;
  nivelActual = 1;
  vidasJugador = 3;
  jugadorX = lienzo.width / 2 - anchoJugador / 2;
  proyectiles = [];
  objetivos = [];
  obstaculos = [];
  disparosEnFase = 0;
  obstaculosSuperadosFase = 0;
  juegoEnCurso = false;
  enPausa = false;
  pausaPorPregunta = false;
  faseJuego = "corriendo";
  preguntasRespondidasEnNivel = [];
  dioSegundaOportunidad = false;
  respuestasCorrectas = 0;
  preguntasRespondidas = 0;
  clearInterval(intervaloJuego);
  // Oculta todas las pantallas y modales
  document
    .querySelectorAll(".pantalla-juego")
    .forEach((s) => s.classList.remove("active"));
  pantallaPregunta.classList.remove("active");
  modalPersonalizado.classList.remove("active");
  mostrarPantalla(pantallaInicio);
});

botonPausa.addEventListener("click", alternarPausa);
botonContinuar.addEventListener("click", alternarPausa);
botonSalirPausa.addEventListener("click", () => {
  enPausa = false;
  clearInterval(intervaloJuego);
  mostrarPantalla(pantallaInicio);
});
botonSilenciar.addEventListener("click", () => {
  mostrarModal("La función de silenciar no está implementada.");
});

function bucleJuego() {
  if (!juegoEnCurso || enPausa) return;
  ctx.clearRect(0, 0, lienzo.width, lienzo.height);
  ctx.drawImage(imagenCarretera, 0, 0, lienzo.width, lienzo.height);
  dibujarJugador();
  dibujarProyectiles();
  dibujarObstaculos();
  // Animación del jugador (siempre activa)
  temporizadorAnimacionJugador++;
  if (temporizadorAnimacionJugador >= 60 / velocidadAnimacionJugador) {
    frameActualJugador = (frameActualJugador + 1) % totalFramesCorrer;
    temporizadorAnimacionJugador = 0;
  }
  // Obstáculos
  let ahora = Date.now();
  if (
    faseJuego === "corriendo" &&
    ahora - ultimoTiempoObstaculo > retardoAparicionObstaculo
  ) {
    generarObstaculo();
    ultimoTiempoObstaculo = ahora;
  }
  // Mover obstáculos
  for (let i = obstaculos.length - 1; i >= 0; i--) {
    obstaculos[i].y += velocidadObstaculo;
    // Colisión con jugador
    if (
      obstaculos[i].x < jugadorX + anchoJugador &&
      obstaculos[i].x + obstaculos[i].width > jugadorX &&
      obstaculos[i].y < jugadorY + altoJugador &&
      obstaculos[i].y + obstaculos[i].height > jugadorY
    ) {
      terminarJuego("¡Te chocaste con un obstáculo!");
      return;
    }
    // Fuera de pantalla
    if (obstaculos[i].y > lienzo.height) {
      obstaculos.splice(i, 1);
    }
  }

  // Lógica de progresión basada en puntos por nivel
  const umbralesDelNivel = puntosParaPreguntaPorNivel[nivelActual];
  if (indiceProximoPuntoDePregunta < umbralesDelNivel.length) {
    if (puntajeActual >= umbralesDelNivel[indiceProximoPuntoDePregunta]) {
      faseJuego = "pregunta";
      mostrarPregunta();
      indiceProximoPuntoDePregunta++; // Avanza al siguiente umbral
      return; // Salir del bucle para mostrar la pregunta
    }
  } else {
    // Si ya se superaron todos los umbrales de este nivel, pasa al siguiente
    if (nivelActual < 3) {
      mostrarPantallaNivelCompletado();
    } else {
      mostrarPantallaGanaste();
    }
  }
  // Mover proyectiles
  for (let i = proyectiles.length - 1; i >= 0; i--) {
    proyectiles[i].y -= velocidadProyectil;
    if (proyectiles[i].y < 0) {
      proyectiles.splice(i, 1);
      continue;
    }
    // Colisión con obstáculos
    for (let j = obstaculos.length - 1; j >= 0; j--) {
      if (
        proyectiles[i] &&
        proyectiles[i].x < obstaculos[j].x + obstaculos[j].width &&
        proyectiles[i].x + 5 > obstaculos[j].x &&
        proyectiles[i].y < obstaculos[j].y + obstaculos[j].height &&
        proyectiles[i].y + 10 > obstaculos[j].y
      ) {
        obstaculos.splice(j, 1);
        proyectiles.splice(i, 1);
        puntajeActual += 10 * nivelActual;
        obstaculosSuperadosFase++;
        actualizarUI();
        // ¿Mostrar pregunta?
        if (obstaculosSuperadosFase % aciertosParaPregunta === 0) {
          faseJuego = "pregunta";
          mostrarPregunta();
          return; // Salir del bucle para mostrar la pregunta
        }
        break;
      }
    }
  }
}

function disparar() {
  // Condiciones para permitir disparar
  if (!juegoEnCurso) return;
  if (pantallaPregunta.classList.contains("active")) return;
  if (pantallaGameOver.classList.contains("active")) return;
  if (enPausa) return;
  if (faseJuego !== "corriendo") return;

  proyectiles.push({
    x: jugadorX + anchoJugador / 2 - anchoDisparo / 2,
    y: jugadorY,
  });

  // Crear y reproducir un nuevo objeto de audio para cada disparo
  // Esto permite que los sonidos se superpongan si se dispara rápidamente
  const sonidoDisparo = new Audio('audios/sonido_juego.mp3');
  const volumenSonido = document.getElementById('volumen-sonido');
  sonidoDisparo.volume = volumenSonido.value;
  sonidoDisparo.play();

  // Ya no se necesita 'estaDisparando' para la animación
}

function generarObstaculo() {
  let img = new Image();
  img.src =
    imagenesObstaculo[Math.floor(Math.random() * imagenesObstaculo.length)];
  let width = 60,
    height = 60;
  let x = Math.random() * (lienzo.width - width);
  obstaculos.push({ x, y: -height, width, height, img });
}

function mostrarPregunta() {
  // Seleccionar pregunta del nivel
  let preguntasNivel = preguntasArray.filter(
    (p) =>
      p.nivel_id === nivelActual &&
      !preguntasRespondidasEnNivel.includes(p.pregunta_id)
  );
  
  if (preguntasNivel.length === 0) {
    faseJuego = "corriendo";
    return;
  }

  pausaPorPregunta = true;
  enPausa = true;
  clearInterval(intervaloJuego);
  preguntaActual = preguntasNivel[0];
  preguntasRespondidasEnNivel.push(preguntaActual.pregunta_id);
  pantallaPregunta.innerHTML = `<div style='background:#fff;padding:20px;border-radius:10px;max-width:400px;margin:0 auto;'>
        <h3>${preguntaActual.pregunta}</h3>
        ${preguntaActual.opciones
          .map(
            (op, idx) =>
              `<button class='boton-opcion' data-op='${op}' style='margin:5px 0;width:100%;'>${op}</button>`
          )
          .join("")}
    </div>`;
  pantallaPregunta.classList.add("active");
  document.querySelectorAll(".boton-opcion").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      document
        .querySelectorAll(".boton-opcion")
        .forEach((b) => (b.disabled = true));

      if (this.getAttribute("data-op") === preguntaActual.respuesta_correcta) {
        puntajeActual += preguntaActual.puntos;
        respuestasCorrectas++;
        preguntasRespondidas++;
        actualizarUI();

        pausaPorPregunta = false;
        enPausa = false;
        faseJuego = "corriendo";

        pantallaPregunta.classList.remove("active");

        mostrarModal(
          "¡Correcto! +" + preguntaActual.puntos + " puntos. ¡Sigue disparando!"
        );

        intervaloJuego = setInterval(bucleJuego, 1000 / 60);
      } else {
        pausaPorPregunta = false;
        enPausa = false;
        pantallaPregunta.classList.remove("active");

        mostrarModal("Incorrecto");
        setTimeout(() => {
          terminarJuego("¡Respuesta incorrecta! Has perdido.");
        }, 1200);
      }
    });
  });
}

function mostrarPantallaNivelCompletado() {
  juegoEnCurso = false;
  clearInterval(intervaloJuego);
  tituloNivelCompletado.textContent = `¡Nivel ${nivelActual} Completado!`;
  puntajeNivelCompletado.textContent = `Puntaje: ${puntajeActual}`;
  botonSiguienteNivel.textContent = `Comenzar Nivel ${nivelActual + 1}`;
  mostrarPantalla(pantallaNivelCompletado);
}

function mostrarPantallaGanaste() {
  juegoEnCurso = false;
  clearInterval(intervaloJuego);
  puntajeFinalGanaste.textContent = `Puntaje Final: ${puntajeActual}`;
  mostrarPantalla(pantallaGanaste);
}

botonSiguienteNivel.addEventListener("click", () => {
  nivelActual++;
  if (nivelActual > nivelesDesbloqueados) {
    nivelesDesbloqueados = nivelActual;
  }
  indiceProximoPuntoDePregunta = 0; 
  juegoEnCurso = true;
  faseJuego = "corriendo";
  enPausa = false;
  pausaPorPregunta = false;
  proyectiles = [];
  obstaculos = [];
  intervaloJuego = setInterval(bucleJuego, 1000 / 60);
  mostrarPantalla(document.getElementById("ui-juego"));
  lienzo.style.display = "block";
  cargarConfiguracionNivel(nivelActual);
  mostrarIndicadorNivel(nivelActual);
});

botonJugarDeNuevo.addEventListener("click", () => {
  iniciarJuego(1); 
});

function poblarPantallaSeleccionNivel() {
  contenedorBotonesNivel.innerHTML = ""; 
  const totalNiveles = configuracionNivel.length; 

  for (let i = 1; i <= totalNiveles; i++) {
    const iconoNivel = document.createElement("div");
    iconoNivel.textContent = i;
    iconoNivel.classList.add("nivel-icono");

    if (i <= nivelesDesbloqueados) {
      iconoNivel.classList.add("desbloqueado");
      iconoNivel.addEventListener("click", () => {
        iniciarJuego(i);
      });
    } else {
      iconoNivel.classList.add("bloqueado");
    }

    iconoNivel.style.animationDelay = `${(i - 1) * 0.2}s`;

    contenedorBotonesNivel.appendChild(iconoNivel);
  }
}

function cargarConfiguracionNivel(nivel) {
  const config = configuracionNivel[nivel - 1];
  if (config && config.imagenCarretera) {
    imagenCarretera.src = config.imagenCarretera;
  }
  velocidadObstaculo = config.velocidadObstaculo;
  retardoAparicionObstaculo = config.retardoAparicionObstaculo;
}


function precargarImagenes(urls, callback) {
  let cargadas = 0;
  const total = urls.length;
  urls.forEach((url) => {
    const img = new Image();
    img.src = url;
    img.onload = img.onerror = () => {
      cargadas++;
      if (cargadas === total) {
        callback();
      }
    };
  });
}

document.addEventListener("DOMContentLoaded", () => {
    activarControlesTactiles(); 

    if (document.body.classList.contains('mobile')) {
        lienzo.width = window.innerWidth;
        lienzo.height = window.innerHeight;
    } else {
        lienzo.width = 800;
        lienzo.height = 600;
    }
    lienzo.style.display = "none";

    const urlsImagenes = [
        "mun2.png",
        "socket.png",
        ...imagenesObstaculo,
        ...configuracionNivel.map((c) => c.imagenCarretera),
    ];

    mostrarPantalla(pantallaInicio);

    botonJugar.disabled = true;
    botonJugar.textContent = "Cargando...";

    precargarImagenes(urlsImagenes, () => {
        console.log("Todas las imágenes han sido precargadas.");
        botonJugar.disabled = false;
        botonJugar.textContent = "Jugar";
    });

    const musicaMenu = document.getElementById('musica-menu');
    const sonidoJuego = document.getElementById('sonido-juego');
    const volumenMusica = document.getElementById('volumen-musica');
    const volumenSonido = document.getElementById('volumen-sonido');

    volumenMusica.addEventListener('input', (e) => {
        musicaMenu.volume = e.target.value;
    });

    volumenSonido.addEventListener('input', (e) => {
        sonidoJuego.volume = e.target.value;
    });

    // Iniciar música con la primera interacción del usuario
    document.body.addEventListener('click', () => {
        musicaMenu.play();
    }, { once: true });


    cargarConfiguracionNivel(nivelActual);
});

botonRanking.addEventListener("click", () => {
    mostrarPantalla(pantallaRanking);
});

// --- Controles Táctiles ---
function activarControlesTactiles() {
    const botonIzquierda = document.getElementById('boton-izquierda');
    const botonDerecha = document.getElementById('boton-derecha');
    const botonDisparo = document.getElementById('boton-disparo');

    if (document.body.classList.contains('mobile')) {
        botonIzquierda.addEventListener('touchstart', (e) => { 
            e.preventDefault(); 
            if(juegoEnCurso) moverJugador('izquierda'); 
        });
        botonDerecha.addEventListener('touchstart', (e) => { 
            e.preventDefault(); 
            if(juegoEnCurso) moverJugador('derecha'); 
        });
        botonDisparo.addEventListener('touchstart', (e) => { 
            e.preventDefault(); 
            if(juegoEnCurso) disparar(); 
        });
    }
}