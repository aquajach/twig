import { useId } from 'react';

type IconProps = React.ComponentPropsWithoutRef<'svg'>;

export function WeTalkIcon(props: IconProps) {
  const id = useId();
  const clipPathId = `${id}-clip`;
  const paint0Id = `${id}-paint0`;
  const paint1Id = `${id}-paint1`;

  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <g clipPath={`url(#${clipPathId})`}>
        <path
          d="M2 0H16C17.1046 0 18 0.89543 18 2V12C18 13.1046 17.1046 14 16 14H5.70156C5.24742 14 4.8068 14.1546 4.45217 14.4383L1.62469 16.7002C0.969931 17.2241 0 16.7579 0 15.9194V8.2963V2C0 0.895431 0.89543 0 2 0Z"
          fill={`url(#${paint0Id})`}
        />
        <path
          d="M22 7H8C6.89543 7 6 7.89543 6 9V19C6 20.1046 6.89543 21 8 21H18.2984C18.7526 21 19.1932 21.1546 19.5478 21.4383L22.3753 23.7002C23.0301 24.2241 24 23.7579 24 22.9194V17.2963V9C24 7.89543 23.1046 7 22 7Z"
          fill={`url(#${paint1Id})`}
        />
      </g>
      <defs>
        <linearGradient id={paint0Id} x1="8.5" y1="0" x2="8.5" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#43CCFE" />
          <stop offset="1" stopColor="#0E5BDF" />
        </linearGradient>
        <linearGradient id={paint1Id} x1="15.5" y1="9" x2="15.5" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CDD6F1" />
          <stop offset="1" stopColor="#747FA0" />
        </linearGradient>
        <clipPath id={clipPathId}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
