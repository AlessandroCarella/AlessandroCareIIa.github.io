import React, { useState } from "react";
import "./styles/TextCapsule.css";

const TextCapsule = ({
    name,
    link,
    icon,
    onHover,
    onLeave,
    colors,
    onClick,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const capsuleStyle = {
        backgroundColor: isHovered
            ? colors.capsuleBorder
            : colors.capsuleBackground,
        color: isHovered ? colors.capsuleBackground : colors.capsuleText,
        borderColor: colors.capsuleBorder,
        transform: isHovered ? "scale(1.1) translateY(-2px)" : "scale(1)",
        boxShadow: isHovered ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none",
        cursor: link ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    };

    return (
        <div
            className="text-capsule"
            style={capsuleStyle}
            onMouseEnter={(e) => {
                setIsHovered(true);
                if (link && onHover) {
                    onHover(link, e);
                }
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                if (onLeave) {
                    onLeave();
                }
            }}
            onClick={() => {
                if (link && onClick) {
                    onClick(link);
                }
            }}
        >
            {icon && (
                <span style={{ display: "flex", alignItems: "center" }}>
                    {icon}
                </span>
            )}
            <span>{name}</span>
        </div>
    );
};

export default TextCapsule;
