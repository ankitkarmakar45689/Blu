"use client";
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useReading } from '@/context/ReadingContext';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Reader() {
    const { fileContent, sourceType, settings } = useReading();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [windowWidth, setWindowWidth] = useState(800);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    // Derived styles
    const containerStyle = {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '120px 20px 150px', // Header spacing + Bottom spacing
        minHeight: '100vh',
        fontFamily: settings.theme === 'paper' ? 'Georgia, serif' : 'inherit',
        color: 'var(--text-primary)',
        transform: `scale(${settings.pageZoom / 100})`,
        transformOrigin: 'top center',
        lineHeight: settings.lineHeight,
    };

    if (!fileContent) {
        return (
            <div style={{ ...containerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>No document loaded. Please return Home.</p>
            </div>
        );
    }

    return (
        <div className="reader-view" style={containerStyle}>
            {sourceType === 'pdf' ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Document
                        file={fileContent}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<div style={{ display: 'flex', gap: '10px' }}><Loader className="animate-spin" /> Loading PDF...</div>}
                        error={<div>Failed to load PDF. Please try another file.</div>}
                    >
                        <Page
                            pageNumber={pageNumber}
                            width={Math.min(windowWidth * 0.9, 850)}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="glass-panel" // Wrap page in glass? Or maybe just the paper?
                        // Let's add specific style to page canvas via className or custom
                        />
                    </Document>

                    {/* Floating Navigation Controls for PDF */}
                    {numPages && (
                        <div className="glass-panel" style={{
                            position: 'fixed',
                            bottom: '40px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            padding: '0.8rem 2rem',
                            borderRadius: '50px',
                            zIndex: 50
                        }}>
                            <button
                                onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                                disabled={pageNumber <= 1}
                                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: pageNumber <= 1 ? 0.3 : 1 }}
                            >
                                <ChevronLeft />
                            </button>

                            <span style={{ fontWeight: 'bold' }}>{pageNumber} / {numPages}</span>

                            <button
                                onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                                disabled={pageNumber >= numPages}
                                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: pageNumber >= numPages ? 0.3 : 1 }}
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-content" style={{ whiteSpace: 'pre-wrap' }}>
                    {typeof fileContent === 'string' ? fileContent : "Content format not supported."}
                </div>
            )}
        </div>
    );
}
