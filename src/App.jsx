// src/App.jsx
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import { Home as HomeIcon, User, Briefcase, FileText } from "lucide-react";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Resume from "./pages/Resume";
import "./styles/App.css"
import "./styles/text.css"

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
                brandFontSize="1.7rem"
                linkFontSize="1.2rem"
                iconSize={35}
                navItems={[
                    { path: "/", label: "Home", icon: HomeIcon },
                    { path: "/about", label: "About", icon: User },
                    { path: "/projects", label: "Projects", icon: Briefcase },
                    { path: "/resume", label: "Resume", icon: FileText },
                ]}
            />
            <Container className="mt-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/resume" element={<Resume />} />
                </Routes>
            </Container>
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
