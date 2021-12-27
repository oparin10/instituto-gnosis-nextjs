/* eslint-disable @typescript-eslint/ban-types */
import { Property } from "csstype";
import { AnimationControls, useAnimation, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import React from "react";
import {
  AnimationDirection,
  TransitionPreset,
  transitionPresetMap,
} from "./types";
import { ResponsiveStyleValue } from "@material-ui/system";
import MotionBox from "../MotionBox";
import evaluateAnimateInType from "../../utility/evaluateAnimateInType";
import { noop } from "../../utility/noop";

const DISPLACEMENT_AMOUNT_DEFAULT = 100;

/* eslint-disable-next-line */
export interface FadeInListProps<T> {
  component: React.FC<T>;
  list?: T[];
  flexDirection?: "row" | "column";
  staggerChildren?: number;
  fadeDirection?: AnimationDirection;
  displacementAmount?: number;
  gap?: ResponsiveStyleValue<Property.Gap<string | number>>;
  animateIn?: "scroll" | boolean;
  triggerOnce?: boolean;
  transition?: TransitionPreset;
  onAnimationStart?: (...args: unknown[]) => void;
  onAnimationEnd?: (...args: unknown[]) => void;
  customControl?: AnimationControls;
}
/**
 *
 * @param component: A React Functional Component
 * @param list: A list of items matching the functional component props type
 * @param flexDirection: flex-direction CSS property attached to the component wrapper
 * @param fadeDirection: The direction the animation will render from.
 * @param displacementAmount: The amount of pixels each component being rendered will be moved away from its point of origin.
 * @param gap: CSS gap property applied to the wrapper component
 * @param animateIn: Either the string literal 'scroll' to indicate the animation should be fired whenever the component is firing the intersection observer threshold or a boolean indicating whether the component should start rendering or not.
 * @param triggerOnce If using scroll mode, whether it should animate out when out of intersection observer bounds and then animate again once it's within said observer bounds again
 * @param onAnimationStart A callback to fire whenever the animation is starting.
 * @param onAnimationEnd A callback to fire whenever the animation is ending.
 * @param customControl A Framer Motion animation control instance generated by the useAnimation hook provided by the Framer Motion library. It enables the animation cycle to be controlled elsewhere in the case you need to further customize/orchestrate animations
 * @returns JSX.Element
 *
 * @see
 * Animation variants:
 * VISIBLE | HIDDEN
 */
export function FadeInList<T extends {}>({
  component: Component,
  list = [],
  flexDirection: direction = "column",
  staggerChildren = 0.25,
  fadeDirection = "top",
  animateIn = true,
  triggerOnce,
  gap,
  displacementAmount = 100,
  transition = "default",
  onAnimationEnd = noop,
  onAnimationStart = noop,
  customControl,
}: FadeInListProps<T>): JSX.Element | null {
  const controls = useAnimation();
  const { ref, inView, entry } = useInView({ triggerOnce: triggerOnce });

  React.useEffect(() => {
    const animateInCallback = async () => {
      onAnimationStart();
      await controls.start("visible");
      onAnimationEnd();
    };

    const animateOutCallback = async () => {
      onAnimationStart();
      await controls.start("hidden");
      onAnimationEnd();
    };

    if (!customControl) {
      evaluateAnimateInType(
        animateIn,
        inView,
        animateInCallback,
        animateOutCallback
      );
    }
  }, [
    inView,
    animateIn,
    onAnimationEnd,
    onAnimationStart,
    controls,
    customControl,
  ]);

  return (
    <MotionBox
      ref={ref}
      layout
      initial="hidden"
      animate={customControl ? customControl : controls}
      transition={{
        staggerChildren: staggerChildren,
      }}
      sx={{ display: "flex", flexDirection: direction, gap: gap }}
    >
      {list.map((value, index) => {
        return (
          <MotionBox
            variants={variantMap(displacementAmount)[fadeDirection]}
            key={index}
            transition={{
              ...transitionPresetMap[transition],
            }}
          >
            <Component {...value} />
          </MotionBox>
        );
      })}
    </MotionBox>
  );
}

export default FadeInList;

const variantMap = (
  displacement = DISPLACEMENT_AMOUNT_DEFAULT
): Record<AnimationDirection, Variants> => {
  return {
    left: {
      hidden: {
        x: -displacement,
        opacity: 0,
      },
      visible: {
        x: 0,
        opacity: 1,
      },
    },
    right: {
      hidden: {
        x: displacement,
        opacity: 0,
      },
      visible: {
        opacity: 1,
        x: 0,
      },
    },
    bottom: {
      hidden: {
        y: displacement,
        opacity: 0,
      },
      visible: {
        y: 0,
        opacity: 1,
      },
    },
    top: {
      hidden: {
        y: -displacement,
        opacity: 0,
      },
      visible: {
        y: 0,
        opacity: 1,
      },
    },
  };
};
