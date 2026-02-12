export type Section = "hero" | "about" | "skills" | "experience" | "projects" | "contact";

export const STATES = {
  hero: {
    desktop: {
      scale: { x: 1.5, y: 1.5, z: 1.5 },
      position: { x: 100, y: -100, z: 500 },
      rotation: { x: 0, y: Math.PI, z: 0 },
    },
    mobile: {
      scale: { x: 0.5, y: 0.5, z: 0.5 },
      position: { x: 0, y: -100, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
  },
  about: {
    desktop: {
      scale: { x: 1, y: 1, z: 1 },
      position: { x: 0, y: -40, z: 0 },
      rotation: {
        x: 0,
        y: Math.PI / 6,
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.3, y: 0.3, z: 0.3 },
      position: { x: 0, y: 150, z: 0 },
      rotation: {
        x: 0,
        y: Math.PI / 6,
        z: 0,
      },
    },
  },
  experience: {
    desktop: {
      scale: { x: 1, y: 1, z: 1 },
      position: { x: 0, y: -40, z: 0 },
      rotation: {
        x: Math.PI / 12, // Slight tilt forward
        y: -Math.PI / 4, // Rotate opposite to skills
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.3, y: 0.3, z: 0.3 },
      position: { x: 0, y: 150, z: 0 },
      rotation: {
        x: Math.PI / 6,
        y: -Math.PI / 6,
        z: 0,
      },
    },
  },
  skills: {
    desktop: {
      scale: { x: 1.5, y: 1.5, z: 1.5 },
      position: { x: 0, y: -300, z: 0 },
      rotation: {
        x: 0,
        y: -85 * (Math.PI / 180),
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.6, y: 0.6, z: 0.6 },
      position: { x: 0, y: 0, z: 0 },
      rotation: {
        x: 0,
        y: Math.PI / 4,
        z: 0,
      },
    },
  },
  projects: {
    desktop: {
      scale: { x: 1.5, y: 1.5, z: 1.5 },
      position: { x: 0, y: -40, z: 0 },
      rotation: {
        x: 0.1,
        y: Math.PI / 6,
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.5, y: 0.5, z: 0.5 },
      position: { x: 0, y: 100, z: 0 },
      rotation: {
        x: 0.1,
        y: Math.PI / 6,
        z: 0,
      },
    },
  },
  contact: {
    desktop: {
      scale: { x: 1.3, y: 1.3, z: 1.3 },
      position: { x: 0, y: 0, z: 700 },
      rotation: {
        x: 0,
        y: -Math.PI / 6,
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.5, y: 0.5, z: 0.5 },
      position: { x: 0, y: 80, z: 0 },
      rotation: {
        x: 0,
        y: -Math.PI / 6,
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
    // Reference widths for "ideal" size
    // Using 1024 for desktop to maintain backward compatibility with previous look
    const DESKTOP_REF_WIDTH = 1280;
    const MOBILE_REF_WIDTH = 390;

    const targetScale = isMobile
      ? width / MOBILE_REF_WIDTH
      : width / DESKTOP_REF_WIDTH;

    // Clamp values to prevent extremes
    const minScale = isMobile ? 0.5 : 0.8;
    const maxScale = isMobile ? 0.9 : 2.0;

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
