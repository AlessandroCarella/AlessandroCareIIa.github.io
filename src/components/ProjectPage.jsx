import React, { useState, useEffect } from "react";
import TextCapsule from "./text/TextCapsule";
import SkillSection from "./SkillSection";
import PDFOverlay from "./PDFOverlay";
import { Github, Linkedin, FileText } from "lucide-react";
import "./styles/ProjectPage.css";

const ProjectPage = ({
    projectFolderName,
    projectsFolder = "/src/pages/projects/",
    imageNames = [],
}) => {
    const [projectData, setProjectData] = useState(null);
    const [htmlContent, setHtmlContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activePDF, setActivePDF] = useState(null);

    useEffect(() => {
        const loadProjectData = async () => {
            try {
                setLoading(true);

                // Construct paths
                const basePath = `${projectsFolder}${projectFolderName}`;
                const jsonPath = `${basePath}/${projectFolderName}.json`;
                const htmlPath = `${basePath}/${projectFolderName}.html`;

                // Load JSON
                const jsonResponse = await fetch(jsonPath);
                if (!jsonResponse.ok)
                    throw new Error("Failed to load project JSON");
                const jsonData = await jsonResponse.json();
                setProjectData(jsonData);

                // Load HTML
                const htmlResponse = await fetch(htmlPath);
                if (!htmlResponse.ok)
                    throw new Error("Failed to load project HTML");
                let htmlText = await htmlResponse.text();

                // Replace image paths with correct paths
                imageNames.forEach((imageName) => {
                    const imagePath = `${basePath}/${imageName}`;
                    htmlText = htmlText.replace(
                        new RegExp(`src="${imageName}"`, "g"),
                        `src="${imagePath}"`
                    );
                });

                setHtmlContent(htmlText);
                setLoading(false);
            } catch (err) {
                console.error("Error loading project data:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        if (projectFolderName) {
            loadProjectData();
        }
    }, [projectFolderName, projectsFolder, imageNames]);

    // Process HTML content and apply custom classes
    const processHtmlContent = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Apply custom classes to elements
        doc.querySelectorAll("h1").forEach(
            (el) => (el.className = "heading-xl")
        );
        doc.querySelectorAll("h2").forEach(
            (el) => (el.className = "heading-lg")
        );
        doc.querySelectorAll("h3").forEach(
            (el) => (el.className = "heading-md")
        );
        doc.querySelectorAll("h4").forEach(
            (el) => (el.className = "heading-md")
        );
        doc.querySelectorAll("p").forEach((el) => (el.className = "paragraph"));
        doc.querySelectorAll("a").forEach((el) => (el.className = "text-link"));
        doc.querySelectorAll("img").forEach((el) => {
            el.className = "project-image";
        });
        doc.querySelectorAll("strong").forEach(
            (el) => (el.className = "text-emphasis")
        );
        doc.querySelectorAll("em").forEach(
            (el) => (el.style.fontStyle = "italic")
        );

        return doc.body.innerHTML;
    };

    // Extract collaborator names from LinkedIn URLs
    const getCollaboratorName = (url) => {
        try {
            const match = url.match(/\/in\/([^/]+)\/?$/);
            if (match) {
                // Convert URL-encoded name to readable format and split by "-"
                const rawParts = match[1]
                    .replace(/%C3%A9/g, "é")
                    .replace(/%C3%AD/g, "í")
                    .split("-");

                // Remove any part containing digits
                const filteredParts = rawParts.filter(
                    (part) => !/\d/.test(part)
                );

                // Capitalize each part and join with space
                const name = filteredParts
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                return name;
            }
        } catch (e) {
            console.error("Error parsing collaborator name:", e);
        }
        return "Collaborator";
    };

    // Extract repository name from GitHub URL
    const getRepositoryName = (url) => {
        try {
            const match = url.match(/github\.com\/[^/]+\/([^/]+)/);
            return match ? match[1] : "Repository";
        } catch (e) {
            console.error("Error parsing repository name:", e);
            return "Repository";
        }
    };

    // Convert keyWords object to SkillSection format
    const formatKeyWords = (keyWords) => {
        if (!keyWords) return {};

        const formatted = {};
        Object.entries(keyWords).forEach(([category, items]) => {
            // Convert category name to title case with spaces
            const categoryName = category
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            // Convert items array to array of objects with null values (no links)
            formatted[categoryName] = items.map((item) => ({ [item]: null }));
        });

        return formatted;
    };

    // Get PDF path
    const getPDFPath = (filename) => {
        const basePath = `${projectsFolder}${projectFolderName}`;
        return `${basePath}/${filename}`;
    };

    // Handle PDF open
    const handleOpenPDF = (type, filename) => {
        setActivePDF({
            type,
            path: getPDFPath(filename),
        });
    };

    // Handle PDF close
    const handleClosePDF = () => {
        setActivePDF(null);
    };

    if (loading) {
        return (
            <div className="project-page-container">
                <div className="loading-message">
                    <p className="paragraph">Loading project data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="project-page-container">
                <div className="error-message">
                    <h2 className="heading-lg">Error Loading Project</h2>
                    <p className="paragraph">{error}</p>
                </div>
            </div>
        );
    }

    if (!projectData) {
        return null;
    }

    const colors = {
        background: "transparent",
        mainTitle: "#f0f6fc",
        sectionTitle: "#c9d1d9",
    };

    return (
        <div className="project-page-wrapper">
            {/* Project Title - Full Width */}
            <div className="project-title-section">
                <h1 className="heading-xl project-main-title">
                    {projectData.projectName}
                </h1>
            </div>

            <div className="project-page-container">
                {/* Main Content - 70% */}
                <main className="project-main-content">
                    <div
                        className="project-content-wrapper"
                        dangerouslySetInnerHTML={{
                            __html: processHtmlContent(htmlContent),
                        }}
                    />
                </main>

                {/* Sidebar - 30% */}
                <aside className="project-sidebar">
                    <div className="project-sidebar-content">
                        {/* Collaborators */}
                        {projectData.collaborators &&
                            projectData.collaborators.length > 0 && (
                                <div className="project-sidebar-section">
                                    <h3 className="heading-md sidebar-section-title">
                                        Collaborators
                                    </h3>
                                    <div className="sidebar-items">
                                        {projectData.collaborators.map(
                                            (url, index) => (
                                                <TextCapsule
                                                    key={`collab-${index}`}
                                                    name={getCollaboratorName(
                                                        url
                                                    )}
                                                    link={url}
                                                    icon={
                                                        <Linkedin size={16} />
                                                    }
                                                    fontSize={16}
                                                    onClick={(link) =>
                                                        window.open(
                                                            link,
                                                            "_blank",
                                                            "noopener,noreferrer"
                                                        )
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Repository */}
                        {projectData.repository && (
                            <div className="project-sidebar-section">
                                <h3 className="heading-md sidebar-section-title">
                                    Repository
                                </h3>
                                <div className="sidebar-items">
                                    <TextCapsule
                                        name={getRepositoryName(
                                            projectData.repository
                                        )}
                                        link={projectData.repository}
                                        icon={<Github size={16} />}
                                        fontSize={16}
                                        onClick={(link) =>
                                            window.open(
                                                link,
                                                "_blank",
                                                "noopener,noreferrer"
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {/* Report PDF */}
                        {projectData.report && (
                            <div className="project-sidebar-section">
                                <h3 className="heading-md sidebar-section-title">
                                    Report
                                </h3>
                                <div className="sidebar-items">
                                    <TextCapsule
                                        name="View Report"
                                        link={projectData.report}
                                        icon={<FileText size={16} />}
                                        fontSize={16}
                                        onClick={() =>
                                            handleOpenPDF(
                                                "Report",
                                                projectData.report
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {/* Slides PDF */}
                        {projectData.slides && (
                            <div className="project-sidebar-section">
                                <h3 className="heading-md sidebar-section-title">
                                    Slides
                                </h3>
                                <div className="sidebar-items">
                                    <TextCapsule
                                        name="View Slides"
                                        icon={<FileText size={16} />}
                                        fontSize={16}
                                        onClick={() =>
                                            handleOpenPDF(
                                                "Slides",
                                                projectData.slides
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {/* Keywords */}
                        {projectData.keyWords && (
                            <div className="project-sidebar-section keywords-section">
                                <h3 className="heading-md sidebar-section-title">
                                    Keywords
                                </h3>
                                <div className="keywords-wrapper">
                                    {Object.entries(
                                        formatKeyWords(projectData.keyWords)
                                    ).map(([category, items], index) => (
                                        <SkillSection
                                            key={`keyword-${index}`}
                                            sectionName={category}
                                            skills={items}
                                            colors={colors}
                                            onSkillClick={() => {}}
                                            onSkillHover={() => {}}
                                            onSkillLeave={() => {}}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            {/* PDF Overlay */}
            {activePDF && (
                <PDFOverlay
                    pdfPath={activePDF.path}
                    title={activePDF.type}
                    onClose={handleClosePDF}
                />
            )}
        </div>
    );
};

export default ProjectPage;
