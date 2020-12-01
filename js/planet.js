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

    createPlanet(adding, domains) {
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