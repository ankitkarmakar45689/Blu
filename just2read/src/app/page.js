"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Link as LinkIcon, FileText, ArrowRight, Zap } from 'lucide-react';
import GlassSurface from '@/components/GlassSurface';
import { useReading } from '@/context/ReadingContext';

export default function Home() {
  const router = useRouter();
  const { setFileContent, setFileName, setSourceType } = useReading();
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setIsLoading(true);
    setFileName(file.name);
    setSourceType(file.type === 'application/pdf' ? 'pdf' : 'text');

    // Simulate processing
    setTimeout(async () => {
      if (file.type === 'application/pdf') {
        setFileContent(file); // Pass Blob
      } else {
        const text = await file.text();
        setFileContent(text);
      }
      setIsLoading(false);
      router.push('/read'); // We need to create this page next!
    }, 800);
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!urlInput) return;
    setFileName("Web Article");
    setSourceType('url');
    setFileContent(urlInput); // In real app, we'd fetch content here or on Reader page
    router.push('/read');
  };

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0f0f13 100%)'
    }}>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', zIndex: 10 }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: '900',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #fff 0%, #aaa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-2px'
        }}>
          Just<span style={{ color: 'var(--accent-primary)', WebkitTextFillColor: 'initial' }}>2</span>Read
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          The future of healthy digital reading. Distraction-free, eye-caring, and beautifully designed.
        </p>
      </div>

      {/* Upload & Action Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', width: '100%', maxWidth: '900px' }}>

        {/* Drag & Drop Zone */}
        <GlassSurface
          intensity="high"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            padding: '4rem',
            textAlign: 'center',
            cursor: 'pointer',
            border: dragActive ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
            transform: dragActive ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem'
          }}
        >
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept=".pdf,.txt,.md,.epub"
          />
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '1.5rem',
            borderRadius: '50%',
            color: 'var(--accent-primary)'
          }}>
            <Upload size={48} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Drop your book here</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Supports PDF, EPUB, TXT</p>
          </div>
          <label
            htmlFor="file-upload"
            style={{
              padding: '0.8rem 2rem',
              background: 'var(--accent-primary)',
              color: '#000',
              fontWeight: 'bold',
              borderRadius: '30px',
              cursor: 'pointer',
              marginTop: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FileText size={18} /> Browse Files
          </label>
        </GlassSurface>

        {/* URL Paste & Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

          {/* URL Input */}
          <GlassSurface style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LinkIcon size={20} color="var(--accent-secondary)" /> Paste Article Link
            </h3>
            <form onSubmit={handleUrlSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="https://amazon.com/..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--glass-border)',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  color: '#fff',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--glass-bg-hover)',
                  border: '1px solid var(--glass-border)',
                  color: '#fff',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                <ArrowRight size={20} />
              </button>
            </form>
          </GlassSurface>

          {/* Feature Highlight */}
          <GlassSurface style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(255, 170, 0, 0.1)', padding: '1rem', borderRadius: '12px' }}>
              <Zap size={24} color="var(--accent-warm)" />
            </div>
            <div>
              <h4 style={{ marginBottom: '0.2rem' }}>Eye Care Active</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Blue light filter ready.</p>
            </div>
          </GlassSurface>

        </div>
      </div>
    </main>
  );
}
