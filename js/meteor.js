class Meteor {
    static sceneRangeX = 6000;
    static sceneRangeY = 4000;
    static sceneRangeZ = 2000;
    static meteors = [];

    static updateAll() {
        const removeIdx = [];
        this.meteors.forEach((m, i) => {
            const remove = m.update();
            if (remove) {
                removeIdx.push(i);
            }
        })
        const that = this;
        removeIdx.reverse().forEach(idx => {
            that.meteors.splice(idx, 1);
        })
    }
    constructor(scene) {
        this.x = Math.random() * Meteor.sceneRangeX - Meteor.sceneRangeX / 2;
        this.y = Meteor.sceneRangeY / 2;
        this.z = Math.random() * Meteor.sceneRangeZ / 2 - Meteor.sceneRangeZ / 2;
        this.len = Math.random() * 250 + 100;
        this.speed = -Math.random() * 30 - 10;
        this.star;
        this.starObj;
        this.tail;
        this.tailObj;
        this.group;
        this.scene = scene;
    }
    init() {
        this.star = document.createElement('div');
        this.star.className = 'meteor-star';
        this.tail = document.createElement('div');
        this.tail.style.width = this.len + 'px';
        this.tail.className = 'meteor-tail';
        this.starObj = new THREE.CSS3DObject(this.star);
        this.starObj.position.x = -this.len / 2;
        this.tailObj = new THREE.CSS3DObject(this.tail);
        this.group = new THREE.Group();
        this.group.position.x = this.x;
        this.group.position.y = this.y;
        this.group.position.z = this.z;
        this.group.rotation.z = Math.PI / 4;
        this.group.add(this.starObj);
        this.group.add(this.tailObj);
        this.scene.add(this.group);
        Meteor.meteors.push(this);
    }
    update() {
        this.group.position.x += this.speed;
        this.group.position.y += this.speed;
        if (this.group.position.x < -Meteor.sceneRangeX) {
            return true;
        }
        return false;
    }
}