import React from 'react';

/**
 * GlassSurface Component
 * Renders a container with the glassmorphism effect.
 * Uses the global .glass-panel class but allows for overrides.
 */
export default function GlassSurface({
    children,
    className = '',
    intensity = 'medium', // future proofing for different blur levels
    ...props
}) {
    return (
        <div
            className={`glass-panel ${className}`}
            {...props}
            style={{
                ...props.style,
                // Optional: dynamic styles based on intensity could go here
            }}
        >
            {children}
        </div>
    );
}
