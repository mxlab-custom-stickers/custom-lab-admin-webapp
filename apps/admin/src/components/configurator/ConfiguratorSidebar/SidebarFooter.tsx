export default function SidebarFooter() {
  return (
    <div className="group grid h-16 place-items-center border-t bg-gray-100 py-1">
      <span className="text-xl font-semibold italic">CUSTOM LAB 2</span>
      <span className="-mt-4 text-xs text-gray-500">
        Powered by{' '}
        <a
          href="https://mxlab.fr"
          target="_blank"
          className="group-hover:underline"
        >
          MXlab
        </a>
      </span>
    </div>
  );
}
