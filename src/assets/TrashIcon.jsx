const TrashIcon = ({ width = 30, height = 30, color = "var(--main-color)" }) => (
  <svg
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 24 24"
    stroke={color}
    strokeWidth={1.5}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4v5h.582M20 20v-5h-.582M4.582 9A8.003 8.003 0 0112 4c2.21 0 4.21.896 5.656 2.344M19.418 15A8.003 8.003 0 0112 20a7.962 7.962 0 01-5.656-2.344M9 13h6m-6 4h6"
    />
  </svg>
);
export default TrashIcon;
