class Star {
    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rChange = 0.05;
        this.color = color;
        this.hasStar = Math.random() > 0.3;
    }
    static context;
    static C_WIDTH;
    static C_HEIGHT;
    static arrStars = [];

    static randColor() {
        const arrColors = ["ffffff", "ffecd3", "bfcfff"];
        return "#" + arrColors[Math.floor((Math.random() * 3))];
    }

    static initAllStars() {
        const canvas = document.getElementById("starContainer");
        this.context = canvas.getContext("2d");

        this.C_WIDTH = canvas.width = document.body.offsetWidth;
        this.C_HEIGHT = canvas.height = document.body.offsetHeight;

        for (let i = 0; i < 400; i++) {
            const randX = Math.floor((Math.random() * this.C_WIDTH) + 1);
            const randY = Math.floor((Math.random() * this.C_HEIGHT) + 1);
            const randR = Math.random() * 1.7 + .5;

            const star = new Star(randX, randY, randR, this.randColor());
            this.arrStars.push(star);
        }
    }

    static updateAllStars() {
        for (let i = 0; i < this.arrStars.length; i++) {
            this.arrStars[i].update();
        }
    }

    static animateAllStars() {
        Star.updateAllStars();
        //context.fillStyle = 'rgba(255, 255, 255, .1)';
        //context.fillRect(0,0,C_WIDTH,C_HEIGHT);
        Star.context.clearRect(0, 0, Star.C_WIDTH, Star.C_HEIGHT);
        for (let i = 0; i < Star.arrStars.length; i++) {
            Star.arrStars[i].render();
        }
        requestAnimationFrame(Star.animateAllStars);
    }

    opacityScale(val) {
        const rDomain = [0.75, 2.05];
        const opacityRange = [0, 1];
        return (val - rDomain[0]) / (rDomain[1] - rDomain[0]);
    }

    render() {
        const fill = 'rgba(255, 255, 255, ' + this.opacityScale(this.r) + ')';
        this.drawHolo(fill);
        if (this.hasStar) {
            this.drawStar(4, this.r * 3, this.r / 3, fill);
        }
    }
    update() {
        if (this.r > 2 || this.r < .8) {
            this.rChange = -this.rChange;
        }
        this.r += this.rChange;
    }

    drawHolo(fill) {
        Star.context.beginPath();
        Star.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        Star.context.shadowBlur = 8;
        Star.context.shadowColor = "white";
        Star.context.fillStyle = fill;
        // Star.context.fillStyle = this.color;
        Star.context.fill();
    }

    drawStar(points, outer, inner, fill) {
        // define the star
        Star.context.beginPath();
        Star.context.moveTo(this.x, this.y + outer);
        for (var i = 0; i < 2 * points + 1; i++) {
            var r = (i % 2 == 0) ? outer : inner;
            var a = Math.PI * i / points;
            Star.context.lineTo(this.x + r * Math.sin(a), this.y + r * Math.cos(a));
        };
        Star.context.closePath();
        // draw
        Star.context.fillStyle = fill;
        Star.context.fill();
    }
}