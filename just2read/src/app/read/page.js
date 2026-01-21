"use client";
import React from 'react';
import Reader from '@/components/Reader';
import { useReading } from '@/context/ReadingContext';
import { useRouter } from 'next/navigation';

export default function ReadPage() {
    const { fileContent } = useReading();
    const router = useRouter();

    React.useEffect(() => {
        if (!fileContent) {
            // Typically redirect, but for dev maybe alert?
            // router.push('/');
        }
    }, [fileContent, router]);

    return (
        <main style={{ minHeight: '100vh', position: 'relative' }}>
            <Reader />
        </main>
    );
}
