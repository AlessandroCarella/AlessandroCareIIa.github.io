import React, { useEffect } from "react";
import { Check } from "lucide-react";
import "./styles/Notification.css";

const Notification = ({ message, isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, duration]);

    if (!isVisible) return null;

    return (
        <div className={`notification ${isVisible ? "show" : ""}`}>
            <div className="notification-content">
                <Check size={20} className="notification-icon" />
                <span className="notification-message">{message}</span>
            </div>
        </div>
    );
};

export default Notification;
