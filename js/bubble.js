class Bubble {
    static sceneRangeX = 4000;
    static sceneRangeY = 3000;
    static sceneRangeZ = 2500;
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

    constructor(x, y, z, r, color, opacity, delay, scene, level, main = false) {
        this.id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.level = level;
        this.delay = delay;
        this.opacity = opacity;
        this.scene = scene;
        this.xSpeed = (Math.random() * 4 + 0.5) * (Math.random() >= 0.5 ? 1 : -1);
        this.ySpeed = (Math.random() * 4 + 0.5) * (Math.random() >= 0.5 ? 1 : -1);
        this.zSpeed = (Math.random() * 4 + 0.5) * (Math.random() >= 0.5 ? 1 : -1);
        this.color = color;
        this.bubbleDiv;
        this.bubbleObj;
        this.main = main;
        if (main) {
            this.xSpeed *= 5;
            this.ySpeed *= 5;
            this.zSpeed *= 5;
        }
    }

    init() {
        const that = this;
        that.id = Bubble.idCount;
        Bubble.idCount++;
        that.bubbleDiv = document.createElement('div');
        that.bubbleDiv.className = 'bubble';
        if (this.main) {
            that.bubbleDiv.classList.add('main-bubble');
        }
        that.bubbleDiv.style.width = (that.r * 2) + 'px';
        that.bubbleDiv.style.height = (that.r * 2) + 'px';

        let targetColor = { r: 255, g: 255, b: 255 };
        if (environment === 'cold') {
            targetColor = { r: 92, g: 176, b: 255 };
        } else if (environment === 'hot') {
            targetColor = { r: 255, g: 153, b: 0 };
        }

        if (this.main) {
            if (this.level === 0) {
                that.bubbleDiv.style.background = 'linear-gradient(to bottom, rgba(' + targetColor.r + ',' + targetColor.g + ',' + targetColor.b + ', 1), rgba(' + targetColor.r + ',' + targetColor.g + ',' + targetColor.b + ', 0.5))';
                that.bubbleDiv.style.boxShadow = '0px 0px 30px rgba(' + targetColor.r + ',' + targetColor.g + ',' + targetColor.b + ', 0.9)';
            } else {
                targetColor = { r: 192, g: 92, b: 255 };
                that.bubbleDiv.style.background = 'linear-gradient(to bottom, rgba(' + targetColor.r + ',' + targetColor.g + ',' + targetColor.b + ', 1), rgba(' + targetColor.r + ',' + targetColor.g + ',' + targetColor.b + ', 0.5))';
                that.bubbleDiv.style.boxShadow = '0px 0px 30px rgba(' + targetColor.r + ',' + targetColor.g + ',' + targetColor.b + ', 0.9)';
            }
        } else {
            that.bubbleDiv.style.background = 'linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.1))';
            that.bubbleDiv.style.boxShadow = '0px 0px 6px rgba(' + targetColor.r + ',' + targetColor.g + ',' + targetColor.b + ', 0.5)';
        }
        // that.bubbleDiv.style.background = 'rgb(' + that.color.r + ',' + that.color.g + ',' + that.color.b + ')';
        that.bubbleDiv.style.border = '1px solid rgba(' + targetColor.r + ',' + targetColor.g + ',' + targetColor.b + ', 0.25)';
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
            if (this.bubbleObj.position.z > -1 || this.bubbleObj.position.z < -Bubble.sceneRangeZ) {
                this.zSpeed *= -1;
            }
            this.bubbleObj.position.x += this.xSpeed;
            this.bubbleObj.position.y += this.ySpeed;
            this.bubbleObj.position.z += this.zSpeed;

            if (this.bubbleObj.scale.x < 1) {
                this.bubbleObj.scale.x += Bubble.scaleStep;
                this.bubbleObj.scale.y += Bubble.scaleStep;
            } else {
                if (this.main) {
                    this.opacity -= 0.002;
                } else {
                    this.opacity -= Bubble.opacitySpeed;
                }
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