import React, { useState, useEffect, useRef } from 'react';

interface LogoProps {
  className?: string;
  showUploadTrigger?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-8', showUploadTrigger = false }) => {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Check localStorage for any previously uploaded logo
  useEffect(() => {
    const saved = localStorage.getItem('shift_earth_custom_logo');
    if (saved) {
      setCustomLogoUrl(saved);
    } else {
      // Check if user uploaded a file to public/logo.png or logo.svg
      const testImg = new Image();
      testImg.src = '/logo.png';
      testImg.onload = () => setCustomLogoUrl('/logo.png');
      testImg.onerror = () => {
        const testSvg = new Image();
        testSvg.src = '/logo.svg';
        testSvg.onload = () => setCustomLogoUrl('/logo.svg');
      };
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        if (res) {
          setCustomLogoUrl(res);
          localStorage.setItem('shift_earth_custom_logo', res);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative inline-flex items-center gap-2 group">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload custom team logo"
      />

      {customLogoUrl ? (
        <img
          src={customLogoUrl}
          alt="Shift + Earth Team Logo"
          className={`${className} object-contain rounded-md`}
        />
      ) : (
        /* Default distinctive Shift + Earth SVG insignia */
        <div className={`${className} relative flex items-center justify-center bg-gradient-to-br from-cyan-400 to-teal-500 rounded-lg p-1.5 shadow-md shadow-cyan-500/20 text-slate-950 font-black shrink-0`}>
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full text-slate-950" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            {/* Earth globe circumference */}
            <circle cx="16" cy="16" r="13" className="stroke-slate-950" />
            {/* Subsea oceanic wave / bathymetry trench lines */}
            <path d="M4 16c4 3 8-3 12 0s8-3 12 0" />
            <path d="M7 21c3 2 6-2 9 0s6-2 9 0" />
            {/* Shift symbol / Upwelling buoyant vector */}
            <path d="M16 7l-4 5h3v4h2v-4h3l-4-5z" fill="currentColor" />
          </svg>
        </div>
      )}

      {showUploadTrigger && (
        <button
          onClick={triggerUpload}
          title="Click to upload custom logo file"
          className="text-[10px] font-mono text-cyan-400/80 hover:text-cyan-300 underline cursor-pointer"
        >
          {customLogoUrl ? 'Change Logo' : 'Upload Logo'}
        </button>
      )}
    </div>
  );
};
