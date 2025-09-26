import React, { PropsWithChildren } from "react";
import styles from "./glitch-text.module.css";

export interface GlitchTextProps extends PropsWithChildren {
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}

export const GlitchText = ({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = true,
  className = ""
}: GlitchTextProps) => {
  const inlineStyles: React.CSSProperties = {
    // CSS custom properties consumed by CSS module
    ["--after-duration" as any]: `${speed * 3}s`,
    ["--before-duration" as any]: `${speed * 2}s`,
    ["--after-shadow" as any]: enableShadows ? "-5px 0 red" : "none",
    ["--before-shadow" as any]: enableShadows ? "5px 0 cyan" : "none"
  };

  const hoverClass = enableOnHover ? styles.enableOnHover : "";

  return (
    <div
      className={`!font-(family-name:--font-shadows-into-light) !tracking-[-1.5px] !w-full !h-full !text-7xl ${styles.glitch} ${hoverClass} ${className}`}
      style={inlineStyles}
      data-text={typeof children === "string" ? children : undefined}>

      {children}
    </div>);

};

export default GlitchText;