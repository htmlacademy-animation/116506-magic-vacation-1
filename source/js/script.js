// modules
import loadPage from './modules/load-page.js';
import mobileHeight from './modules/mobile-height-adjust.js';
import slider from './modules/slider.js';
import menu from './modules/menu.js';
import footer from './modules/footer.js';
import chat from './modules/chat.js';
import result from './modules/result.js';
import form from './modules/form.js';
import social from './modules/social.js';
import FullPageScroll from './modules/full-page-scroll';
import typographyAnimation from './modules/typography-animation';
import Intro from './modules/intro';

// init modules
loadPage();
mobileHeight();
slider();
menu();
footer();
chat();
result();
form();
social();
typographyAnimation();

const intro = new Intro();

document.body.addEventListener(`screenChanged`, (e) => {
  if (e.detail.screenName === `top`) {
    intro.init();
  }
});

const fullPageScroll = new FullPageScroll();
fullPageScroll.init();
