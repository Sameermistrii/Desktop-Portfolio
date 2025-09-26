import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ResumeLink } from '@/components/section-header/resume-link';
// Add server-side file read for configurable contact email
import fs from 'fs';
import path from 'path';

// Icon components based on SVG paths from HTML_STRUCTURE
const AppleIcon = (props: React.SVGProps<SVGSVGElement>) =>
<svg viewBox="0 0 18 18" fill="currentColor" {...props}>
    <path d="M9.13,3.37C8.42,3.37,7.1,3.87,6.17,4.82C5.16,5.84,4.52,7.21,4.52,8.68C4.52,11.3,6.13,13.25,7.9,13.25C8.54,13.25,9.6,12.86,10.61,12.01C10.65,12.04,11.58,10.96,11.58,10.96C10.74,10.28,10.37,9.37,10.37,8.42C10.37,6.96,11.16,6.01,12.35,6.01C12.98,6.01,13.52,6.3,13.91,6.72C13.91,6.72,13.06,4.02,11.66,3.41C10.84,3.12,9.88,3.22,9.13,3.37Z M8.3,0C10.38,0.04,11.96,1.25,12.75,1.36C12.74,1.38,11.55,2.16,11.53,2.17C10.33,1.44,9,1.3,7.99,1.7C6.01,2.44,4.64,4.24,4.64,6.48C4.64,8,5.2,9.25,6.23,10.19C6.91,10.81,7.6,11.23,8.5,11.23C8.75,11.23,8.96,11.19,9.17,11.14C9.17,11.14,10.86,14.07,13.29,14.07C14.07,14.07,15.54,14.07,16.89,12.74C17.65,11.97,18,10.92,18,9.88C18,7.18,16.51,5.85,14.65,5.65C12.94,5.48,11.59,6.59,11.56,6.61C11.56,6.6,12.98,4.1,12.94,2.83C12.09,0.35,9.97,0.03,8.3,0Z" />
  </svg>;


const ShortcutsIcon = (props: React.SVGProps<SVGSVGElement>) =>
<svg viewBox="0 0 16 16" fill="currentColor" {...props}>
    <path d="M 5, 2.76C 5, 1.79 5.86, 1 6.94, 1L 9.06, 1C 10.14, 1 11, 1.79 11, 2.76L 11, 5L 9.75, 5L 9.75, 2.88C 9.75, 2.45 9.43, 2.12 9.04, 2.12L 6.96, 2.12C 6.57, 2.12 6.25, 2.45 6.25, 2.88L 6.25, 5L 5, 5L 5, 2.76 Z M 9, 2L 7, 2L 7, 1L 9, 1L 9, 2 Z M 6, 14L 10, 14L 10, 15L 6, 15L 6, 14 Z M 5, 8L 11, 8L 11, 13.24C 11, 14.21 10.14, 15 9.06, 15L 6.94, 15C 5.86, 15 5, 14.21 5, 13.24L 5, 8 Z M 6.25, 13.12C 6.25, 13.55 6.57, 13.88 6.96, 13.88L 9.04, 13.88C 9.43, 13.88 9.75, 13.55 9.75, 13.12L 9.75, 8.88C 9.75, 8.45 9.43, 8.12 9.04, 8.12L 6.96, 8.12C 6.57, 8.12 6.25, 8.45 6.25, 8.88L 6.25, 13.12 Z M 5, 7L 11, 7L 11, 6L 5, 6L 5, 7 Z M 2, 5L 3, 5L 3, 2L 0, 2L 0, 3L 2, 3L 2, 5 Z M 2, 0L 3, 0L 3, 1L 2, 1L 2, 0 Z M 1, 3L 0, 3L 0, 4L 1, 4L 1, 3 Z M 13, 13L 12, 13L 12, 14L 13, 14L 13, 13 Z M 15, 12L 14, 12L 14, 13L 15, 13L 15, 12 Z M 1, 13L 0, 13L 0, 14L 1, 14L 1, 13 Z M 15, 3L 14, 3L 14, 4L 15, 4L 15, 3 Z M 13, 2L 12, 2L 12, 3L 13, 3L 13, 2 Z M 13, 0L 12, 0L 12, 1L 13, 1L 13, 0 Z M 13, 5L 14, 5L 14, 2L 15, 2L 15, 3L 16, 3L 16, 5L 13, 5 Z M 4, 1L 3, 1L 3, 2L 2, 2L 2, 0L 4, 0L 4, 1 Z M 12, 0L 14, 0L 14, 1L 15, 1L 15, 2L 13, 2L 13, 0 Z M 1, 2L 2, 2L 2, 3L 3, 3L 3, 5L 0, 5L 0, 2L 1, 2 Z M 16, 10L 15, 10L 15, 9L 16, 9L 16, 10 Z M 14, 10L 13, 10L 13, 9L 14, 9L 14, 10 Z M 14, 12L 13, 12L 13, 11L 14, 11L 14, 12 Z M 16, 12L 15, 12L 15, 11L 16, 11L 16, 12 Z M 14, 8L 13, 8L 13, 7L 14, 7L 14, 8 Z M 16, 8L 15, 8L 15, 7L 16, 7L 16, 8 Z M 14, 6L 13, 6L 13, 5L 14, 5L 14, 6 Z M 16, 6L 15, 6L 15, 5L 16, 5L 16, 6 Z M 2, 10L 1, 10L 1, 11L 2, 11L 2, 10 Z M 3, 10L 2, 10L 2, 9L 3, 9L 3, 10 Z M 3, 12L 2, 12L 2, 11L 3, 11L 3, 12 Z M 0, 12L 1, 12L 1, 13L 0, 13L 0, 12 Z M 3, 8L 2, 8L 2, 9L 3, 9L 3, 8 Z M 0, 8L 1, 8L 1, 7L 0, 7L 0, 8 Z M 3, 6L 2, 6L 2, 7L 3, 7L 3, 6 Z M 0, 6L 1, 6L 1, 5L 0, 5L 0, 6Z" />
  </svg>;


const BatteryIcon = (props: React.SVGProps<SVGSVGElement>) =>
<svg viewBox="0 0 22 14" fill="currentColor" {...props}>
    <path d="M2.5,.5C2.5,0.22,2.72,0,3,0H20C20.28,0,20.5,0.22,20.5,0.5V2H22V12H20.5V13.5C20.5,13.78,20.28,14,20,14H3C2.72,14,2.5,13.78,2.5,13.5V0.5Z" />
    <path d="M 0 3 C 0 2.45 0.45 2 1 2 L 19 2 C 19.55 2 20 2.45 20 3 L 20 11 C 20 11.55 19.55 12 19 12 L 1 12 C 0.45 12 0 11.55 0 11 L 0 3 Z" fillRule="evenodd" clipRule="evenodd" />
  </svg>;


const WifiIcon = (props: React.SVGProps<SVGSVGElement>) =>
<svg viewBox="0 0 15 14" fill="currentColor" {...props}>
    <path d="M7.5,10C8.05,10,8.5,9.55,8.5,9C8.5,8.45,8.05,8,7.5,8C6.95,8,6.5,8.45,6.5,9C6.5,9.55,6.95,10,7.5,10Z" />
    <path d="M4.2,7.7C4.42,7.48,4.77,7.48,4.99,7.7C6.01,8.71,6.5,9.15,7.5,9.15C8.42,9.15,8.99,8.71,9.99,7.7C10.21,7.48,10.56,7.48,10.78,7.7C11,7.92,11,8.27,10.78,8.49C9.25,10.03,8.49,10.65,7.5,10.65C6.51,10.65,5.7,10.03,4.2,8.49C3.98,8.27,3.98,7.92,4.2,7.7Z" />
    <path d="M1.32,4.82C1.54,4.6,1.89,4.6,2.11,4.82C4.55,7.27,5.92,8.49,7.5,8.49C9.09,8.49,10.46,7.26,12.87,4.83C13.09,4.61,13.44,4.61,13.66,4.83C13.88,5.05,13.88,5.4,13.66,5.62C10.69,8.59,9.08,10,7.5,10C5.9,10,4.27,8.57,1.32,5.62C1.1,5.4,1.1,5.05,1.32,4.82Z" />
    <path d="M7.5,12C9.91,12,12.1,10.87,13.9,9.1C14.12,8.88,14.47,8.88,14.69,9.1C14.91,9.32,14.91,9.67,14.69,9.89C12.7,11.88,10.15,13.25,7.5,13.25C4.85,13.25,2.3,11.88,0.31,9.89C0.09,9.67,0.09,9.32,0.31,9.1C0.53,8.88,0.88,8.88,1.1,9.1C2.9,10.87,5.09,12,7.5,12Z" />
  </svg>;


const SpotlightIcon = (props: React.SVGProps<SVGSVGElement>) =>
<svg viewBox="0 0 13 13" fill="currentColor" {...props}>
    <path d="M9.19,8.08L12.77,11.66C13.04,11.93,13.04,12.38,12.77,12.65C12.5,12.92,12.05,12.92,11.78,12.65L8.2,9.07C7.38,9.73,6.33,10.14,5.18,10.14C2.39,10.14,0.14,7.88,0.14,5.07C0.14,2.26,2.39,0,5.18,0C7.96,0,10.22,2.26,10.22,5.07C10.22,6.23,9.82,7.29,9.19,8.08ZM8.11,5.07C8.11,3.42,6.8,2.11,5.18,2.11C3.55,2.11,2.24,3.42,2.24,5.07C2.24,6.72,3.55,8.03,5.18,8.03C6.8,8.03,8.11,6.72,8.11,5.07Z" />
  </svg>;


const ControlCenterIcon = (props: React.SVGProps<SVGSVGElement>) =>
<svg viewBox="0 0 22 10" fill="currentColor" {...props}>
    <path d="M3.7,0C3.37,0,3.09,0.28,3.09,0.61V2.88H0.6C0.27,2.88,0,3.15,0,3.48V5.76C0,6.09,0.27,6.36,0.6,6.36H3.09V8.64C3.09,8.97,3.37,9.24,3.7,9.24H5.98C6.3,9.24,6.58,8.97,6.58,8.64V6.36H9.06C9.39,6.36,9.66,6.09,9.66,5.76V3.48C9.66,3.15,9.39,2.88,9.06,2.88H6.58V0.61C6.58,0.28,6.3,0,5.98,0H3.7Z" />
    <path d="M12.38,3.48V5.76C12.38,6.09,12.65,6.36,12.98,6.36H15.46V8.64C15.46,8.97,15.74,9.24,16.06,9.24H18.35C18.67,9.24,18.95,8.97,18.95,8.64V6.36H21.43C21.75,6.36,22.03,6.09,22.03,5.76V3.48C22.03,3.15,21.75,2.88,21.43,2.88H18.95V0.61C18.95,0.28,18.67,0,18.35,0H16.06C15.74,0,15.46,0.28,15.46,0.61V2.88H12.98C12.65,2.88,12.38,3.15,12.38,3.48Z" />
  </svg>;


export default function DesktopOSHeader() {
  // Read contact email from public/Section Header/contact.json with fallback
  const contactEmail = (() => {
    try {
      const filePath = path.join(process.cwd(), 'public', 'Section Header', 'contact.json');
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      if (typeof data?.email === 'string' && data.email.length > 0) return data.email;
    } catch (_) {}
    return 'inikajhamvar@gmail.com';
  })();

  const dateString = "Tuesday, Sep 23";
  const timeString = "7:19 AM";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[22px] bg-menu-bar-background backdrop-blur-[20px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.035),0px_1px_1px_0px_rgba(0,0,0,0.02)]">
      <nav className="flex items-center justify-between w-full h-full px-4 menu-bar-text">
        <div className="flex items-center gap-5">
          <Link href="/">
            <AppleIcon className="w-[14px] h-[14px] text-black" />
          </Link>
          <Link href="/">
            <span className="font-semibold">Portfolio</span>
          </Link>
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact
          </a>
          <ResumeLink />
        </div>
        <div className="flex items-center gap-3">
          <ShortcutsIcon className="w-[16px] h-[16px] opacity-70" />
          <BatteryIcon className="w-[22px] h-[11px]" />
          <WifiIcon className="w-[15px] h-[11px]" />
          <SpotlightIcon className="w-[14px] h-[14px]" />
          <ControlCenterIcon className="w-[15px] h-[10px] opacity-70" />
          <Image src="https://framerusercontent.com/images/dPmBV7RVqajiEK5Z6fWoKM30s5c.png" alt="Siri icon" width={15} height={15} />
          <div className="flex items-center gap-1.5 time-display">
            <span>{dateString}</span>
            <span>{timeString}</span>
          </div>
        </div>
      </nav>
    </header>);

}