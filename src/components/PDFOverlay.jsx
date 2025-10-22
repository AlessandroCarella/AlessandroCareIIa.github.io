import React from "react";
import { X } from "lucide-react";
import "./styles/PDFOverlay.css";

const PDFOverlay = ({ pdfPath, onClose, title = "Document" }) => {
    const handleOverlayClick = (e) => {
        if (e.target.className === "pdf-overlay") {
            onClose();
        }
    };

    return (
        <div className="pdf-overlay" onClick={handleOverlayClick}>
            <div className="pdf-overlay-content">
                {/* Header */}
                <div className="pdf-overlay-header">
                    <h2 className="heading-md pdf-overlay-title">{title}</h2>
                    <div className="pdf-overlay-controls">
                        <button
                            className="pdf-control-button pdf-close-button"
                            onClick={onClose}
                            title="Close"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="pdf-viewer-container">
                    <iframe
                        src={pdfPath}
                        className="pdf-viewer"
                        title={title}
                    />
                </div>
            </div>
        </div>
    );
};

export default PDFOverlay;
