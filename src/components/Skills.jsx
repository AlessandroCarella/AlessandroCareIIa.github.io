import React, { useState } from "react";
import "./styles/Skills.css";

const SkillCapsule = ({ name, link, onHover, onLeave, colors, onClick }) => {
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
    };

    return (
        <div
            className="skill-capsule"
            style={capsuleStyle}
            onMouseEnter={(e) => {
                setIsHovered(true);
                if (link) {
                    onHover(link, e);
                }
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                onLeave();
            }}
            onClick={() => {
                if (link) {
                    onClick(link);
                }
            }}
        >
            <span>{name}</span>
        </div>
    );
};

const SkillSection = ({
    sectionName,
    skills,
    onSkillHover,
    onSkillLeave,
    onSkillClick,
    colors,
}) => {
    const titleStyle = {
        color: colors.sectionTitle,
    };

    return (
        <div className="skill-section">
            <h3 className="section-title" style={titleStyle}>
                {sectionName}
            </h3>
            <div className="skills-container">
                {skills.map((skill, index) => {
                    const skillName = Object.keys(skill)[0];
                    const skillLink = skill[skillName];
                    return (
                        <SkillCapsule
                            key={index}
                            name={skillName}
                            link={skillLink}
                            onHover={onSkillHover}
                            onLeave={onSkillLeave}
                            onClick={onSkillClick}
                            colors={colors}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const HoverPreview = ({ url, position, colors, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHoveringPreview, setIsHoveringPreview] = useState(false);

    React.useEffect(() => {
        if (url) {
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [url]);

    const handlePreviewClick = () => {
        if (url) {
            window.location.href = url;
        }
    };

    if (!url) return null;

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

const Skills = ({ content, colors }) => {
    const [hoverData, setHoverData] = useState({
        url: null,
        position: { centerX: 0, top: 0, bottom: 0 },
    });
    const [keepPreviewOpen, setKeepPreviewOpen] = useState(false);

    const handleSkillHover = (url, event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setHoverData({
            url: url,
            position: {
                centerX: rect.left + rect.width / 2,
                top: rect.top,
                bottom: rect.bottom,
            },
        });
        setKeepPreviewOpen(true);
    };

    const handleSkillLeave = () => {
        setTimeout(() => {
            if (!keepPreviewOpen) {
                setHoverData({
                    url: null,
                    position: { centerX: 0, top: 0, bottom: 0 },
                });
            }
        }, 100);
    };

    const handlePreviewClose = () => {
        setKeepPreviewOpen(false);
        setHoverData({
            url: null,
            position: { centerX: 0, top: 0, bottom: 0 },
        });
    };

    const handleSkillClick = (url) => {
        window.location.href = url;
    };

    const containerStyle = {
        backgroundColor: colors.background,
    };

    const mainTitleStyle = {
        color: colors.mainTitle,
    };

    return (
        <div className="skills-container" style={containerStyle}>
            <h2 className="main-title" style={mainTitleStyle}>
                Skills
            </h2>

            {Object.entries(content).map(([sectionName, skills], index) => (
                <SkillSection
                    key={index}
                    sectionName={sectionName}
                    skills={skills}
                    onSkillHover={handleSkillHover}
                    onSkillLeave={handleSkillLeave}
                    onSkillClick={handleSkillClick}
                    colors={colors}
                />
            ))}

            <HoverPreview
                url={hoverData.url}
                position={hoverData.position}
                colors={colors}
                onClose={handlePreviewClose}
            />
        </div>
    );
};

export default Skills;
