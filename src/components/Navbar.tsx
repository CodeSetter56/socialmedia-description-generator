import Link from "next/link";

function Navbar() {
  return (
    <nav className="flex bg-amber-900 justify-between items-center px-6 md:px-12 py-4">
      <Link
        className="text-lg font-medium cursor-pointer text-white"
        href={"/"}
      >
        PostGen
      </Link>
      <div className="flex gap-6 text-sm font-medium cursor-pointer text-white">
        <div className="hover:underline ">
          future scope: 
        </div>
        <div className="hover:underline">credits</div>
        <div className="hover:underline">pricing</div>
        <div className="hover:underline">login</div>
      </div>
    </nav>
  );
}

export default Navbar;
