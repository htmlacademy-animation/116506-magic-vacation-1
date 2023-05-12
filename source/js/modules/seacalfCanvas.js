import {Animation} from "../helpers/animate.js";
import easing from "../helpers/utilities";
import canvasScene from "../helpers/canvasScene";

const ice = {
  objectId: `ice`,
  url: `./img/module-4/win-primary-images/ice.png`,
  x: 50,
  y: 69,
  size: 49,
  opacity: 0,
  transforms: {
    translateY: 30,
  },
};
const seaCalf = {
  objectId: `seaCalf`,
  url: `./img/module-4/win-primary-images/sea-calf-2.png`,
  x: 48,
  y: 60,
  size: 57,
  opacity: 0,
  transforms: {
    translateY: 30,
  },
};
const snowFlake1 = {
  objectId: `snowFlake1`,
  url: `./img/module-4/win-primary-images/snowflake.png`,
  x: 23,
  y: 55,
  size: 26,
  opacity: 0,
  transforms: {
    rotate: -30,
  },
};
const snowFlake2 = {
  objectId: `snowFlake2`,
  url: `./img/module-4/win-primary-images/snowflake.png`,
  x: 75,
  y: 65,
  size: 19,
  opacity: 0,
  transforms: {
    rotate: 30,
    scaleX: -1,
  },
};
const plane = {
  objectId: `plane`,
  url: `./img/module-4/win-primary-images/airplane.png`,
  x: 95,
  y: 45,
  size: 15,
  opacity: 0,
  transforms: {
    translateY: -10,
  },
};
const tree1 = {
  objectId: `tree1`,
  url: `./img/module-4/win-primary-images/tree-2.png`,
  x: 60,
  y: 55,
  size: 5,
  opacity: 0,
  transforms: {
    translateY: 30,
  },
};
const tree2 = {
  objectId: `tree2`,
  url: `./img/module-4/win-primary-images/tree.png`,
  x: 64,
  y: 58,
  size: 4,
  opacity: 0,
  transforms: {
    translateY: 30,
  },
};

const sceneObjectsArr = [
  plane,
  tree1,
  tree2,
  ice,
  seaCalf,
  snowFlake1,
  snowFlake2,
];

const local = {
  blob: {
    centerX: 40,
    centerY: 55,
    radius: 15,
    endX: 91,
    endY: 49,
    angle: 30,
    deltasLength: 10,
    opacity: 0,
  },
};

export default class SeacalfScene extends canvasScene {
  constructor(options) {
    const canvas = options.canvas;

    super({
      canvas,
      sceneObjects: sceneObjectsArr,
    });

    this.afterInit = () => {
      this.objectsScene.plane.before = this.drawBlob.bind(this);
    };

    this.initObjects();
  }

  drawBlob() {
    const blob = local.blob;
    const angle = (blob.angle * Math.PI) / 180;

    if (blob.opacity === 0) {
      return;
    }

    const s = this.size / 100;

    this.ctx.save();
    this.ctx.globalAlpha = blob.opacity;
    this.ctx.fillStyle = `#acc3ff`;

    this.ctx.beginPath();
    this.ctx.arc(
        blob.centerX * s,
        blob.centerY * s,
        blob.radius * s,
        Math.PI / 2,
        (Math.PI * 3) / 2
    );
    this.ctx.bezierCurveTo(
        (blob.centerX + 10) * s,
        (blob.centerY - blob.radius) * s,
        (blob.endX - blob.deltasLength * Math.sin(angle)) * s,
        (blob.endY + blob.deltasLength * Math.cos(angle)) * s,
        blob.endX * s,
        blob.endY * s
    );
    this.ctx.bezierCurveTo(
        (blob.endX - blob.deltasLength * Math.sin(angle)) * s,
        (blob.endY + blob.deltasLength * Math.cos(angle)) * s,
        (blob.centerX + 10) * s,
        (blob.centerY + blob.radius) * s,
        blob.centerX * s,
        (blob.centerY + blob.radius) * s
    );

    this.ctx.fill();
    this.ctx.restore();
  }

  // АНИМАЦИЯ

  initIceAndSeaCalfAnimations() {
    this.animations.push(
        new Animation({
          func: (progress) => {
            const progressReversed = 1 - progress;

            this.objectsScene.ice.transforms.translateY = 30 * progressReversed;
            this.objectsScene.ice.transforms.rotate = -30 * Math.sin(progressReversed * 2);

            this.objectsScene.seaCalf.transforms.translateY =
              30 * progressReversed;
            this.objectsScene.seaCalf.transforms.rotate = -30 * Math.sin(progressReversed * 2);
          },
          delay: 500,
          duration: 2000,
          easing: easing.easeOutElastic,
        })
    );

    this.animations.push(
        new Animation({
          func: (progress) => {
            this.objectsScene.seaCalf.opacity = progress;
            this.objectsScene.ice.opacity = progress;
          },
          delay: 500,
          duration: 300,
          easing: easing.easeInQuad,
        })
    );
  }

  initSnowFlakesAnimations() {
    this.animations.push(
        new Animation({
          func: (progress, details) => {
            this.objectsScene.snowFlake1.transforms.translateY =
              2 *
              Math.sin((1.5 * (details.currentTime - details.startTime)) / 1000);
          },
          duration: `infinite`,
        })
    );

    this.animations.push(
        new Animation({
          func: (progress, details) => {
            this.objectsScene.snowFlake2.transforms.translateY =
              2 *
              Math.sin((1.5 * (details.currentTime - details.startTime)) / 1000);
          },
          delay: 700,
          duration: `infinite`,
        })
    );

    this.animations.push(
        new Animation({
          func: (progress) => {
            this.objectsScene.snowFlake1.opacity = progress;
          },
          duration: 1000,
          delay: 800,
          easing: easing.easeInQuad,
        })
    );

    this.animations.push(
        new Animation({
          func: (progress) => {
            this.objectsScene.snowFlake2.opacity = progress;
          },
          duration: 1000,
          delay: 1200,
          easing: easing.easeInQuad,
        })
    );
  }

  initPaneAnimations() {
    this.animations.push(
        new Animation({
          func: (progress) => {
            const progressReversed = 1 - progress;

            this.objectsScene.plane.transforms.translateX = -40 * progressReversed;
            this.objectsScene.plane.transforms.translateY =
              5 * Math.sin(Math.PI * progressReversed) - 15 * progressReversed;
            this.objectsScene.plane.transforms.rotate =
              45 * Math.sin(Math.PI * progressReversed) + 45 * progressReversed;
            this.objectsScene.plane.opacity = progress;
          },
          duration: 500,
          delay: 1100,
          easing: easing.easeInQuad,
        })
    );
  }

  initTreesAnimations() {
    this.animations.push(
        new Animation({
          func: (progress) => {
            this.objectsScene.tree1.transforms.translateY = 30 * (1 - progress);
            this.objectsScene.tree1.opacity = progress;
          },
          duration: 500,
          delay: 1400,
          easing: easing.easeInQuad,
        })
    );

    this.animations.push(
        new Animation({
          func: (progress) => {
            this.objectsScene.tree2.transforms.translateY = 30 * (1 - progress);
            this.objectsScene.tree2.opacity = progress;
          },
          duration: 500,
          delay: 1200,
          easing: easing.easeInQuad,
        })
    );
  }

  initBlobAnimations() {
    this.animations.push(
        new Animation({
          func: (progress) => {
            const progressReversed = 1 - progress;

            local.blob.radius = 15 * progress;
            local.blob.centerY = 55 - 15 * progressReversed;
            local.blob.endX = 91 - 35 * progressReversed;
            local.blob.endY = 49 - 12 * progressReversed;
            local.blob.angle = 30 + 120 * progressReversed;
            local.blob.deltasLength = 10 * progress;
            local.blob.opacity = progress;
          },
          duration: 500,
          delay: 1200,
          easing: easing.easeInQuad,
        })
    );
  }

  startAnimation() {
    this.animations.push(
        new Animation({
          func: () => {
            this.drawScene();
          },
          duration: `infinite`,
          fps: 60,
        })
    );

    this.initIceAndSeaCalfAnimations();
    this.initSnowFlakesAnimations();
    this.initBlobAnimations();
    this.initPaneAnimations();
    this.initTreesAnimations();

    this.animations.forEach((animation) => {
      animation.start();
    });
  }

  stoptAnimation() {
    this.animations.forEach((animation) => {
      animation.stop();
    });
  }
}
