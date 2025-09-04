
import React from 'react';

export const RobotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M8 4h8" />
        <path d="M12 4v4" />
        <path d="M5 14h.01" />
        <path d="M19 14h.01" />
        <path d="M10 20v-4" />
        <path d="M14 20v-4" />
    </svg>
);
