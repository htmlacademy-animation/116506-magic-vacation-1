export default (uniforms) => ({
  uniforms,
  vertexShader: `
    uniform mat4 projectionMatrix;
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;
    
    varying vec2 vUv;
    
    void main() {
    
        vUv = uv;
    
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
    
    }`,

  fragmentShader: `
    precision mediump float;

    uniform sampler2D map;
    
    varying vec2 vUv;

    struct optionsStruct {
      float hue;
      bool isMagnifier;
    };

    uniform optionsStruct options;

    struct bubbleStruct {
      float radius;
      vec2 position;
      float glareOffset;
      float glareAngleStart;
      float glareAngleEnd;
    };
    
    struct magnificationStruct {
      bubbleStruct bubbles[3];
      vec2 resolution;
    };

    uniform magnificationStruct magnification;

    vec3 hueShift(vec3 color, float hue) {
      const vec3 k = vec3(0.57735, 0.57735, 0.57735);
      float cosAngle = cos(hue);
      return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
    }

    bool isBetweenAngles(vec2 point, float glareAngleStart, float glareAngleEnd) {
      float angle = atan(point.y, point.x);
      return angle >= glareAngleStart && angle <= glareAngleEnd;
    }

    float getOffset(vec2 point, vec2 circle) {
      return sqrt(pow(point.x - circle.x, 2.0) + pow(point.y - circle.y, 2.0));
    }

    bool isCurrentBubble(vec2 point, vec2 circle, float radius, float outlineThickness) {
      float offset = getOffset(point, circle);
      return offset < radius + outlineThickness;
    }

    bool isInsideTheCircle(vec2 point, vec2 circle, float radius) {
      float offset = getOffset(point, circle);
      return offset < radius;
    }

    bool isOutlineOfTheCircle(vec2 point, vec2 circle, float radius, float outlineThickness) {
      float offset = getOffset(point, circle);
      return floor(offset) >= floor(radius) && floor(offset) <= floor(radius + outlineThickness);
    }

    bool isGlarePart(vec2 point, vec2 circle, float radius, float glareWidth, float glareAngleStart, float glareAngleEnd) {
      return isOutlineOfTheCircle(point, circle, radius, glareWidth) && isBetweenAngles(point - circle, glareAngleStart, glareAngleEnd);
    }

    vec4 blendOutline(vec4 texture, vec4 outline) {
      return vec4(mix(texture.rgb, outline.rgb, outline.a), texture.a);
    }

    vec4 magnifier(sampler2D map, magnificationStruct magnification) {
      float outlineThickness = 3.0;

      vec4 outlineColor = vec4(1, 1, 1, 0.15);
      vec2 resolution = magnification.resolution;

      bubbleStruct bubble = magnification.bubbles[0];

      vec2 point = gl_FragCoord.xy;

      for (int index = 0; index < 3; index++) {
        bubbleStruct currentBubble = magnification.bubbles[index];
        vec2 currentPosition = currentBubble.position;
        float currentRadius = currentBubble.radius;
        if (isCurrentBubble(point, currentPosition, currentRadius, outlineThickness)) {
          bubble = currentBubble;
        }
      }

      vec2 position = bubble.position;

      float radius = bubble.radius;
      float h = bubble.radius / 2.0;
      float hr = radius * sqrt(1.0 - pow((radius - h) / radius, 2.0));
      float offset = sqrt(pow(point.x - position.x, 2.0) + pow(point.y - position.y, 2.0));
      float glareAngleStart = bubble.glareAngleStart;
      float glareAngleEnd = bubble.glareAngleEnd;
      float glareOffset = bubble.glareOffset;

      bool pointIsInside = isInsideTheCircle(point, position, hr);
      bool pointIsOutline = isOutlineOfTheCircle(point, position, hr, outlineThickness);
      bool isGlarePoint = isGlarePart(point, position, hr * glareOffset, outlineThickness, glareAngleStart, glareAngleEnd);

      vec2 newPoint = pointIsInside ? (point - position) * (radius - h) / sqrt(pow(radius, 2.0) - pow(offset, 2.0)) + position : point;
      vec2 newVUv = (newPoint) / resolution;
      
      if (pointIsOutline || isGlarePoint) {
        return blendOutline(texture2D(map, newVUv), outlineColor);
      }
      return texture2D(map, newVUv);
    }

    void main() {

      vec4 result = texture2D(map, vUv);

      if (options.isMagnifier) {
        result = magnifier(map, magnification);
      }

      vec3 hueShifted = hueShift(result.rgb, options.hue);

      result = vec4(hueShifted.rgb, 1);
      
      gl_FragColor = result;
      
    }`
});
