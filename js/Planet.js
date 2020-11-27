class Planet {
    static ringPadding = 12;
    static ringRange = [1, 5];
    static planets = [];
    static targetPosis = [];
    static scaleRing(val, domain) {
        return Planet.ringRange[0] + ((val - domain[0]) / (domain[1] - domain[0])) * (Planet.ringRange[1] - Planet.ringRange[0]);
    }
    static generateTargetPosi() {
        for (var i = 0; i < this.planets.length; i++) {
            var object = new THREE.Object3D();
            object.position.x = Math.random() * 3000 - 1500;
            object.position.y = Math.random() * 3000 - 1500;
            object.position.z = Math.random() * 3000 - 1500;
            this.targetPosis.push(object);
        }
    }
    static transformTargetPosis(duration) {
        TWEEN.removeAll();
        for (var i = 0; i < this.planets.length; i++) {
            var object = this.planets[i];
            var target = this.targetPosis[i];

            new TWEEN.Tween(object.position)
                .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Linear.None)
                .start();

            new TWEEN.Tween(object.rotation)
                .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
                .easing(TWEEN.Easing.Linear.None)
                .start();
        }

        new TWEEN.Tween(this)
            .to({}, duration * 2)
            .onUpdate(render)
            .start();
    }

    constructor(scene, data, size, initCoords) {
        console.log('data', data);
        this.scene = scene;
        this.data = data;
        this.size = size;
        this.initCoords = initCoords;
        this.planetObj;
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

    createRingObj(ringDom, x, y, z, rx = 0, ry = 0, rz = 0) {
        const ringObj = new THREE.CSS3DObject(ringDom);
        ringObj.position.x = x;
        ringObj.position.y = y;
        ringObj.position.z = z;
        ringObj.rotation.x = rx;
        ringObj.rotation.y = ry;
        ringObj.rotation.z = rz;
        return ringObj;
    }

    randAngle() {
        return Math.random() * Math.PI * 2;
    }

    createPlanet(adding, domains) {
        const element = document.createElement('div');
        element.className = 'element';
        element.style.width = this.size + 'px';
        element.style.height = this.size + 'px';

        const [likeRing, likeBorder] = this.createRing(this.data.like, 'like-ring', domains[0], 0);
        const [commentRing, commentBorder] = this.createRing(this.data.comment, 'comment-ring', domains[1], likeBorder * 2);

        const x = this.initCoords.x;
        const y = this.initCoords.y;
        const z = this.initCoords.z;

        const eleObj = this.createRingObj(element, x, y, z);
        const likeRingObj = this.createRingObj(likeRing, x, y, z, this.randAngle(), this.randAngle(), this.randAngle());
        const commentRingObj = this.createRingObj(commentRing, x, y, z, this.randAngle(), this.randAngle(), this.randAngle());

        this.planetObj = new THREE.Group();
        this.planetObj.add(eleObj);
        this.planetObj.add(likeRingObj);
        this.planetObj.add(commentRingObj);

        this.scene.add(this.planetObj);
        if (adding) {
            Planet.planets.push(this.planetObj);
        }
    }
}