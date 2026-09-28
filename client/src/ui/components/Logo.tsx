interface LogoProps {
  stroke?: string;
}

export const CartMark = ({ stroke = "#1f3a2e" }: LogoProps) => (
  <svg viewBox="0 0 24 24" width="62%" height="62%" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 3.5h2.2l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.2l1.6-6.8H6.2" />
    <circle cx="9.5" cy="20" r="1.3" />
    <circle cx="17" cy="20" r="1.3" />
    <path d="M13.2 8.6l-1.7 2.6h2.4l-1.7 2.6" />
  </svg>
);
