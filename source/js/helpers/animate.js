import * as THREE from 'three';
import easingFunc from './utilities.js';
import {
  degToRadians
} from './utilities.js';
// import {
//   isScenery,
//   activeScene
// } from '../modules/IntroAndStory.js';

export let isFinishFirsAnimObj = false;

export class Animation {
  constructor(options) {
    this.options = options;

    if (!this.options.easing) {
      this.options.easing = easingFunc.easeLinear;
    }

    if (!this.options.duration) {
      this.options.duration = 1000;
    }

    if (!this.options.delay) {
      this.options.delay = 0;
    }

    if (!this.options.fps) {
      this.options.fps = 60;
    }

    this.timeoutId = null;
    this.requestId = null;
  }

  start(options) {
    this.stop();

    this.timeoutId = setTimeout(() => {
      this.startTime = performance.now();
      this.interval = 1000 / this.options.fps;
      this.lastFrameTime = this.startTime;
      this.isFinished = false;

      let animateFrame;

      if (this.options.duration === `infinite`) {
        animateFrame = (currentTime) => {
          this.requestId = requestAnimationFrame(animateFrame);

          const delta = currentTime - this.lastFrameTime;

          if (delta > this.interval) {
            this.options.func(1, {
              startTime: this.startTime,
              currentTime,
              isFinished: false,
              options
            });

            this.lastFrameTime = currentTime - delta % this.interval;
          }
        };
      } else {
        animateFrame = (currentTime) => {
          this.requestId = requestAnimationFrame(animateFrame);

          const delta = currentTime - this.lastFrameTime;

          if (delta > this.interval) {
            let timeFraction = (currentTime - this.startTime) / this.options.duration;

            if (timeFraction > 1) {
              timeFraction = 1;
              this.isFinished = true;
            }

            if (timeFraction <= 1) {
              const progress = this.options.easing(timeFraction);

              this.options.func(progress, {
                startTime: this.startTime,
                currentTime,
                isFinished: this.isFinished,
                options
              });

              this.lastFrameTime = currentTime - delta % this.interval;
            }

            if (this.isFinished) {
              this.stop();

              if (typeof this.options.callback === `function`) {
                this.options.callback();
              }
            }
          }
        };
      }

      this.requestId = requestAnimationFrame(animateFrame);
    }, this.options.delay);
  }

  restart() {
    this.start();
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }
  }
}

export const animateFPS = (render, duration, fps, endCB = () => {}) => {
  let start = null;
  let lastFrameUpdateTime = null;
  let timeSinceLastUpdate = null;

  function loop(currentTime) {
    if (!start) {
      start = currentTime;
    }

    if (!lastFrameUpdateTime) {
      lastFrameUpdateTime = currentTime;
    }

    let progress = (currentTime - start) / duration;
    if (progress > 1) {
      render(1);
      endCB();
      return;
    }

    timeSinceLastUpdate = currentTime - lastFrameUpdateTime;
    if (timeSinceLastUpdate > fps) {
      lastFrameUpdateTime = currentTime;
      render(progress);
    }

    // if (activeScene === 1) {
    //   requestAnimationFrame(loop);
    // } else {
    //   render(1);
    // }
  }

  loop();
};

export const tick = (from, to, progress) => from + progress * (to - from);

export const animIntroObj = (items, duration, ease, endCB = () => {}) => {
  let progress = 0;
  let startTime = Date.now();

  function loop() {

    progress = (Date.now() - startTime) / duration;

    const easing = easingFunc[ease](progress);

    let finishPosition;

    items.forEach((item) => {
      // if (isScenery) {
      //   finishPosition = item.optAnim.finishPositionLS;
      // } else {
      //   finishPosition = item.optAnim.finishPositionPO;
      // }

      const scale = setParamsXYZ(item.optAnim.startScale, item.optAnim.finishScale, easing);
      const position = setParamsXYZ(item.optAnim.startPosition, finishPosition, easing);

      item.scale.set(...scale);
      item.position.set(...position);
    });

    if (progress > 1) {
      isFinishFirsAnimObj = true;
      animareFluctuationIntroObj(items);
      endCB();
      return;
    }

    requestAnimationFrame(loop);
  }

  loop();
};

export const animareFluctuationIntroObj = (items) => {
  let progress = 0;
  let startTime = Date.now();

  function loop() {

    progress = (Date.now() - startTime) * 0.0001;

    items.forEach((item) => {
      item.position.y = item.position.y + item.optAnim.amp * Math.sin((2 * Math.PI * progress) / item.optAnim.period);
    });

    requestAnimationFrame(loop);
  }

  loop();
};

export const animateScale = (item, start, finish, duration, ease, endCB = () => {}) => {
  let progress = 0;
  let startTime = Date.now();

  function loop() {

    progress = (Date.now() - startTime) / duration;

    const easing = easingFunc[ease](progress);

    const scale = setParamsXYZ(start, finish, easing);

    if (progress > 1) {
      endCB();
      return;
    }

    item.scale.set(...scale);

    requestAnimationFrame(loop);
  }

  loop();
};

export const animateMoveY = (item, start, finish, duration, ease, endCB = () => {}) => {
  let progress = 0;
  let startTime = Date.now();

  function loop() {

    progress = (Date.now() - startTime) / duration;

    const easing = easingFunc[ease](progress);

    const positionY = tick(start, finish, easing);

    if (progress > 1) {
      endCB();
      item.position.y = finish;
      return;
    }

    item.position.y = positionY;

    requestAnimationFrame(loop);
  }

  loop();
};

export const setPositionIntroObj = (items) => {
  let finishPosition;

  items.forEach((item) => {
    // if (isScenery) {
    //   finishPosition = item.optAnim.finishPositionLS;
    // } else {
    //   finishPosition = item.optAnim.finishPositionPO;
    // }

    item.position.set(...finishPosition);
  });
};

export const animDogTail = (t, item) => {

  const progress = Math.floor(t % 6);

  const amp = progress > 2 && progress < 6 ? 0.8 : 0.4;

  item.rotation.x = amp * Math.sin((6 * Math.PI * t));
};

export const animSaturn = (t, amp, item1, item2) => {

  const rotationX1 = amp * Math.sin((1 * Math.PI * t) / 2);
  const rotationX2 = -0.2 * Math.sin((0.9 * Math.PI * t) / 2);

  item1.rotation.x = rotationX1;
  item2.rotation.x = rotationX2;
};

export const animLeaf = (t, item, amp, speed) => {

  item.rotation.x = amp * Math.sin((Math.PI * easingFunc.easeOutElastic(t * speed)));
};

export const animConpass = (t, amp, item) => {
  const rotationZ = amp * Math.sin((1.5 * Math.PI * t) / 2);

  item.rotation.z = rotationZ;
};

export const animSonya = (t, item1, item2, item3) => {
  const positionY = 10 * Math.sin((2 * Math.PI * t) / 2);

  const rotationX1 = -0.05 * Math.sin((2 * Math.PI * t) / 2);

  item1.position.y = positionY;
  item2.rotation.y = -1.3 + rotationX1;
  item3.rotation.y = 1.3 - rotationX1;
};

export const animSuitcaseIntro = (item, duration, ease, endCB = () => {}) => {
  let progress = 0;
  let startTime = Date.now();

  const groupScale = item.getObjectByName(`scale`);
  const groupRotation = item.getObjectByName(`rotation`);
  const groupPositionXY = item.getObjectByName(`positionXY`);
  const groupMove = item.getObjectByName(`move`);

  function loop() {

    progress = (Date.now() - startTime) / duration;

    const easing = easingFunc[ease](progress);

    const scale = setParamsXYZ(item.optAnim.startScale, item.optAnim.finishScale, easing);
    const position = setParamsXYZ(item.optAnim.startPosition, item.optAnim.finishPosition, easing);
    const rotation = setParamsXYZ(item.optAnim.startRotation, item.optAnim.finishRotation, easing);

    const positionX = 30 * Math.sin((1.5 * Math.PI * easing) / 1.5);
    const positionY = 170 * Math.sin((1.5 * Math.PI * easing) / 1.5);
    const positionXY = [positionX, positionY, 0];

    groupScale.scale.set(...scale);
    groupMove.position.set(...position);
    groupRotation.rotation.copy(new THREE.Euler(degToRadians(rotation[0]), degToRadians(rotation[1]), degToRadians(rotation[2])));
    groupPositionXY.position.set(...positionXY);

    if (progress > 1) {
      animareFluctuationIntroObj([item]);
      endCB();
      return;
    }

    requestAnimationFrame(loop);
  }

  loop();
};

export const animAirplaneIntro = (item, duration, ease, endCB = () => {}) => {
  let progress = 0;
  let startTime = Date.now();

  const groupScale = item.getObjectByName(`scale`);
  const groupRotationAirplane = item.getObjectByName(`rotationAirplane`);
  const groupPositionYZ = item.getObjectByName(`positionYZ`);
  const groupRotationAxis = item.getObjectByName(`rotationAxis`);
  // const groupMove = item.getObjectByName(`move`);

  function loop() {

    progress = (Date.now() - startTime) / duration;

    const easing = easingFunc[ease](progress);

    const scale = setParamsXYZ(item.optAnim.startScale, item.optAnim.finishScale, easing);
    const rotationAirplane = setParamsXYZ(item.optAnim.startRotationAirplane, item.optAnim.finishRotationAirplane, easing);
    const positionYZ = setParamsXYZ(item.optAnim.startPositionYZ, item.optAnim.finishPositionYZ, easing);
    const rotationAxis = tick(item.optAnim.startRotationAxis, item.optAnim.finishRotationAxis, easing);

    groupScale.scale.set(...scale);
    groupRotationAirplane.rotation.copy(new THREE.Euler(degToRadians(rotationAirplane[0]), degToRadians(rotationAirplane[1]), degToRadians(rotationAirplane[2]), `YXZ`));
    groupPositionYZ.position.set(...positionYZ);
    groupRotationAxis.rotation.copy(new THREE.Euler(0, degToRadians(rotationAxis), 0));

    if (progress > 1) {
      animareFluctuationIntroObj([item]);
      endCB();
      return;
    }

    requestAnimationFrame(loop);
  }

  loop();
};

const setParamsXYZ = (start, finish, easing) => {
  let paramsArr = [];

  for (let i = 0; i <= 2; i++) {
    const param = tick(start[i], finish[i], easing);
    paramsArr.push(param);
  }

  return paramsArr;
};


export const animOpacity = (item, finish, duration) => {
  let progress = 0;
  let startTime = Date.now();
  const start = item.material.opacity;

  item.material.transparent = true;

  function loop() {

    progress = (Date.now() - startTime) / duration;

    const opacity = start + progress * (finish - start);

    if (progress > 1) {
      return;
    }

    item.material.opacity = opacity;

    requestAnimationFrame(loop);
  }

  loop();
};
