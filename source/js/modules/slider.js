import Swiper from "swiper";
import Story from './story';

export default () => {
  let storySlider;
  let bodyDOM = document.querySelector(`body`);
  const story = new Story();

  const setSlider = function () {
    if (((window.innerWidth / window.innerHeight) < 1) || window.innerWidth < 769) {
      storySlider = new Swiper(`.js-slider`, {
        pagination: {
          el: `.swiper-pagination`,
          type: `bullets`
        },
        keyboard: {
          enabled: true
        },
        on: {
          slideChange: () => {
            if (storySlider.activeIndex === 0 || storySlider.activeIndex === 1) {
              story.setScene(0);
            } else if (storySlider.activeIndex === 2 || storySlider.activeIndex === 3) {
              story.setScene(1);
            } else if (storySlider.activeIndex === 4 || storySlider.activeIndex === 5) {
              story.setScene(2);
            } else if (storySlider.activeIndex === 6 || storySlider.activeIndex === 7) {
              story.setScene(3);
            }
          },
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    } else {
      storySlider = new Swiper(`.js-slider`, {
        slidesPerView: 2,
        slidesPerGroup: 2,
        pagination: {
          el: `.swiper-pagination`,
          type: `fraction`
        },
        navigation: {
          nextEl: `.js-control-next`,
          prevEl: `.js-control-prev`,
        },
        keyboard: {
          enabled: true
        },
        on: {
          slideChange: () => {
            bodyDOM.classList.remove(`story-slide-1`);
            bodyDOM.classList.remove(`story-slide-2`);
            bodyDOM.classList.remove(`story-slide-3`);
            bodyDOM.classList.remove(`story-slide-4`);

            if (storySlider.activeIndex === 0) {
              story.setScene(0);
              bodyDOM.classList.add(`story-slide-1`);
            } else if (storySlider.activeIndex === 2) {
              story.setScene(1);
              bodyDOM.classList.add(`story-slide-2`);
            } else if (storySlider.activeIndex === 4) {
              story.setScene(2);
              bodyDOM.classList.add(`story-slide-3`);
            } else if (storySlider.activeIndex === 6) {
              story.setScene(3);
              bodyDOM.classList.add(`story-slide-4`);
            }
          },
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    }
  };

  window.addEventListener(`resize`, function () {
    if (storySlider) {
      storySlider.destroy();
    }
    setSlider();
  });

  setSlider();

  document.body.addEventListener(`screenChanged`, (e) => {
    if (e.detail.screenName === `story`) {
      story.init();
      story.setScene(0);
    }
  });
};
