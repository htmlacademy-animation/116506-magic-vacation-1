export default class canvasScene {
  constructor(options) {
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext(`2d`);
    this.canvas.width = 1000;
    this.canvas.height = 1000;
    this.size = 1000;

    this.sceneObjects = options.sceneObjects;
    this.objectsScene = {};
    this.arrImgs = [];
    this.loadingCounter = 0;

    this.animations = [];
    this.animationsDrop = [];

    this.afterInit = () => {};

    this.initObjects();
    this.initEventListeners();

    window.addEventListener(`resize`, () => this.drawFullScreen());
  }

  initObjects() {
    let itemImage;

    this.sceneObjects.forEach((item) => {
      itemImage = new Image();
      itemImage.src = item.url;

      this.objectsScene[item.objectId] = {};
      this.objectsScene[item.objectId].x = item.x;
      this.objectsScene[item.objectId].y = item.y;
      this.objectsScene[item.objectId].size = item.size;
      this.objectsScene[item.objectId].opacity = item.opacity;
      this.objectsScene[item.objectId].transforms = item.transforms;
      this.objectsScene[item.objectId].img = itemImage;
      this.objectsScene[item.objectId].after = item.after;
      this.objectsScene[item.objectId].before = item.before;

      this.arrImgs.push(itemImage);
    });

    if (this.afterInit && typeof this.afterInit === `function`) {
      this.afterInit();
    }
  }

  // СЧЕТЧИК ДЛЯ ОТРИСОВКИ КАРТИНОК
  increaseLoadingCounter() {
    this.loadingCounter++;

    if (this.loadingCounter === this.arrImgs.length) {
      this.drawScene();
    }
  }

  // ЖДЕМ ЗАГРУЗКУ КАРТИНКИ И УВЕЛИЧИВАЕМ СЧЕТЧИК
  initEventListeners() {
    this.arrImgs.forEach((item) => {
      item.onload = () => {
        this.increaseLoadingCounter();
      };
    });
  }

  drawImage(object) {
    let x = object.x;
    let y = object.y;
    let size = object.size;
    let opacity = object.opacity;
    let image = object.img;
    let transforms = object.transforms;

    let width = this.size * (size / 100);
    let height = (this.size * (size / 100) * image.height) / image.width;

    x = this.size * (x / 100) - width / 2;
    y = this.size * (y / 100) - height / 2;

    if (opacity === 0) {
      return;
    }

    if (transforms && (transforms.scaleX === 0 || transforms.scaleY === 0)) {
      return;
    }

    this.ctx.save();

    if (transforms) {
      if (transforms.translateX) {
        x += this.size * (transforms.translateX / 100);
      }

      if (transforms.translateY) {
        y += this.size * (transforms.translateY / 100);
      }

      if (transforms.rotate) {
        this.ctx.translate(x + width / 2, y + height / 2);
        this.ctx.rotate((transforms.rotate * Math.PI) / 180);
      }

      if (transforms.scaleX) {
        width *= transforms.scaleX;

        if (transforms.scaleX < 0) {
          this.ctx.scale(-1, 1);

          x = -x;
        }
      }

      if (transforms.scaleY) {
        height *= transforms.scaleY;

        if (transforms.scaleY < 0) {
          this.ctx.scale(1, -1);

          y = -y;
        }
      }

      if (transforms.rotate) {
        this.ctx.translate(-x - width / 2, -y - height / 2);
      }
    }

    if (opacity) {
      this.ctx.globalAlpha = opacity;
    }

    this.ctx.drawImage(image, x, y, width, height);

    object.widthImg = width;
    object.heightImg = height;

    this.ctx.restore();
  }

  drawScene() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let name in this.objectsScene) {
      if (this.objectsScene.hasOwnProperty(name)) {
        let objectScene = this.objectsScene[name];

        if (objectScene.before && typeof objectScene.before === `function`) {
          objectScene.before();
        }

        this.drawImage(objectScene);

        if (objectScene.after && typeof objectScene.after === `function`) {
          objectScene.after();
        }
      }
    }

    this.drawFullScreen();

  }

  // АДАПТИВ
  drawFullScreen() {
    let ww = window.innerWidth;
    let wh = window.innerHeight;

    this.setScaleCanvas(Math.max(ww, wh));
    this.setCanvasToCenter(ww, wh);
  }

  setCanvasSize(width, height) {
    const canvas = this.canvas;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + `px`;
    canvas.style.height = height + `px`;
  }

  setScaleCanvas(size) {
    const canvas = this.canvas;

    canvas.style.transform = `scale(
          ${(size / canvas.width) * 0.6},
          ${(size / canvas.height) * 0.6}
        )`;
  }

  setCanvasToCenter(width, height) {
    const canvas = this.canvas;

    const left = (width - canvas.offsetWidth) * 0.5;
    const top = (height - canvas.offsetHeight) * 0.55;

    canvas.style.left = `${left}px`;
    canvas.style.top = `${top}px`;
  }
}
