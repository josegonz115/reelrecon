// By: mdi

export const FishIcon = ({
  height = "1em",
  fill = "currentColor",
  focusable = "false",
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, "children">) => (
  <svg
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={height}
    focusable={focusable}
    {...props}
  >
    <path
      fill={fill}
      d="m12 20l.76-3c-3.26-.21-6.17-1.6-7.01-3.42c-.09.48-.22.92-.42 1.25C4.67 16 3.33 16 2 16c1.1 0 1.5-1.57 1.5-3.5S3.1 9 2 9c1.33 0 2.67 0 3.33 1.17c.2.33.33.77.42 1.25c.65-1.42 2.57-2.57 4.91-3.1L9 5c2 0 4 0 5.33.67c1.13.56 1.78 1.6 2.36 2.71c2.92.7 5.31 2.28 5.31 4.12c0 1.88-2.5 3.5-5.5 4.16c-.83 1.1-1.64 2.12-2.33 2.67c-.84.67-1.5.67-2.17.67m5-9a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1"
    />
  </svg>
);