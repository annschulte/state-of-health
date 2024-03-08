export default function UpVote({ fill = "#00FF75" }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="9"
        y="9"
        width="34"
        height="34"
        fill="black"
        stroke="black"
        stroke-width="4"
        stroke-linejoin="round"
      />
      <rect
        x="5"
        y="5"
        width="34"
        height="34"
        fill={fill}
        stroke="black"
        stroke-width="4"
        stroke-linejoin="round"
      />
      <path d="M14 21L22 13L30 21" stroke="black" stroke-width="4" />
      <path d="M22 13L22 34" stroke="black" stroke-width="4" />
    </svg>
  );
}
