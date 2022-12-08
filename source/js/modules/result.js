export default () => {
  let showResultEls = document.querySelectorAll(`.js-show-result`);
  let results = document.querySelectorAll(`.screen--result`);
  if (results.length) {
    for (let i = 0; i < showResultEls.length; i++) {
      showResultEls[i].addEventListener(`click`, function () {
        let target = showResultEls[i].getAttribute(`data-target`);
        [].slice.call(results).forEach(function (el) {
          el.classList.remove(`screen--show`);
          el.classList.add(`screen--hidden`);
        });
        let targetEl = [].slice.call(results).filter(function (el) {
          return el.getAttribute(`id`) === target;
        });
        targetEl[0].classList.add(`screen--show`);
        targetEl[0].classList.remove(`screen--hidden`);
        let animResult;
        let animTransformResult;

        if (target === `result`) {
          animResult = document.querySelectorAll(`.result-icon animate`);
          for (let j = 0; j < animResult.length; j++) {
            animResult[j].beginElement();
          }
        }

        if (target === `result2`) {
          animResult = document.querySelectorAll(`.result2-icon animate`);
          for (let j = 0; j < animResult.length; j++) {
            animResult[j].beginElement();
          }
        }

        if (target === `result3`) {
          let animTimeOut = function () {
            animResult[j].beginElement();
            animTransformResult[j].beginElement();
            j++;
            if (j < howManyTimes) {
              setTimeout(animTimeOut, 50);
            }
          };
          animResult = document.querySelectorAll(`.result3-icon animate`);
          animTransformResult = document.querySelectorAll(`.result3-icon animateTransform`);

          let j = 0;
          let howManyTimes = animResult.length;

          animTimeOut();
        }
      });
    }

    let playBtn = document.querySelector(`.js-play`);
    if (playBtn) {
      playBtn.addEventListener(`click`, function () {
        [].slice.call(results).forEach(function (el) {
          el.classList.remove(`screen--show`);
          el.classList.add(`screen--hidden`);
        });
        document.getElementById(`messages`).innerHTML = ``;
        document.getElementById(`message-field`).focus();
      });
    }
  }
};
