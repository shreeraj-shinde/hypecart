interface IconProps {
  stroke?: string;
}

export const Spinner = ({ stroke = "currentColor" }: IconProps) => (
  <svg viewBox="0 0 24 24" width="16" height="16" className="spinner" fill="none">
    <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="2.5" opacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const SearchIcon = ({ stroke = "#8a8379" }: IconProps) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M20 20l-4.35-4.35" />
  </svg>
);

export const UploadIcon = ({ stroke = "#a8a096" }: IconProps) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 15V4" />
    <path d="M7.5 8.5L12 4l4.5 4.5" />
    <path d="M4 16.5v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
);

export const CrateIcon = ({ stroke = "#a8a096" }: IconProps) => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 8.5l8.5-4 8.5 4-8.5 4-8.5-4z" />
    <path d="M3.5 8.5v7l8.5 4 8.5-4v-7" />
    <path d="M12 12.5v7" />
  </svg>
);
