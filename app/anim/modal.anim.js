export const menuAnim = {
  initial: {
    clipPath: "inset(100% 0% 0% 0%)",
  },
  animate: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
      delay: 0.25,
    },
  },
  exit: {
    clipPath: "inset(100% 0% 0% 0%)",
    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
      delay: 0.25,
    },
  },
};

export const loaderLayerAnim = {
  initial: {
    clipPath: "inset(100% 0% 0% 0%)",
  },
  animate: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  exit: {
    clipPath: "inset(100% 0% 0% 0%)",
    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
      delay: 1,
    },
  },
};

export const overlayAnim = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

export const closeBtnAnim = {
  initial: { scale: 0, rotate: -90 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  exit: {
    scale: 0,
    rotate: 90,
    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

export const itemAnim = {
  initial: { y: 30, opacity: 0 },
  animate: (custom = 0) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
      delay: custom * 0.15,
    },
  }),
  exit: {
    y: 20,
    opacity: 0,
    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

export const wordReveal = {
  initial: (custom) => ({
    y: "100%",

    transition: {
      duration: 0.75,
      ease: [0.33, 1, 0.68, 1],
      delay: custom,
    },
  }),
  animate: (custom) => ({
    y: "0%",

    transition: {
      duration: 0.75,
      ease: [0.33, 1, 0.68, 1],
      delay: custom,
    },
  }),
  exit: (custom) => ({
    y: "100%",

    transition: {
      duration: 0.75,
      ease: [0.33, 1, 0.68, 1],
      delay: custom,
    },
  }),
};

export const wordRevealHover = {
  initial: (custom) => ({
    y: "0%",

    transition: {
      duration: 0.75,
      ease: [0.33, 1, 0.68, 1],
      delay: custom,
    },
  }),
  animate: (custom) => ({
    y: "-50%",

    transition: {
      duration: 0.75,
      ease: [0.33, 1, 0.68, 1],
      delay: custom,
    },
  }),
};

export const drawerLeftAnim = {
  initial: {
    clipPath: "inset(0% 100% 0% 0%)",
  },
  animate: {
    clipPath: "inset(0% 0% 0% 0%)",

    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  exit: {
    clipPath: "inset(0% 100% 0% 0%)",

    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

export const drawerRightAnim = {
  initial: {
    clipPath: "inset(0% 0% 0% 100%)",
  },
  animate: {
    clipPath: "inset(0% 0% 0% 0%)",

    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  exit: {
    clipPath: "inset(0% 0% 0% 100%)",

    transition: {
      duration: 0.75,
      ease: [0.76, 0, 0.24, 1],
      
    },
  },
};
