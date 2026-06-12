import React from "react";

const variants = {
  primary: "cs-btn cs-btn-primary",
  secondary: "cs-btn cs-btn-secondary",
  ghost: "cs-btn cs-btn-ghost",
  danger: "cs-btn cs-btn-danger",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  icon,
  children,
  className = "",
  ...props
}) {
  return (
    <Component className={`${variants[variant] || variants.primary} ${className}`} {...props}>
      {icon && <span className="cs-btn-icon">{icon}</span>}
      {children}
    </Component>
  );
}
