import React, { useState } from "react";
import SkillSection from "./SkillSection";
import HoverPreview from "./HoverPreview";
import "./styles/Skills.css";

const Skills = ({ content, colors, title = "" }) => {
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
        <div className="skills-main-container" style={containerStyle}>
            {title && (
                <h2 className="main-title" style={mainTitleStyle}>
                    {title}
                </h2>
            )}

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
                isOpen={keepPreviewOpen}
                onClose={handlePreviewClose}
            />
        </div>
    );
};

export default Skills;
