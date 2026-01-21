"use client";
import React from 'react';
import GlassSurface from './GlassSurface';
import { useReading } from '@/context/ReadingContext';
import { X, Sun, Eye, Type, Droplet } from 'lucide-react';

export default function SettingsPanel() {
    const { settings, setSettings, showSettings, setShowSettings } = useReading();

    if (!showSettings) return null;

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', justifyContent: 'flex-end', pointerEvents: 'none' }}>
            {/* Overlay to close */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }} onClick={() => setShowSettings(false)} />

            {/* Panel */}
            <GlassSurface
                intensity="high"
                className="settings-panel"
                style={{
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
                    overflowY: 'auto'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Reading Settings</h2>
                    <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                        <X />
                    </button>
                </div>

                {/* Brightness */}
                <div className="setting-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><Sun size={16} /> Brightness</label>
                    <input
                        type="range" min="50" max="150"
                        value={settings.brightness}
                        onChange={(e) => handleChange('brightness', Number(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>

                {/* Blue Light (Warmth) */}
                <div className="setting-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><Eye size={16} /> Blue Light Filter</label>
                    <input
                        type="range" min="0" max="80"
                        value={settings.blueLight}
                        onChange={(e) => handleChange('blueLight', Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'orange' }}
                    />
                </div>

                {/* Sepia */}
                <div className="setting-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><Droplet size={16} /> Sepia</label>
                    <input
                        type="range" min="0" max="100"
                        value={settings.sepia}
                        onChange={(e) => handleChange('sepia', Number(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>

                {/* Font Size */}
                <div className="setting-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><Type size={16} /> Text Size ({settings.fontSize}px)</label>
                    <input
                        type="range" min="12" max="32"
                        value={settings.fontSize}
                        onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>

                {/* Themes */}
                <div className="setting-group">
                    <label style={{ marginBottom: '8px', display: 'block' }}>Theme</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['dark', 'light', 'paper'].map(t => (
                            <button
                                key={t}
                                onClick={() => handleChange('theme', t)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: settings.theme === t ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                                    background: t === 'dark' ? '#111' : t === 'light' ? '#fff' : '#f4ecd8',
                                    color: t === 'light' || t === 'paper' ? '#000' : '#fff',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize'
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
