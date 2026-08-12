import websiteLogo from "../assets/website-logo.png";
import { Link, NavLink } from "react-router-dom";
import { cn } from "../lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center h-14 px-3 no-underline font-semibold text-sm border-b-2 border-transparent",
    isActive ? "text-primary border-primary" : "text-neutral-600 hover:text-primary",
  );

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <header className="h-14 px-8 border-b border-solid border-neutral-200 bg-white">
        <div className="flex justify-between">
          <div>
            <Link to="/">
              <img src={websiteLogo} alt="Logo" className="h-14 w-auto" />
            </Link>
          </div>

          <nav className="flex h-14 gap-1">
            <NavLink to="/" end className={navLinkClass}>
              หน้าหลัก
            </NavLink>
            <NavLink to="/books" className={navLinkClass}>
              หนังสือ
            </NavLink>
            <NavLink to="/authors" className={navLinkClass}>
              ผู้แต่ง
            </NavLink>
          </nav>

          <div></div>
        </div>
      </header>

      <main>{children}</main>
    </>
  );
}
