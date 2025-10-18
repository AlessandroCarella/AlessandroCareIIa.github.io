import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, User, Briefcase, FileText } from "lucide-react";
import "./styles/Navigation.css";

function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const menuRef = useRef(null);
    const toggleRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isMobileMenuOpen &&
                menuRef.current &&
                toggleRef.current &&
                !menuRef.current.contains(event.target) &&
                !toggleRef.current.contains(event.target)
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileMenuOpen]);

    const navItems = [
        { path: "/", label: "Home", icon: Home },
        { path: "/about", label: "About", icon: User },
        { path: "/projects", label: "Projects", icon: Briefcase },
        { path: "/resume", label: "Resume", icon: FileText },
    ];

    return (
        <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
            <div className="nav-container">
                <div className="nav-brand-wrapper">
                    <Link to="/" className="nav-brand">
                        <span className="brand-first">Alessandro Carella</span>
                    </Link>
                </div>

                <div
                    ref={menuRef}
                    className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}
                >
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${
                                    location.pathname === item.path
                                        ? "active"
                                        : ""
                                }`}
                                style={{ "--item-index": index }}
                            >
                                <Icon size={24} />
                                <span>{item.label}</span>
                                <span className="link-underline"></span>
                            </Link>
                        );
                    })}
                </div>

                <button
                    ref={toggleRef}
                    className={`mobile-toggle ${
                        isMobileMenuOpen ? "open" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle navigation"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}

export default Navigation;
