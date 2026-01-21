"use client";
import React from 'react';
import { BookOpen, Upload, Settings, Home } from 'lucide-react';
import GlassSurface from './GlassSurface';
import Link from 'next/link';
import { useReading } from '@/context/ReadingContext';

export default function Navigation() {
    const { setShowSettings } = useReading();

    return (
        <GlassSurface
            as="nav"
            intensity="high"
            style={{
                position: 'fixed',
                top: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '2.5rem',
                padding: '0.8rem 2.5rem',
                borderRadius: '100px',
                zIndex: 1000,
                alignItems: 'center'
            }}
        >
            <Link href="/">
                <NavIcon icon={Home} label="Home" />
            </Link>

            <Link href="/read">
                <NavIcon icon={BookOpen} label="Read" />
            </Link>

            <Link href="/">
                <NavIcon icon={Upload} label="Upload" />
            </Link>

            <div role="button" onClick={() => setShowSettings(true)}>
                <NavIcon icon={Settings} label="Settings" />
            </div>
        </GlassSurface>
    );
}

function NavIcon({ icon: Icon, label }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            transition: 'transform 0.2s',
        }}
            className="nav-icon"
        >
            <Icon size={22} color="var(--text-primary)" strokeWidth={1.5} />
        </div>
    )
}
