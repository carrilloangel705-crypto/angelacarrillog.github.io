(function() {
    function initGame() {
        const canvas = document.getElementById("zombie-canvas");
        const gameOverOverlay = document.getElementById("game-over-overlay");
        const finalScoreElement = document.getElementById("final-score");
        const restartButton = document.getElementById("restart-btn");
        const skipButton = document.getElementById("skip-btn");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const ENTITY_SIZE = 25;
        const BULLET_SPEED = 10;
        const ZOMBIE_SPEED_BASE = 0.5;
        const GROUND_OFFSET = 15;
        const MAX_ZOMBIES = 10;
        const SPAWN_RATE = 1500;

        let player = { x: 0, y: 0, w: ENTITY_SIZE, h: ENTITY_SIZE, color: "#e74c3c", direction: 'right' };
        let bullets = [];
        let zombies = [];
        let score = 0;
        let keys = {};
        let isRunning = true;
        let lastZombieTime = 0;
        let animationFrameId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            player.y = canvas.height - player.h - GROUND_OFFSET;
            if (player.x > canvas.width - player.w) {
                player.x = canvas.width - player.w;
            }
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = player.color;
            ctx.fillRect(player.x, player.y, player.w, player.h);
            ctx.fillStyle = "white";
            if (player.direction === 'right') {
                ctx.beginPath();
                ctx.moveTo(player.x + player.w, player.y + player.h / 2);
                ctx.lineTo(player.x + player.w - 8, player.y + player.h / 2 - 5);
                ctx.lineTo(player.x + player.w - 8, player.y + player.h / 2 + 5);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.moveTo(player.x, player.y + player.h / 2);
                ctx.lineTo(player.x + 8, player.y + player.h / 2 - 5);
                ctx.lineTo(player.x + 8, player.y + player.h / 2 + 5);
                ctx.fill();
            }

            bullets.forEach(b => {
                ctx.fillStyle = "#f1c40f";
                ctx.fillRect(b.x, b.y, b.w, b.h);
            });

            zombies.forEach(z => {
                ctx.fillStyle = "#2ecc71";
                ctx.fillRect(z.x, z.y, z.w, z.h);
            });
        }

        function update() {
            if (!isRunning) return;

            const playerSpeed = 5;
            if (keys['ArrowLeft'] && player.x > 0) {
                player.x -= playerSpeed;
                player.direction = 'left';
            }
            if (keys['ArrowRight'] && player.x < canvas.width - player.w) {
                player.x += playerSpeed;
                player.direction = 'right';
            }

            bullets = bullets.filter(b => {
                b.x += b.direction === 'right' ? BULLET_SPEED : -BULLET_SPEED;
                return b.x > -10 && b.x < canvas.width + 10;
            });

            zombies = zombies.filter(z => {
                if (player.x > z.x) {
                    z.x += z.speed;
                } else if (player.x < z.x) {
                    z.x -= z.speed;
                }

                if (
                    player.x < z.x + z.w &&
                    player.x + player.w > z.x &&
                    player.y < z.y + z.h &&
                    player.y + player.h > z.y
                ) {
                    pauseGame();
                    return true;
                }

                for (let i = 0; i < bullets.length; i++) {
                    const b = bullets[i];
                    if (
                        b.x < z.x + z.w &&
                        b.x + b.w > z.x &&
                        b.y < z.y + z.h &&
                        b.y + b.h > z.y
                    ) {
                        bullets.splice(i, 1);
                        score += 100;
                        return false;
                    }
                }
                return true;
            });
        }

        function spawnZombie(currentTime) {
            if (!isRunning) return;
            if (currentTime - lastZombieTime > SPAWN_RATE && zombies.length < MAX_ZOMBIES) {
                lastZombieTime = currentTime;
                const side = Math.random() < 0.5 ? 'left' : 'right';
                const x = side === 'left' ? -ENTITY_SIZE : canvas.width + ENTITY_SIZE;
                const newZombie = {
                    x: x,
                    y: canvas.height - ENTITY_SIZE - GROUND_OFFSET,
                    w: ENTITY_SIZE,
                    h: ENTITY_SIZE,
                    speed: ZOMBIE_SPEED_BASE + Math.random() * 0.5,
                    color: "#2ecc71"
                };
                zombies.push(newZombie);
            }
        }

        let lastShotTime = 0;
        const shotCooldown = 200;
        function shoot(direction) {
            if (!isRunning) return;
            const currentTime = Date.now();
            if (currentTime - lastShotTime < shotCooldown) return;
            lastShotTime = currentTime;
            let bulletX = player.x + player.w / 2;
            if (direction === 'right') {
                bulletX = player.x + player.w;
            } else if (direction === 'left') {
                bulletX = player.x - 10;
            }
            const newBullet = {
                x: bulletX,
                y: player.y + player.h / 2 - 2,
                w: 10,
                h: 4,
                direction: direction
            };
            bullets.push(newBullet);
        }

        function loop(currentTime) {
            if (isRunning) {
                update();
                spawnZombie(currentTime);
                const currentScoreElement = document.getElementById("current-score");
                if (currentScoreElement) {
                    currentScoreElement.textContent = score;
                }
            }
            draw();
            animationFrameId = requestAnimationFrame(loop);
        }

        function pauseGame() {
            isRunning = false;
            finalScoreElement.textContent = score;
            gameOverOverlay.classList.add('active');
        }

        function resetGame() {
            isRunning = true;
            player.x = 50;
            player.direction = 'right';
            bullets = [];
            zombies = [];
            score = 0;
            gameOverOverlay.classList.remove('active');
            resizeCanvas();
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(loop);
            }
        }

        function skipGame() {
            if (!isRunning) {
                gameOverOverlay.classList.remove('active');
            }
        }

        document.addEventListener('keydown', (e) => {
            keys[e.key] = true;
            if (e.key === 'Enter') {
                e.preventDefault();
                shoot('right');
            }
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                shoot('left');
            }
            if (e.key === 'r' || e.key === 'R') {
                resetGame();
            }
            if (e.key === 'Escape') {
                skipGame();
            }
        });

        document.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });

        restartButton.addEventListener('click', () => {
            resetGame();
        });
        skipButton.addEventListener('click', () => {
            skipGame();
        });

        document.querySelectorAll('nav a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        resetGame();
    }

    window.initGame = initGame;
})();