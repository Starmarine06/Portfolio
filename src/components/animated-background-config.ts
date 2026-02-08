export type Section = "hero" | "about" | "skills" | "projects" | "contact";

export const STATES = {
  hero: {
    desktop: {
      scale: { x: 0.7, y: 0.7, z: 0.7 },
      position: { x: 450, y: -100, z: 0 },
      rotation: { x: 0.2, y: -0.5, z: 0 },
    },
    mobile: {
      scale: { x: 0.5, y: 0.5, z: 0.5 },
      position: { x: 0, y: -250, z: 0 },
      rotation: { x: 0.2, y: -0.5, z: 0 },
    },
  },
  about: {
    desktop: {
      scale: { x: 1.0, y: 1.0, z: 1.0 },
      position: { x: 0, y: -50, z: 0 },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.8, y: 0.8, z: 0.8 },
      position: { x: 0, y: -50, z: 0 },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
  },
  skills: {
    desktop: {
      scale: { x: 1.1, y: 1.1, z: 1.1 },
      position: { x: 0, y: -50, z: 0 },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.9, y: 0.9, z: 0.9 },
      position: { x: 0, y: -50, z: 0 },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
  },
  projects: {
    desktop: {
      scale: { x: 1.0, y: 1.0, z: 1.0 },
      position: { x: 0, y: -50, z: 0 },
      rotation: {
        x: 0.2,
        y: 3.14,
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.8, y: 0.8, z: 0.8 },
      position: { x: 0, y: 100, z: 0 },
      rotation: {
        x: 0.2,
        y: 3.14,
        z: 0,
      },
    },
  },
  contact: {
    desktop: {
      scale: { x: 0.7, y: 0.7, z: 0.7 },
      position: { x: 400, y: -150, z: 0 },
      rotation: {
        x: 0,
        y: 0.5,
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.5, y: 0.5, z: 0.5 },
      position: { x: 0, y: 100, z: 0 },
      rotation: {
        x: 0,
        y: 0.5,
        z: 0,
      },
    },
  },
};

export const getKeyboardState = ({
  section,
  isMobile,
}: {
  section: Section;
  isMobile: boolean;
}) => {
  const baseTransform = STATES[section][isMobile ? "mobile" : "desktop"];

  const getScaleOffset = () => {
    const width = window.innerWidth;
    const DESKTOP_REF_WIDTH = 1280;
    const MOBILE_REF_WIDTH = 390;

    const targetScale = isMobile
      ? width / MOBILE_REF_WIDTH
      : width / DESKTOP_REF_WIDTH;

    const minScale = 0.5;
    const maxScale = 1.5;

    return Math.min(Math.max(targetScale, minScale), maxScale);
  };

  const scaleOffset = getScaleOffset();

  return {
    ...baseTransform,
    scale: {
      x: Math.abs(baseTransform.scale.x * scaleOffset),
      y: Math.abs(baseTransform.scale.y * scaleOffset),
      z: Math.abs(baseTransform.scale.z * scaleOffset),
    },
  };
};
