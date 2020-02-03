const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const button = document.querySelector('button');

let balls = [];
let evilCircle;

function random(min, max) {
    const num = Math.floor(Math.random()*(max-min)) + min;
    return num;
}

class Shape {
    constructor(x, y, velX, velY) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.exists = true;
    }
}

class EvilCircle extends Shape {
    constructor (x, y) {
        super(x, y, 20, 20);
        this.color = 'white';
        this.size = 10;
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }

    update() {
        if (this.x + this.size >= width) {
            this.x -= this.size;
        }
        if (this.x - this.size <= 0) {
            this.x += this.size;
        }

        if (this.y + this.size >= height) {
            this.y -= this.size;
        }
        if (this.y - this.size <= 0) {
            this.y += this.size;
        }
    }

    setControls() {
        let _this = this;
        window.onkeydown = function(e) {
            if (e.key == 'a') {
                _this.x -= _this.velX;
            } else if (e.key == 's') {
                _this.y += _this.velY;
            } else if (e.key == 'd') {
                _this.x += _this.velX;
            } else if (e.key == 'w') {
                _this.y -= _this.velY;
            }
        }
    }

    collisionDetect() {
        let _this = this;
        balls.forEach((ball) => {
            if (ball.exists) {
                const dx = _this.x - ball.x;
                const dy = _this.y - ball.y;
                const distance = Math.sqrt(dx*dx + dy*dy);

                if (_this.size + ball.size > distance) {
                    ball.exists = false;
                }
            }
        });
    }
}

class Ball extends Shape{
    constructor (x, y, velX, velY, color, size) {
        super(x, y, velX, velY);

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

        this.y += this.velY;
        this.x += this.velX;
    }

    collisionDetect() {
        let _this = this;
        balls.forEach((ball) => {
            if (this !== ball) {
                const dx = _this.x - ball.x;
                const dy = _this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < _this.size + ball.size) {
                    _this.color = `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
                }
            }
        });
    }
}

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    balls.forEach((ball) => {
        if (ball.exists) {
            ball.draw();
            ball.update();
            ball.collisionDetect();
        }
    });
    evilCircle.draw();
    evilCircle.update();
    evilCircle.collisionDetect();

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

evilCircle = new EvilCircle(random(0, width), random(0, height));
evilCircle.setControls();