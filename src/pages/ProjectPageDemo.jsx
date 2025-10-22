import React from "react";
import ProjectPage from "../components/ProjectPage";

/**
 * ProjectPageDemo - Demo component for testing ProjectPage
 *
 * To use this demo:
 * 1. Make sure your project files are in the correct location:
 *    - src/pages/projects/DataMining1/dataMining1.json
 *    - src/pages/projects/DataMining1/dataMining1.html
 *    - src/pages/projects/DataMining1/heatmap.png
 *    - src/pages/projects/DataMining1/learningCurve.PNG
 *
 * 2. Import this component in your App.jsx:
 *    import ProjectPageDemo from './pages/ProjectPageDemo';
 *
 * 3. Add a route in your App.jsx:
 *    <Route path="/project-demo" element={<ProjectPageDemo />} />
 *
 * 4. Navigate to /project-demo in your browser
 */
const ProjectPageDemo = () => {
    return (
        <ProjectPage
            projectFolderName="DataMining1"
            projectsFolder="/src/pages/projects/"
            imageNames={["heatmap.png", "learningCurve.png"]}
        />
    );
};

export default ProjectPageDemo;
