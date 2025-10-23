import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectPage from "./ProjectPage";
import "./styles/ProjectPageWrapper.css";

/**
 * ProjectPageWrapper - Dynamic wrapper for ProjectPage component
 *
 * This component:
 * 1. Reads the project slug from the URL (e.g., /projects/data-mining-1)
 * 2. Loads all project JSON files to find the matching project
 * 3. Extracts image filenames from the project data
 * 4. Passes the correct props to ProjectPage component
 *
 * Usage in App.jsx:
 * import ProjectPageWrapper from './pages/ProjectPageWrapper';
 *
 * <Route path="/projects/:projectSlug" element={<ProjectPageWrapper />} />
 */
const ProjectPageWrapper = () => {
    const { projectSlug } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectData, setProjectData] = useState(null);

    useEffect(() => {
        loadProjectData();
    }, [projectSlug]);

    const loadProjectData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load all project JSON files
            const projectModules = import.meta.glob(
                "/src/pages/projects/**/*.json"
            );

            let foundProject = null;
            let projectFolderName = null;

            // Find the matching project by comparing URL slug
            for (const path in projectModules) {
                try {
                    const folderMatch = path.match(
                        /\/src\/pages\/projects\/([^/]+)\//
                    );
                    const folderName = folderMatch ? folderMatch[1] : "";

                    // Create URL slug from folder name
                    const urlSlug = folderName
                        .toLowerCase()
                        .replace(/\s+/g, "-");

                    // Check if this is the project we're looking for
                    if (urlSlug === projectSlug) {
                        const module = await projectModules[path]();
                        foundProject = module.default;
                        projectFolderName = folderName;
                        break;
                    }
                } catch (error) {
                    console.error(`Error loading project from ${path}:`, error);
                }
            }

            if (!foundProject || !projectFolderName) {
                setError("Project not found");
                setLoading(false);
                return;
            }

            // Extract image names from the project data
            const imageNames = extractImageNames(foundProject);

            setProjectData({
                projectFolderName,
                imageNames,
                projectInfo: foundProject,
            });

            setLoading(false);
        } catch (error) {
            console.error("Error loading project:", error);
            setError("Failed to load project");
            setLoading(false);
        }
    };

    /**
     * Extract image filenames from project data
     * Looks for common image fields and file extensions
     */
    const extractImageNames = (projectData) => {
        const imageNames = [];
        const imageExtensions = [
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".webp",
            ".svg",
        ];

        // Recursively search through the project data for image references
        const findImages = (obj) => {
            if (typeof obj === "string") {
                // Check if string ends with image extension
                const lowerStr = obj.toLowerCase();
                if (imageExtensions.some((ext) => lowerStr.endsWith(ext))) {
                    // Extract just the filename if it's a path
                    const filename = obj.split("/").pop();
                    if (!imageNames.includes(filename)) {
                        imageNames.push(filename);
                    }
                }
            } else if (Array.isArray(obj)) {
                obj.forEach((item) => findImages(item));
            } else if (obj && typeof obj === "object") {
                Object.values(obj).forEach((value) => findImages(value));
            }
        };

        findImages(projectData);

        // Also check for common image field names
        const commonImageFields = [
            "images",
            "screenshots",
            "diagrams",
            "charts",
            "figures",
        ];
        commonImageFields.forEach((field) => {
            if (projectData[field]) {
                if (Array.isArray(projectData[field])) {
                    projectData[field].forEach((img) => {
                        if (
                            typeof img === "string" &&
                            !imageNames.includes(img)
                        ) {
                            imageNames.push(img);
                        }
                    });
                }
            }
        });

        return imageNames;
    };

    if (loading) {
        return (
            <div className="loading-message">
                <div className="loading-spinner"></div>
                <p>Loading project...</p>
            </div>
        );
    }

    if (error || !projectData) {
        return (
            <div className="error-message">
                <h2>Project Not Found</h2>
                <p>{error || "The requested project could not be found."}</p>
                <button
                    onClick={() => navigate("/projects")}
                    className="back-button"
                >
                    ← Back to Projects
                </button>
            </div>
        );
    }

    return (
        <ProjectPage
            projectFolderName={projectData.projectFolderName}
            projectsFolder="/src/pages/projects/"
            imageNames={projectData.imageNames}
        />
    );
};

export default ProjectPageWrapper;
