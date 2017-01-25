import {THREE} from 'https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL';
import {SceneManager} from 'https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager';
import {CubeObject} from 'https://cdn.rodin.io/v0.0.1/rodinjs/sculpt/CubeObject';
import {MouseController} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/MouseController';
import {ViveController} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/ViveController';
import {EVENT_NAMES} from 'https://cdn.rodin.io/v0.0.1/rodinjs/constants/constants';

import {room} from './objects/room.js';
import {screen} from './objects/screen.js';
import './controllers.js';
import {space} from './objects/space.js';
// import './objects/sky.js';

let mode = 'light';
function enterDarkMode() {
    room.object3D.parent.remove(room.object3D);
    screen.unlock();
    space.show();
    mode = 'dark';
}

screen.on(EVENT_NAMES.CONTROLLER_KEY_UP, (evt) => {
    if(mode === 'light') {
        enterDarkMode();
    }
});

const scene = SceneManager.get();
const amLight = new THREE.AmbientLight();
amLight.intensity = 1.2;
scene.add(amLight);
