export type Vector3 = { x: number; y: number; z: number };

export type KeyboardState = {
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
};

export type SectionConfig = {
  desktop: KeyboardState;
  mobile: KeyboardState;
};

export type Section = "hero" | "skills" | "projects" | "experience" | "contact";

const createVector = (x: number, y: number, z: number): Vector3 => ({ x, y, z });

export const SECTION_CONFIGS: Record<Section, SectionConfig> = {
  hero: {
    desktop: {
      position: createVector(400, -100, 0),
      rotation: createVector(0.2, -0.5, 0),
      scale: createVector(1.0, 1.0, 1.0),
    },
    mobile: {
      position: createVector(0, -250, 0),
      rotation: createVector(0.2, -0.5, 0),
      scale: createVector(0.7, 0.7, 0.7),
    },
  },
  skills: {
    desktop: {
      position: createVector(0, -50, 0),
      rotation: createVector(-1.57, 0, 0),
      scale: createVector(1.2, 1.2, 1.2),
    },
    mobile: {
      position: createVector(0, 0, 0),
      rotation: createVector(-1.57, 0, 0),
      scale: createVector(0.8, 0.8, 0.8),
    },
  },
  projects: {
    desktop: {
      position: createVector(0, -50, 0),
      rotation: createVector(1.57, 0, 0),
      scale: createVector(1.2, 1.2, 1.2),
    },
    mobile: {
      position: createVector(0, 100, 0),
      rotation: createVector(1.57, 0, 0),
      scale: createVector(0.8, 0.8, 0.8),
    },
  },
  experience: {
    desktop: {
      position: createVector(-100, 0, 0),
      rotation: createVector(0, 0.5, 0),
      scale: createVector(1.2, 1.2, 1.2),
    },
    mobile: {
      position: createVector(0, 0, 0),
      rotation: createVector(0, 0.5, 0),
      scale: createVector(0.8, 0.8, 0.8),
    },
  },
  contact: {
    desktop: {
      position: createVector(400, -150, 0),
      rotation: createVector(0, 0.5, 0),
      scale: createVector(1.0, 1.0, 1.0),
    },
    mobile: {
      position: createVector(0, 100, 0),
      rotation: createVector(0, 0.5, 0),
      scale: createVector(0.7, 0.7, 0.7),
    },
  },
};

export function getKeyboardState({
  section,
  isMobile,
}: {
  section: Section;
  isMobile: boolean;
}): KeyboardState {
  const config = SECTION_CONFIGS[section] || SECTION_CONFIGS.hero;
  const baseTransform = isMobile ? config.mobile : config.desktop;

  const getScaleOffset = () => {
    if (typeof window === "undefined") return 1;
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
      x: baseTransform.scale.x * scaleOffset,
      y: baseTransform.scale.y * scaleOffset,
      z: baseTransform.scale.z * scaleOffset,
    },
  };
}
