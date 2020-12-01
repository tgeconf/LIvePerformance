class Bubble {
    static sceneRangeX = 2000;
    static sceneRangeY = 2000;
    static sceneRangeZ = 5000;
    static scaleStep = 0.3;
    static opacitySpeed = 0.004;
    static bubbles = [];
    static bubbleLimit = 2000;
    static idCount = 0;

    static updateAllBubbles() {
        const removeIdx = [];
        this.bubbles.forEach((b, i) => {
            const remove = b.update();
            if (remove) {
                removeIdx.push(i);
            }
        })
        const that = this;
        removeIdx.reverse().forEach(idx => {
            that.bubbles.splice(idx, 1);
        })
    }

    constructor(x, y, z, r, color, opacity, delay, scene) {
        this.id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.delay = delay;
        this.opacity = opacity;
        this.scene = scene;
        this.xSpeed = (Math.random() * 0.5 + 1) * (Math.random() >= 0.5 ? 1 : -1);
        this.ySpeed = (Math.random() * 0.5 + 1) * (Math.random() >= 0.5 ? 1 : -1);
        this.zSpeed = (Math.random() * 0.5 + 1) * (Math.random() >= 0.5 ? 1 : -1);
        this.color = color;
        this.bubbleDiv;
        this.bubbleObj;
    }

    init() {
        const that = this;
        that.id = Bubble.idCount;
        Bubble.idCount++;
        that.bubbleDiv = document.createElement('div');
        that.bubbleDiv.className = 'bubble';
        that.bubbleDiv.style.width = (that.r * 2) + 'px';
        that.bubbleDiv.style.height = (that.r * 2) + 'px';
        that.bubbleDiv.style.background = 'rgb(' + that.color.r + ',' + that.color.g + ',' + that.color.b + ')';
        that.bubbleDiv.style.boxShadow = '0px 0px 12px rgba(' + that.color.r + ',' + that.color.g + ',' + that.color.b + ', 0.5)';
        that.bubbleDiv.style.border = '1px solid rgba(' + that.color.r + ',' + that.color.g + ',' + that.color.b + ', 0.25)';
        // that.bubbleDiv.style.opacity = 0;
        that.bubbleObj = new THREE.CSS3DObject(that.bubbleDiv);
        that.bubbleObj.position.x = that.x;
        that.bubbleObj.position.y = that.y;
        that.bubbleObj.position.z = that.z;
        that.bubbleObj.scale.x = 0;
        that.bubbleObj.scale.y = 0;
        Bubble.bubbles.push(that);
        that.scene.add(that.bubbleObj);
        that.bubbleDiv.style.opacity = that.opacity;
    }

    update() {
        if (this.delay > 0) {
            this.delay--;
        } else {
            if (Math.abs(this.bubbleObj.position.x) > Bubble.sceneRangeX / 2) {
                this.xSpeed *= -1;
            }
            if (Math.abs(this.bubbleObj.position.y) > Bubble.sceneRangeY / 2) {
                this.ySpeed *= -1;
            }
            if (Math.abs(this.bubbleObj.position.z) > Bubble.sceneRangeZ / 2) {
                this.zSpeed *= -1;
            }
            this.bubbleObj.position.x += this.xSpeed;
            this.bubbleObj.position.y += this.ySpeed;
            this.bubbleObj.position.z += this.zSpeed;

            if (this.bubbleObj.scale.x < 1) {
                this.bubbleObj.scale.x += Bubble.scaleStep;
                this.bubbleObj.scale.y += Bubble.scaleStep;
            } else {
                this.opacity -= Bubble.opacitySpeed;
                if (this.opacity < 0) {
                    this.opacity = 0;
                }
                this.bubbleDiv.style.opacity = this.opacity;
                if (this.opacity === 0) {
                    this.scene.remove(this.bubbleObj);
                    return true;
                }
            }
        }
        return false;
    }
}