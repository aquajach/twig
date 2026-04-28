import { useId } from 'react';

type IconProps = React.ComponentPropsWithoutRef<'svg'>;

export function BrowserIcon(props: IconProps) {
  const id = useId();
  const clipPathId = `${id}-clip`;
  const paint0Id = `${id}-paint0`;
  const paint1Id = `${id}-paint1`;

  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <g clipPath={`url(#${clipPathId})`}>
        <circle cx="12" cy="12" r="12" fill={`url(#${paint0Id})`} />
        <path
          d="M16.5833 12C16.5833 18.0751 14.5313 23 12 23M16.5833 12C16.5833 5.92487 14.5313 1 12 1M16.5833 12H23M16.5833 12H7.41667M12 23C9.4687 23 7.41667 18.0751 7.41667 12M12 23C18.0751 23 23 18.0751 23 12M12 23C5.92487 23 1 18.0751 1 12M7.41667 12C7.41667 5.92487 9.4687 1 12 1M7.41667 12H1M12 1C5.92487 1 1 5.92487 1 12M12 1C18.0751 1 23 5.92487 23 12"
          stroke={`url(#${paint1Id})`}
          strokeOpacity="0.5"
          strokeWidth="2"
        />
      </g>
      <defs>
        <linearGradient id={paint0Id} x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#04C6CC" />
          <stop offset="1" stopColor="#066B85" />
        </linearGradient>
        <linearGradient id={paint1Id} x1="12" y1="1" x2="12" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="#CACCD3" />
        </linearGradient>
        <clipPath id={clipPathId}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
