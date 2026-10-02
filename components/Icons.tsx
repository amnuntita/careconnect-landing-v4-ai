import Image from "next/image";
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export const CheckIcon = (p: IconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const PhoneIcon = (p: IconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const LineIcon = ({
  width = 20,
  height = 20,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) => (
  <Image
    src="/images/LINE_logo.png"
    alt="LINE"
    width={width}
    height={height}
    className={className}
  />
);

export const StethoscopeIcon = (p: IconProps) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <path d="M6 2v6a4 4 0 0 0 8 0V2" />
    <path d="M4 2h2" />
    <path d="M14 2h2" />
    <path d="M10 12v3a5 5 0 0 0 10 0v-1" />
    <circle cx="20" cy="11" r="2" />
  </svg>
);

export const HomeIcon = (p: IconProps) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const HeartIcon = (p: IconProps) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const PillIcon = (p: IconProps) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <rect x="2" y="9" width="20" height="6" rx="3" />
    <path d="M12 9v6" />
  </svg>
);

export const WalkerIcon = (p: IconProps) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <circle cx="12" cy="4" r="2" />
    <path d="M12 6v6" />
    <path d="M9 12l-2 9" />
    <path d="M15 12l2 9" />
    <path d="M9 14h6" />
  </svg>
);

export const BoneIcon = (p: IconProps) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <path d="M17 10c.7-.7 2-1 2-3a3 3 0 0 0-6 0c0 .7-.3 1.3-.8 1.7L8.7 12.2c-.5.5-1 .8-1.7.8a3 3 0 0 0 0 6c2 0 2.3-1.3 3-2l4-4c.5-.5.8-1 .8-1.7" />
  </svg>
);

export const BrainIcon = (p: IconProps) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <path d="M12 5a3 3 0 0 0-3 3c-1.7 0-3 1.3-3 3s1.3 3 3 3v3a3 3 0 0 0 3 3" />
    <path d="M12 5a3 3 0 0 1 3 3c1.7 0 3 1.3 3 3s-1.3 3-3 3v3a3 3 0 0 1-3 3" />
    <path d="M12 5v15" />
  </svg>
);

export const ActivityIcon = (p: IconProps) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export const ArrowIcon = (p: IconProps) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const SparkleIcon = (p: IconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
  </svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const PinIcon = (p: IconProps) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const AwardIcon = (p: IconProps) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

export const AlertIcon = (p: IconProps) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// Shared stroke-icon frame for the icons below (same style as the set above).
const StrokeIcon = ({ children, ...p }: IconProps) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...p}
  >
    {children}
  </svg>
);

// Telemedicine (video call).
export const VideoIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <path d="M16 10l6-3v10l-6-3" />
  </StrokeIcon>
);

// Loop / plan can be adjusted.
export const RefreshIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" />
    <path d="M4 3v5h5" />
    <path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" />
    <path d="M20 21v-5h-5" />
  </StrokeIcon>
);

// Hand / fine motor (occupational therapy).
export const HandIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M18 11V6a2 2 0 0 0-4 0v5" />
    <path d="M14 10V4a2 2 0 0 0-4 0v6" />
    <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
    <path d="M18 8a2 2 0 0 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-5.9-2.3L3.4 17a2 2 0 0 1 2.8-2.8L8 16" />
  </StrokeIcon>
);

// Bed (bed-bound / early mobility).
export const BedIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M2 18V6" />
    <path d="M2 14h20v4" />
    <path d="M22 14v-2a3 3 0 0 0-3-3h-8v5" />
    <circle cx="6.5" cy="10.5" r="2" />
  </StrokeIcon>
);

// Sit-to-stand (transfers, getting up).
export const SitStandIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <circle cx="13" cy="4" r="2" />
    <path d="M13 6v6h-4l-1 8" />
    <path d="M13 12l3 3v5" />
    <path d="M4 12h5" />
    <path d="M4 12v8" />
  </StrokeIcon>
);

// Family / caregivers.
export const UsersIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
    <path d="M16 5.5a3 3 0 0 1 0 5" />
    <path d="M18 14a5 5 0 0 1 3 4.6V20" />
  </StrokeIcon>
);

// Payment flexibility.
export const WalletIcon = (p: IconProps) => (
  <StrokeIcon {...p}>
    <path d="M3 7a2 2 0 0 1 2-2h12v4" />
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M16 13.5h2" />
  </StrokeIcon>
);
