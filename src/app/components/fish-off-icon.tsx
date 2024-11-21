// By: mdi

export const FishOffIcon = ({
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
      d="m20.8 22.7l-5.1-5.1c-.6.7-1.1 1.3-1.6 1.7c-.8.7-1.4.7-2.1.7l.8-3c-3.3-.2-6.2-1.6-7-3.4c-.1.5-.2.9-.4 1.2C4.7 16 3.3 16 2 16c1.1 0 1.5-1.6 1.5-3.5S3.1 9 2 9c1.3 0 2.7 0 3.3 1.2c.2.3.3.8.4 1.2c.3-.7 1-1.4 1.9-1.9L1.1 3l1.3-1.3l19.7 19.7zM9.8 6.6L9 5c2 0 4 0 5.3.7c1.1.6 1.8 1.6 2.4 2.7c2.9.7 5.3 2.3 5.3 4.1c0 1.3-1.2 2.5-3 3.3zM16 12c0 .6.4 1 1 1s1-.4 1-1s-.4-1-1-1s-1 .4-1 1"
    />
  </svg>
);
