export const isShadow = (obj) => {
  if (obj.isShadow) {
    obj.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
  }
};
