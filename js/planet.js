class Planet {
    static sceneRangeX = 2000;
    static sceneRangeY = 2000;
    static sceneRangeZ = 5000;
    static ringPadding = 12;
    static heartSpeed = 2;
    static heartDelay = 20;
    static heartOpacitySpeed = 0.01;
    static ringRange = [1, 5];
    static planets = [];
    static targetPosis = [];
    static popUpRatio = 0;
    static musicHzNum = 128;
    static scaleRing(val, domain) {
        return Planet.ringRange[0] + ((val - domain[0]) / (domain[1] - domain[0])) * (Planet.ringRange[1] - Planet.ringRange[0]);
    }
    // static generateTargetPosi() {
    //     for (var i = 0; i < this.planets.length; i++) {
    //         var object = new THREE.Object3D();
    //         object.position.x = Math.random() * 3000 - 1500;
    //         object.position.y = Math.random() * 3000 - 1500;
    //         object.position.z = Math.random() * 3000 - 1500;
    //         this.targetPosis.push(object);
    //     }
    // }
    static transform() {
        TWEEN.removeAll();
        // for (var i = 0; i < this.planets.length; i++) {
        //     var object = this.planets[i];
        //     var target = this.targetPosis[i];

        //     new TWEEN.Tween(object.position)
        //         .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
        //         .easing(TWEEN.Easing.Linear.None)
        //         .start();

        //     new TWEEN.Tween(object.rotation)
        //         .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
        //         .easing(TWEEN.Easing.Linear.None)
        //         .start();
        // }

        new TWEEN.Tween(this)
            .to({}, 10 * 2)
            .onUpdate(render)
            .start();
    }

    static shuffle(array) {
        var tmp, current, top = array.length;
        if (top) while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
        return array;
    }

    static updateAllPlanets(like) {
        let count = 0, likeCount = 0;
        const numLike = Math.floor(Math.random() * 5);
        this.planets = this.shuffle(this.planets);
        this.planets.forEach(p => {
            p.updatePosition();
            count++;
            if (count <= Planet.planets.length * Planet.popUpRatio) {
                const tmpBubble = new Bubble(
                    p.x,
                    p.y,
                    p.z - 100,
                    Math.random() * p.size / 4 + p.size / 4,
                    { r: 255, g: 255, b: 255 },
                    0.5,
                    Math.floor(Math.random() * 30),
                    p.scene);
                tmpBubble.init();
            }
            if (likeCount < numLike && like) {
                p.creatingHeart = true;
            }
            likeCount++;
        })
    }

    static updateAllPlanetsColor() {
        this.planets.forEach(p => {
            p.planetDiv.classList.toggle('cold-element');
            p.planetDiv.classList.toggle('hot-element');
        })
    }

    constructor(scene, data, size, initCoords) {
        this.scene = scene;
        this.data = data;
        this.size = size;
        this.x = initCoords.x;
        this.y = initCoords.y;
        this.z = initCoords.z;
        this.hearts = [];
        this.heartSpans = [];
        this.planetDiv;
        this.planetObj;
        this.creatingHeart = false;
        this.heartNum = 0;
        this.heartDelay = Planet.heartDelay;
        this.maxHeartNum = Math.floor(Math.random() * 3 + 5);
        this.xSpeed = (Math.random() * 0.5 + 0.2) * (Math.random() >= 0.5 ? 1 : -1);
        this.ySpeed = (Math.random() * 0.5 + 0.2) * (Math.random() >= 0.5 ? 1 : -1);
        this.zSpeed = (Math.random() * 0.5 + 0.2) * (Math.random() >= 0.5 ? 1 : -1);
        this.musicCanvas;
        this.musicCanvasObj;
    }

    createRing(dataVal, className, domain, extraPadding) {
        const ring = document.createElement('div');
        ring.className = className;
        const borderW = Planet.scaleRing(dataVal, domain);
        ring.style.width = (this.size + Planet.ringPadding * 2 + borderW + extraPadding) + 'px';
        ring.style.height = (this.size + Planet.ringPadding * 2 + borderW + extraPadding) + 'px';
        ring.style.borderWidth = borderW + 'px';
        return [ring, borderW];
    }

    createRingObj(ringDom, rx = 0, ry = 0, rz = 0) {
        const ringObj = new THREE.CSS3DObject(ringDom);
        ringObj.position.x = 0;
        ringObj.position.y = 0;
        ringObj.position.z = 0;
        ringObj.rotation.x = rx;
        ringObj.rotation.y = ry;
        ringObj.rotation.z = rz;
        return ringObj;
    }

    randAngle() {
        return Math.random() * Math.PI * 2;
    }

    createMusicCanvas() {
        const padding = 30, innerCircleStroke = 12, tmpBgBarWidth = 160;
        this.musicCanvas = document.createElement('canvas');
        const cSize = this.size + padding * 4 + innerCircleStroke * 2 + tmpBgBarWidth * 2;
        this.musicCanvas.width = cSize;
        this.musicCanvas.height = cSize;
        const ctx = this.musicCanvas.getContext('2d');

        const grad1 = ctx.createLinearGradient(0, 0, cSize, cSize);
        grad1.addColorStop(0, "#16b7ed00");
        grad1.addColorStop(0.25, "#00abff22");
        grad1.addColorStop(0.5, "#2a97ff44");
        grad1.addColorStop(0.75, "#9476ff22");
        grad1.addColorStop(1, "#e12efb00");

        const grad2 = ctx.createLinearGradient(tmpBgBarWidth / 2, tmpBgBarWidth / 2, cSize - tmpBgBarWidth, cSize - tmpBgBarWidth);
        grad2.addColorStop(0, "#16b7ed");
        grad2.addColorStop(0.25, "#00abff");
        grad2.addColorStop(0.5, "#2a97ff");
        grad2.addColorStop(0.75, "#9476ff");
        grad2.addColorStop(1, "#e12efb");

        ctx.shadowColor = "#2a97ff";
        ctx.lineWidth = innerCircleStroke;
        ctx.strokeStyle = grad2;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(cSize / 2, cSize / 2, this.size / 2 + padding + innerCircleStroke / 2, 0, 2 * Math.PI);
        ctx.stroke();

        //draw background
        const innerR = this.size / 2 + padding * 2 + innerCircleStroke;
        const outterR = this.size / 2 + padding * 2 + innerCircleStroke + tmpBgBarWidth;
        const outterR2 = this.size / 2 + padding * 2 + innerCircleStroke + tmpBgBarWidth / 2;

        ctx.lineWidth = 12;
        let radStep = Math.PI * 2 / Planet.musicHzNum;
        for (let i = 0; i < Planet.musicHzNum; i++) {
            ctx.shadowBlur = 0;
            ctx.strokeStyle = grad1;
            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.moveTo(cSize / 2 + Math.cos(radStep * i) * innerR, cSize / 2 + Math.sin(radStep * i) * innerR);
            ctx.lineTo(cSize / 2 + Math.cos(radStep * i) * outterR, cSize / 2 + Math.sin(radStep * i) * outterR);
            ctx.stroke();

            ctx.shadowBlur = 20;
            ctx.strokeStyle = grad2;
            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.moveTo(cSize / 2 + Math.cos(radStep * i) * innerR, cSize / 2 + Math.sin(radStep * i) * innerR);
            ctx.lineTo(cSize / 2 + Math.cos(radStep * i) * outterR2, cSize / 2 + Math.sin(radStep * i) * outterR2);
            ctx.stroke();
        }

        this.musicCanvasObj = new THREE.CSS3DObject(this.musicCanvas);
        this.musicCanvasObj.position.x = 0;
        this.musicCanvasObj.position.y = 0;
        this.musicCanvasObj.position.z = 0;
    }

    updateMusicCanvas(vals, maxVal) {
        const padding = 30, innerCircleStroke = 12, tmpBgBarWidth = 160;
        const cSize = this.size + padding * 4 + innerCircleStroke * 2 + tmpBgBarWidth * 2;
        const ctx = this.musicCanvas.getContext('2d');
        ctx.clearRect(0, 0, cSize, cSize);

        const grad1 = ctx.createLinearGradient(0, 0, cSize, cSize);
        grad1.addColorStop(0, "#16b7ed00");
        grad1.addColorStop(0.25, "#00abff22");
        grad1.addColorStop(0.5, "#2a97ff44");
        grad1.addColorStop(0.75, "#9476ff22");
        grad1.addColorStop(1, "#e12efb00");

        const grad2 = ctx.createLinearGradient(tmpBgBarWidth / 2, tmpBgBarWidth / 2, cSize - tmpBgBarWidth, cSize - tmpBgBarWidth);
        grad2.addColorStop(0, "#16b7ed");
        grad2.addColorStop(0.25, "#00abff");
        grad2.addColorStop(0.5, "#2a97ff");
        grad2.addColorStop(0.75, "#9476ff");
        grad2.addColorStop(1, "#e12efb");

        ctx.shadowColor = "#2a97ff";
        ctx.lineWidth = innerCircleStroke;
        ctx.strokeStyle = grad2;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(cSize / 2, cSize / 2, this.size / 2 + padding + innerCircleStroke / 2, 0, 2 * Math.PI);
        ctx.stroke();

        const innerR = this.size / 2 + padding * 2 + innerCircleStroke;
        ctx.lineWidth = 12;
        let radStep = Math.PI * 2 / Planet.musicHzNum;
        for (let i = 0; i < Planet.musicHzNum; i++) {
            let barLen = vals[i] / maxVal * tmpBgBarWidth;
            if (barLen < 1) {
                barLen = 1;
            }

            const outterR = this.size / 2 + padding * 2 + innerCircleStroke + barLen;
            const outterR2 = this.size / 2 + padding * 2 + innerCircleStroke + barLen / 2;

            ctx.shadowBlur = 0;
            ctx.strokeStyle = grad1;
            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.moveTo(cSize / 2 + Math.cos(radStep * i) * innerR, cSize / 2 + Math.sin(radStep * i) * innerR);
            ctx.lineTo(cSize / 2 + Math.cos(radStep * i) * outterR, cSize / 2 + Math.sin(radStep * i) * outterR);
            ctx.stroke();

            ctx.shadowBlur = 20;
            ctx.strokeStyle = grad2;
            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.moveTo(cSize / 2 + Math.cos(radStep * i) * innerR, cSize / 2 + Math.sin(radStep * i) * innerR);
            ctx.lineTo(cSize / 2 + Math.cos(radStep * i) * outterR2, cSize / 2 + Math.sin(radStep * i) * outterR2);
            ctx.stroke();
        }
    }

    createPlanet(adding, domains, musicCanvas = false) {
        this.planetDiv = document.createElement('div');
        this.planetDiv.className = 'element cold-element';
        this.planetDiv.style.width = this.size + 'px';
        this.planetDiv.style.height = this.size + 'px';

        const [likeRing, likeBorder] = this.createRing(this.data.like, 'like-ring', domains[0], 0);
        const [commentRing, commentBorder] = this.createRing(this.data.comment, 'comment-ring', domains[1], likeBorder * 2);

        const eleObj = this.createRingObj(this.planetDiv);
        // const likeRingObj = this.createRingObj(likeRing, this.randAngle(), this.randAngle(), this.randAngle());
        // const commentRingObj = this.createRingObj(commentRing, this.randAngle(), this.randAngle(), this.randAngle());

        this.planetObj = new THREE.Group();
        this.planetObj.position.x = this.x;
        this.planetObj.position.y = this.x;
        this.planetObj.position.z = this.x;

        if (musicCanvas) {
            this.createMusicCanvas();
            this.planetObj.add(this.musicCanvasObj);
        }

        this.planetObj.add(eleObj);
        // this.planetObj.add(likeRingObj);
        // this.planetObj.add(commentRingObj);

        this.scene.add(this.planetObj);
        if (adding) {
            Planet.planets.push(this);
        }
    }

    updatePosition() {
        if (Math.abs(this.planetObj.position.x) > Planet.sceneRangeX / 2) {
            this.xSpeed *= -1;
        }
        if (Math.abs(this.planetObj.position.y) > Planet.sceneRangeY / 2) {
            this.ySpeed *= -1;
        }
        if (Math.abs(this.planetObj.position.z) > Planet.sceneRangeZ / 2) {
            this.zSpeed *= -1;
        }
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.z += this.zSpeed;
        this.planetObj.position.x = this.x;
        this.planetObj.position.y = this.y;
        this.planetObj.position.z = this.z;
        if (this.creatingHeart) {
            if (this.heartDelay > 0) {
                this.heartDelay--;
            } else {
                if (this.heartNum >= this.maxHeartNum) {
                    this.heartNum = 0;
                    this.creatingHeart = false;
                } else {
                    this.createHeart();
                }
            }
        }

        if (this.hearts.length > 0) {
            const that = this;
            const removeIdx = [];
            this.hearts.forEach((h, i) => {
                h.position.y += Planet.heartSpeed;
                h.position.x += Math.random() * 2 - 1;
                const targetOpacity = parseFloat(that.heartSpans[i].style.opacity) - Planet.heartOpacitySpeed;
                that.heartSpans[i].style.opacity = targetOpacity;
                if (targetOpacity <= 0) {
                    that.scene.remove(h);
                    removeIdx.push(i);
                }
            })
            removeIdx.reverse().forEach(idx => {
                that.heartSpans.splice(idx, 1);
                that.hearts.splice(idx, 1);
            })
        }
    }

    createHeart() {
        const heartSpan = document.createElement('span');
        heartSpan.className = 'heart';
        heartSpan.style.opacity = 1;
        const fontSize = Math.random() * 3 + 2;
        heartSpan.style.fontSize = fontSize + 'em';
        const heartObj = new THREE.CSS3DObject(heartSpan);
        heartObj.position.x = this.x;
        heartObj.position.y = this.y;
        heartObj.position.z = this.z;
        this.heartSpans.push(heartSpan);
        this.hearts.push(heartObj);
        this.scene.add(heartObj);
        this.heartNum++;
        this.heartDelay = Planet.heartDelay;
    }
}