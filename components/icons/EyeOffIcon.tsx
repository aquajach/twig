type IconProps = React.ComponentPropsWithoutRef<'svg'>;

export function EyeOffIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-7.5a11.82 11.82 0 0 1 5.06-5.94" />
      <path d="M10.58 10.58A2 2 0 0 0 13.42 13.42" />
      <path d="M9.88 4.24A10.69 10.69 0 0 1 12 4c5 0 9.27 3.11 11 7.5a11.79 11.79 0 0 1-2.62 3.86" />
      <path d="M2 2l20 20" />
    </svg>
  );
}
