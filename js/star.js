class Star {
    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rChange = 0.05;
        this.color = color;
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
        console.log(canvas, this.context);

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
        Star.context.beginPath();
        Star.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        Star.context.shadowBlur = 8;
        Star.context.shadowColor = "white";
        Star.context.fillStyle = 'rgba(255, 255, 255, ' + this.opacityScale(this.r) + ')';
        // Star.context.fillStyle = this.color;
        Star.context.fill();
    }
    update() {
        if (this.r > 2 || this.r < .8) {
            this.rChange = -this.rChange;
        }
        this.r += this.rChange;
    }
}