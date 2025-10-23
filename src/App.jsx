// src/App.jsx
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { Home as HomeIcon, User, Briefcase, FileText } from "lucide-react";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Resume from "./pages/Resume";
import "./styles/App.css";
import "./styles/text.css";
import ProjectPageDemo from './pages/ProjectPageDemo';

const WIPpage = "/project-demo";

function AppContent() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <>
            <Navigation
                brandName="Alessandro Carella"
                currentPath={location.pathname}
                onNavigate={handleNavigate}
                backgroundColor="#010409"
                textColor="#f0f6fc"
                brandFontSize="2.3rem"
                linkFontSize="1.3rem"
                iconSize={35}
                navItems={[
                    { path: "/home", label: "Home", icon: HomeIcon },
                    { path: "/about", label: "About", icon: User },
                    { path: "/projects", label: "Projects", icon: Briefcase },
                    { path: "/resume", label: "Resume", icon: FileText },
                ]}
            />
            <div className="app-container mt-4">
                <Routes>
                    <Route path="/project-demo" element={<ProjectPageDemo />} />
                    <Route
                        path="/"
                        element={<Navigate to={WIPpage} replace />}
                    />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/resume" element={<Resume />} />
                </Routes>
            </div>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
