import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useUser();

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
      {/* Logo */}
      <Link href="/" legacyBehavior>
        <a className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={80} height={40} />
        </a>
      </Link>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Profile avatar */}
        {user && (
          <Link href="/profile" legacyBehavior>
            <a>
              <Avatar className="h-10 w-10 ring-2 ring-[#7097A8]">
                <AvatarImage src={user.avatarUrl || "/OIP.jpg"} alt="Profile" />
                <AvatarFallback className="text-[#234851]">
                  {user.name?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>
            </a>
          </Link>
        )}

        {/* Hamburger menu */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="p-2">
              <Menu className="h-6 w-6 text-gray-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="end"
            className="w-48 p-2 bg-white rounded-lg shadow-lg"
          >
            {user ? (
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:bg-red-50"
                onClick={() => logout()}
              >
                Logout
              </Button>
            ) : (
              <>
                <Link href="/login" legacyBehavior>
                  <a>
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-gray-100"
                    >
                      Login
                    </Button>
                  </a>
                </Link>
                <Link href="/signup" legacyBehavior>
                  <a>
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-gray-100"
                    >
                      Register
                    </Button>
                  </a>
                </Link>
                <Link href="/reset-password" legacyBehavior>
                  <a>
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-gray-100"
                    >
                      Reset Password
                    </Button>
                  </a>
                </Link>
              </>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
