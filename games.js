// Configuración del canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Colisión con la parte superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX; // Cambia dirección al resetear
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, color, isPlayerControlled = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 5;
    }

    draw() {
        let gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#10c20a'); // Rojo en la parte superior
        gradient.addColorStop(1, '#e00202'); // Naranja en la parte inferior
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game (Control del juego)
class Game {
    constructor() {
        // Añadimos múltiples pelotas con diferentes tamaños y colores
        this.balls = [
            new Ball(canvas.width / 2, canvas.height / 2, 15, '#00FFFF', 4, 4), // Pelota celeste
            new Ball(canvas.width / 2, canvas.height / 2, 10, '#FFA500', 3, 3), // Pelota naranja
            new Ball(canvas.width / 2, canvas.height / 2, 8, '#0000FF', 2, 2),  // Pelota azul
            new Ball(canvas.width / 2, canvas.height / 2, 50, '#808080', 5, 5),  // Pelota gris
            new Ball(canvas.width / 2, canvas.height / 2, 20, '#ffffff', 8, 8)  // Pelota blanca
        ];
        this.paddle1 = new Paddle(10, (canvas.height / 2) - (150 / 2), 10, 250, '', true); // Paleta 1
        this.paddle2 = new Paddle(canvas.width - 10 - 10, (canvas.height / 2) - (150 / 2), 10, 250, ''); // Paleta 2
        this.keys = {}; // Captura de teclas
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas

        // Dibujamos todas las pelotas
        this.balls.forEach(ball => ball.draw());
        
        // Dibujamos las paletas
        this.paddle1.draw();
        this.paddle2.draw();
    }

    update() {
        // Movemos todas las pelotas
        this.balls.forEach(ball => {
            ball.move();

            // Colisiones con las paletas
            if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height) {
                ball.speedX = -ball.speedX;
            }

            if (ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height) {
                ball.speedX = -ball.speedX;
            }

            // Detectar cuando la pelota sale de los bordes
            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
                ball.reset();
            }
        });

        // Movimiento de la paleta 1 (Jugador)
        if (this.keys['ArrowUp']) {
            this.paddle1.move('up');
        }
        if (this.keys['ArrowDown']) {
            this.paddle1.move('down');
        }

        // Movimiento de la paleta 2 (IA)
        this.paddle2.autoMove(this.balls[0]); // La IA sigue la primera pelota
    }

    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });
        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Crear y ejecutar el juego
const game = new Game();
game.run();
