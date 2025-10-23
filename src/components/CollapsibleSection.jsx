import React, { useState } from "react";
import "./styles/CollapsibleSection.css";

/**
 * CollapsibleSection - A reusable component for collapsible content sections
 *
 * @param {string} title - The heading text to display
 * @param {React.ReactNode} children - The content to show/hide
 * @param {boolean} defaultOpen - Whether the section starts expanded (default: true)
 * @param {string} className - Additional CSS classes for the container
 * @param {string} titleClassName - Additional CSS classes for the title
 */
const CollapsibleSection = ({
    title,
    children,
    defaultOpen = false,
    className = "",
    titleClassName = "",
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleSection = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`collapsible-section ${className}`}>
            <button
                className={`collapsible-header ${titleClassName}`}
                onClick={toggleSection}
                aria-expanded={isOpen}
            >
                <span className="collapsible-title">{title}</span>
                <svg
                    className={`collapsible-icon ${isOpen ? "open" : "closed"}`}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            <div
                className={`collapsible-content ${isOpen ? "open" : "closed"}`}
                aria-hidden={!isOpen}
            >
                <div className="collapsible-content-inner">{children}</div>
            </div>
        </div>
    );
};

export default CollapsibleSection;
