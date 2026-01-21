"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const ReadingContext = createContext();

export function ReadingProvider({ children }) {
    const [fileContent, setFileContent] = useState(null);
    const [fileName, setFileName] = useState("");
    const [sourceType, setSourceType] = useState(null);
    const [showSettings, setShowSettings] = useState(false);

    // Eye Care Settings
    const [settings, setSettings] = useState({
        brightness: 100, // 50-150
        sepia: 0, // 0-100
        blueLight: 0, // 0-100 (opacity of orange overlay)
        theme: 'dark', // 'light', 'night', 'paper'
        fontSize: 18,
        lineHeight: 1.6,
    });

    // Apply CSS Variables globally
    useEffect(() => {
        console.log('Applying settings:', settings); // Debug log

        const root = document.documentElement;
        root.style.setProperty('--filter-brightness', settings.brightness / 100);
        root.style.setProperty('--filter-sepia', settings.sepia / 100);
        root.style.setProperty('--blue-light-opacity', settings.blueLight / 100);

        console.log('CSS Variables set:', {
            brightness: settings.brightness / 100,
            sepia: settings.sepia / 100,
            blueLight: settings.blueLight / 100
        });

        // Theme logic
        if (settings.theme === 'light') {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--text-primary', '#1a1a1a');
            root.style.setProperty('--glass-bg', 'rgba(0,0,0,0.05)');
        } else if (settings.theme === 'dark') {
            root.style.setProperty('--bg-primary', '#0f0f13');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--glass-bg', 'rgba(255,255,255,0.03)');
        } else if (settings.theme === 'paper') {
            root.style.setProperty('--bg-primary', '#f4ecd8');
            root.style.setProperty('--text-primary', '#3b3b3b');
            root.style.setProperty('--glass-bg', 'rgba(0,0,0,0.03)');
        }

    }, [settings]);

    return (
        <ReadingContext.Provider value={{
            fileContent, setFileContent,
            fileName, setFileName,
            sourceType, setSourceType,
            settings, setSettings,
            showSettings, setShowSettings
        }}>
            {children}
        </ReadingContext.Provider>
    );
}

export function useReading() {
    return useContext(ReadingContext);
}
