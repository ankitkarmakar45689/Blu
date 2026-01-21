"use client";
import React from 'react';
import GlassSurface from './GlassSurface';
import { useReading } from '@/context/ReadingContext';
import { X, Sun, Eye, Type, Droplet } from 'lucide-react';

export default function SettingsPanel() {
    const { settings, setSettings, showSettings, setShowSettings } = useReading();

    if (!showSettings) return null;

    const handleChange = (key, value) => {
        console.log('Settings change:', key, value); // Debug log
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                display: 'flex',
                justifyContent: 'flex-end',
                pointerEvents: 'none'
            }}
        >
            {/* Overlay to close */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'auto',
                    background: 'rgba(0,0,0,0.3)'
                }}
                onClick={() => setShowSettings(false)}
            />

            {/* Panel */}
            <GlassSurface
                intensity="high"
                className="settings-panel"
                style={{
                    position: 'relative',
                    width: '320px',
                    height: '100%',
                    pointerEvents: 'auto',
                    borderLeft: '1px solid var(--glass-border)',
                    borderRight: 'none',
                    borderRadius: '20px 0 0 20px',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    overflowY: 'auto',
                    zIndex: 10001
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Reading Settings</h2>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowSettings(false);
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            padding: '8px'
                        }}
                    >
                        <X />
                    </button>
                </div>

                {/* Brightness */}
                <div className="setting-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Sun size={16} /> Brightness ({settings.brightness})
                    </label>
                    <input
                        type="range"
                        min="50"
                        max="150"
                        value={settings.brightness}
                        onChange={(e) => {
                            e.stopPropagation();
                            handleChange('brightness', Number(e.target.value));
                        }}
                        onInput={(e) => {
                            e.stopPropagation();
                            handleChange('brightness', Number(e.target.value));
                        }}
                        style={{
                            width: '100%',
                            cursor: 'pointer',
                            accentColor: 'var(--accent-primary)'
                        }}
                    />
                </div>

                {/* Blue Light (Warmth) */}
                <div className="setting-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Eye size={16} /> Blue Light Filter ({settings.blueLight})
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="80"
                        value={settings.blueLight}
                        onChange={(e) => {
                            e.stopPropagation();
                            handleChange('blueLight', Number(e.target.value));
                        }}
                        onInput={(e) => {
                            e.stopPropagation();
                            handleChange('blueLight', Number(e.target.value));
                        }}
                        style={{
                            width: '100%',
                            cursor: 'pointer',
                            accentColor: 'orange'
                        }}
                    />
                </div>

                {/* Sepia */}
                <div className="setting-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Droplet size={16} /> Sepia ({settings.sepia})
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.sepia}
                        onChange={(e) => {
                            e.stopPropagation();
                            handleChange('sepia', Number(e.target.value));
                        }}
                        onInput={(e) => {
                            e.stopPropagation();
                            handleChange('sepia', Number(e.target.value));
                        }}
                        style={{
                            width: '100%',
                            cursor: 'pointer',
                            accentColor: 'var(--accent-warm)'
                        }}
                    />
                </div>

                {/* Font Size */}
                <div className="setting-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Type size={16} /> Text Size ({settings.fontSize}px)
                    </label>
                    <input
                        type="range"
                        min="12"
                        max="32"
                        value={settings.fontSize}
                        onChange={(e) => {
                            e.stopPropagation();
                            handleChange('fontSize', Number(e.target.value));
                        }}
                        onInput={(e) => {
                            e.stopPropagation();
                            handleChange('fontSize', Number(e.target.value));
                        }}
                        style={{
                            width: '100%',
                            cursor: 'pointer'
                        }}
                    />
                </div>

                {/* Themes */}
                <div className="setting-group">
                    <label style={{ marginBottom: '8px', display: 'block' }}>Theme</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['dark', 'light', 'paper'].map(t => (
                            <button
                                key={t}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleChange('theme', t);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: settings.theme === t ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                                    background: t === 'dark' ? '#111' : t === 'light' ? '#fff' : '#f4ecd8',
                                    color: t === 'light' || t === 'paper' ? '#000' : '#fff',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                    fontWeight: settings.theme === t ? 'bold' : 'normal'
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

            </GlassSurface>
        </div>
    );
}
