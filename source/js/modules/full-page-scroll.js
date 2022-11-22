import throttle from 'lodash/throttle';
import AccentTypographyBuild from './accent-typography-build';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = 0;
    this.lastScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.lastScreen = this.activeScreen;
    this.reCalculateActiveScreenPosition(evt.deltaY);
    if (currentPosition !== this.activeScreen) {
      this.changePageDisplay();
    }
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.lastScreen = this.activeScreen;
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  animationTopScreenTextLine() {
    let classTitle = `.intro__title`;

    switch (this.activeScreen) {
      case 0:
        classTitle = `.intro__title`;
        break;
      case 1:
        classTitle = `.slider__item-title`;
        break;
      case 2:
        classTitle = `.prizes__title`;
        break;
      case 3:
        classTitle = `.rules__title`;
        break;
      case 4:
        classTitle = `.game__title`;
        break;
    }

    const animationTopScreenTextLine = new AccentTypographyBuild(
        classTitle,
        500,
        `active`,
        `transform`
    );
    animationTopScreenTextLine.destroyAnimation();
    setTimeout(() => {
      animationTopScreenTextLine.runAnimation();
    }, 500);
  }

  changeVisibilityDisplay() {
    const prizesBg = document.querySelector(`.prizes__bg`);
    if (this.lastScreen === 1 && this.activeScreen === 2
      || this.lastScreen === 1 && this.activeScreen === 3
      || this.lastScreen === 1 && this.activeScreen === 4) {
      prizesBg.classList.add(`visible`);
      prizesBg.addEventListener(`transitionend`, () => {
        this.changeActiveScreen();
        this.animationTopScreenTextLine();
      });
    } else {
      prizesBg.classList.remove(`visible`);
      this.changeActiveScreen();
      this.animationTopScreenTextLine();
    }
  }

  changeActiveScreen() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    setTimeout(() => {
      this.screenElements[this.activeScreen].classList.add(`active`);
    }, 100);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
