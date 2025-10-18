import React, { useState } from "react";
import "./styles/ProjectCard.css";

const ProjectCard = ({
    title,
    description,
    backgroundImage,
    pdfLink,
    githubLink,
    presentationLink,
    colors = {
        cardBackground: "#ffffff",
        titleColor: "#ffffff",
        titleShadow: "rgba(0, 0, 0, 0.3)",
        descriptionColor: "#4a5568",
        buttonBackground: "#f7fafc",
        buttonBorder: "#e2e8f0",
        buttonText: "#2d3748",
        buttonHoverBackground: "#edf2f7",
        buttonHoverBorder: "#cbd5e0",
        dividerColor: "#e2e8f0",
        scrollbarTrack: "#f1f1f1",
        scrollbarThumb: "#cbd5e0",
        scrollbarThumbHover: "#a0aec0",
        overlayGradientStart: "rgba(0, 0, 0, 0.1)",
        overlayGradientEnd: "rgba(0, 0, 0, 0.5)",
    },
}) => {
    return (
        <div
            className="project-card"
            style={{ "--card-bg": colors.cardBackground }}
        >
            <div className="card-content">
                {/* Image Section with Title Overlay - 40% */}
                <div
                    className="card-image-section"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        "--overlay-start": colors.overlayGradientStart,
                        "--overlay-end": colors.overlayGradientEnd,
                    }}
                >
                    <div className="image-overlay"></div>
                    <h3
                        className="card-title"
                        style={{
                            color: colors.titleColor,
                            textShadow: `0 2px 4px ${colors.titleShadow}`,
                        }}
                    >
                        {title}
                    </h3>
                </div>

                {/* Description Section - 50% */}
                <div
                    className="card-description-section"
                    style={{
                        "--scrollbar-track": colors.scrollbarTrack,
                        "--scrollbar-thumb": colors.scrollbarThumb,
                        "--scrollbar-thumb-hover": colors.scrollbarThumbHover,
                    }}
                >
                    <p
                        className="card-description"
                        style={{ color: colors.descriptionColor }}
                    >
                        {description}
                    </p>
                </div>

                {/* Action Buttons Section - 10% */}
                <div
                    className="card-actions-section"
                    style={{ borderTopColor: colors.dividerColor }}
                >
                    {pdfLink && (
                        <a
                            href={pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-button"
                            style={{
                                "--btn-bg": colors.buttonBackground,
                                "--btn-border": colors.buttonBorder,
                                "--btn-text": colors.buttonText,
                                "--btn-hover-bg": colors.buttonHoverBackground,
                                "--btn-hover-border": colors.buttonHoverBorder,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg
                                className="button-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            Report
                        </a>
                    )}

                    {githubLink && (
                        <a
                            href={githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-button"
                            style={{
                                "--btn-bg": colors.buttonBackground,
                                "--btn-border": colors.buttonBorder,
                                "--btn-text": colors.buttonText,
                                "--btn-hover-bg": colors.buttonHoverBackground,
                                "--btn-hover-border": colors.buttonHoverBorder,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg
                                className="button-icon"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </a>
                    )}

                    {presentationLink && (
                        <a
                            href={presentationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-button"
                            style={{
                                "--btn-bg": colors.buttonBackground,
                                "--btn-border": colors.buttonBorder,
                                "--btn-text": colors.buttonText,
                                "--btn-hover-bg": colors.buttonHoverBackground,
                                "--btn-hover-border": colors.buttonHoverBorder,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg
                                className="button-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <rect
                                    x="2"
                                    y="3"
                                    width="20"
                                    height="14"
                                    rx="2"
                                    ry="2"
                                ></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                            Slides
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
