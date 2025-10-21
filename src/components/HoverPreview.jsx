import React, { useState, useEffect } from "react";
import "./styles/HoverPreview.css";

const HoverPreview = ({ url, position, colors, isOpen, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHoveringPreview, setIsHoveringPreview] = useState(false);

    useEffect(() => {
        if (url && isOpen) {
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [url, isOpen]);

    const handlePreviewClick = () => {
        if (url) {
            window.location.href = url;
        }
    };

    if (!url || !isOpen) return null;

    const previewWidth = 400;
    const previewHeight = 300;
    const gap = 10;

    let left = position.centerX - previewWidth / 2;
    let top = position.top - previewHeight - gap;
    let isAbove = true;

    if (top < 0) {
        top = position.bottom + gap;
        isAbove = false;
    }

    if (left + previewWidth > window.innerWidth) {
        left = window.innerWidth - previewWidth - 10;
    }

    if (left < 0) {
        left = 10;
    }

    if (top + previewHeight > window.innerHeight) {
        top = window.innerHeight - previewHeight - 10;
    }

    const originX = position.centerX - left;
    const originY = isAbove ? previewHeight : 0;

    const previewStyle = {
        left: `${left}px`,
        top: `${top}px`,
        borderColor: colors.previewBorder,
        backgroundColor: colors.previewBackground,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0)",
        transformOrigin: `${originX}px ${originY}px`,
        boxShadow: isHoveringPreview
            ? "0 30px 60px -15px rgba(0, 0, 0, 0.35)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    };

    const clickAreaStyle = {
        backgroundColor: colors.previewBorder,
        transform: isHoveringPreview ? "scale(1.05)" : "scale(1)",
    };

    return (
        <div
            className="hover-preview"
            style={previewStyle}
            onMouseEnter={() => setIsHoveringPreview(true)}
            onMouseLeave={() => {
                setIsHoveringPreview(false);
                onClose();
            }}
        >
            <iframe
                src={url}
                className="preview-iframe"
                title="Skill Preview"
                sandbox="allow-same-origin allow-scripts"
                scrolling="yes"
            />
            <div
                className="click-area"
                style={clickAreaStyle}
                onClick={handlePreviewClick}
                title="Click to open in current tab"
            >
                Click to open →
            </div>
        </div>
    );
};

export default HoverPreview;
