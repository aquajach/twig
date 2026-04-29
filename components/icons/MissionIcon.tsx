import { useId } from 'react';

type IconProps = React.ComponentPropsWithoutRef<'svg'>;

export function MissionIcon(props: IconProps) {
  const id = useId();
  const clipPathId = `${id}-clip`;
  const paint0Id = `${id}-paint0`;
  const paint1Id = `${id}-paint1`;
  const paint2Id = `${id}-paint2`;
  const paint3Id = `${id}-paint3`;
  const paint4Id = `${id}-paint4`;

  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <g clipPath={`url(#${clipPathId})`}>
        <path
          d="M15.3968 3.75029C17.8822 1.26486 19.7587 0.504329 23.3386 0.121491C23.6494 0.088256 23.9117 0.350632 23.8785 0.661415C23.4957 4.24135 22.7351 6.11777 20.2497 8.6032L15.8822 12.9707L11.8682 16.9847C11.6729 17.18 11.3564 17.18 11.1611 16.9847L9.08819 14.9118L7.01529 12.8389C6.82003 12.6436 6.82003 12.3271 7.01529 12.1318L11.0293 8.11782L15.3968 3.75029Z"
          fill={`url(#${paint0Id})`}
        />
        <path
          d="M2.70812 9.97029C4.96568 7.74243 7.58486 5.56571 11.706 7.44126L7.66194 11.4853L2.99017 10.818C2.58228 10.7597 2.41485 10.2597 2.70812 9.97029Z"
          fill={`url(#${paint1Id})`}
        />
        <path
          d="M9.29289 17.2929L6.70711 14.7071C6.31658 14.3166 5.68293 14.3164 5.29324 14.7077C2.10566 17.9089 1.33436 18.8881 0.206996 23.1901C0.11131 23.5552 0.444804 23.8887 0.809934 23.793C5.11187 22.6656 6.09108 21.8943 9.29228 18.7068C9.68364 18.3171 9.68342 17.6834 9.29289 17.2929Z"
          fill={`url(#${paint2Id})`}
        />
        <circle cx="17.5" cy="6.5" r="2.5" fill={`url(#${paint3Id})`} />
        <path
          d="M14.0285 21.2909C16.2493 19.0263 18.3911 16.3721 16.5587 12.2942L12.5146 16.3383L13.182 21.01C13.2403 21.4179 13.74 21.5851 14.0285 21.2909Z"
          fill={`url(#${paint4Id})`}
        />
      </g>
      <defs>
        <linearGradient
          id={paint0Id}
          x1="21.5114"
          y1="-2.36426"
          x2="27.4148"
          y2="9.27082"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EDEFF2" />
          <stop offset="1" stopColor="#ACB1BA" />
        </linearGradient>
        <linearGradient id={paint1Id} x1="8.1088" y1="4.56759" x2="5.59727" y2="13.55" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F26D38" />
          <stop offset="1" stopColor="#CF1010" />
        </linearGradient>
        <linearGradient id={paint2Id} x1="8.88889" y1="15.1111" x2="1.05964e-06" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8AA0F" />
          <stop offset="1" stopColor="#DC6F10" />
        </linearGradient>
        <linearGradient id={paint3Id} x1="17.5" y1="4" x2="17.5" y2="9" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3080CC" />
          <stop offset="1" stopColor="#1A3F73" />
        </linearGradient>
        <linearGradient id={paint4Id} x1="16.1969" y1="12.656" x2="13.6856" y2="21.6383" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F26D38" />
          <stop offset="1" stopColor="#CF1010" />
        </linearGradient>
        <clipPath id={clipPathId}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
