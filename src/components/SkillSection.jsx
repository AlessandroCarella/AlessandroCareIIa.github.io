import React from "react";
import TextCapsule from "./text/TextCapsule";
import "./styles/SkillSection.css";

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
            <h3 className="heading-sm" style={titleStyle}>
                {sectionName}
            </h3>
            <div className="skills-list">
                {skills.map((skill, index) => {
                    const skillName = Object.keys(skill)[0];
                    const skillLink = skill[skillName];
                    return (
                        <TextCapsule
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

export default SkillSection;
