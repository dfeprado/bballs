const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const button = document.querySelector('button');

let balls = [];

function random(min, max) {
    const num = Math.floor(Math.random()*(max-min)) + min;
    return num;
}

class Ball {
    constructor (x, y, velX, velY, color, size) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
        if (this.x + this.size >= width) {
            this.velX = -(this.velX);
        }

        if (this.x - this.size <= 0) {
            this.velX = -(this.velX);
        }

        if (this.y + this.size >= height) {
            this.velY = -(this.velY);
        }

        if (this.y - this.size <= 0) {
            this.velY = -(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect() {
        balls.forEach((ball) => {
            if (this !== ball) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    this.color = `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
                    // this.velY = -(this.velY);
                    // this.velX = -(this.velX);
                }
            }
        });
    }
}

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    balls.forEach((ball) => {
        ball.draw();
        ball.update();
        ball.collisionDetect();
    });

    requestAnimationFrame(loop);
}

button.addEventListener('click', (evt) => {
    evt.target.style.display = 'none';
    loop();
});

while (balls.length < 25) {
    let size = random(10, 20);
    let ball = new Ball(
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`,
        size
    );

    balls.push(ball);
}