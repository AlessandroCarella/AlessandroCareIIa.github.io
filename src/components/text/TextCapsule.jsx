import React from "react";
import "./styles/TextCapsule.css";

const TextCapsule = ({
    name,
    link,
    icon,
    onHover,
    onLeave,
    onClick,
    fontSize = 14,
}) => {
    const textStyle = {
        fontSize: `${fontSize}px`,
    };

    const iconStyle = {
        fontSize: `${fontSize + 2}px`,
    };

    return (
        <div
            className="text-capsule"
            style={{ cursor: link ? "pointer" : "default" }}
            onMouseEnter={(e) => {
                if (link && onHover) {
                    onHover(link, e);
                }
            }}
            onMouseLeave={() => {
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
                <span className="capsule-icon" style={iconStyle}>
                    {icon}
                </span>
            )}
            <span className="capsule-text" style={textStyle}>
                {name}
            </span>
        </div>
    );
};

export default TextCapsule;
