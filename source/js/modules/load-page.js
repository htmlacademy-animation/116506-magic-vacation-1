export default () => {
  window.onload = function () {
    const body = document.body;
    const menuLinks = body.querySelectorAll(`.js-menu-link`);

    if (!body.classList.contains(`loaded`)) {
      body.classList.add(`loaded`);
    }

    menuLinks.forEach((link) => {
      link.classList.remove(`active`);
    });

    setTimeout(() => {
      menuLinks[0].classList.add(`active`);
    }, 350);
  };
};
