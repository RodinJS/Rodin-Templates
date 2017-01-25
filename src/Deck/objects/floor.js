import {THREE} from 'https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL';
import {THREEObject} from 'https://cdn.rodin.io/v0.0.1/rodinjs/sculpt/THREEObject';
import {SceneManager} from 'https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager';

const scene = SceneManager.get();

export class Floor extends THREEObject {
    constructor() {
        super(new THREE.Object3D());

        this.cubeCount = 30;
        this.cubeWidht = 1;
        this.cubes = [];

        this.on('ready', () => {
            scene.add(this.object3D);
            this.setup();
        })
    }

    setup() {
        const plane = new THREE.PlaneGeometry(this.cubeWidht, this.cubeWidht, 2, 2);
        const material = new THREE.MeshBasicMaterial({
            transparent: true,
            depthWrite: false,
            opacity: 0.5,
            map: new THREE.TextureLoader().load("./models/plane/planeground.png")
        });

        const center = new THREE.Vector3(0, 0, 0);
        for (let i = 0; i < this.cubeCount; i++) {
            for (let j = 0; j < this.cubeCount; j++) {
                const position = new THREE.Vector3((i - this.cubeCount / 2) * this.cubeWidht, 0, (j - this.cubeCount / 2) * this.cubeWidht);
                const obj = new THREE.Mesh(plane, material);

                obj.rotation.x = -Math.PI / 2;
                obj.position.copy(position);
                this.object3D.add(obj);
                obj.visible = false;
                obj.distanceFromCenter = position.distanceTo(center);
                obj.mustBrake = Math.random() > this.distanceFromCenter / (this.cubeCount * this.cubeWidht);
                this.cubes.push(obj);
            }
        }
    }

    animate() {
        for(let i = 0; i < this.cubes.length; i ++) {
            const obj = this.cubes[i];
            setTimeout(() => {
                obj.visible = true;
            }, obj.distanceFromCenter * 200 + 500)
        }
    }
}

export const floor = new Floor();
