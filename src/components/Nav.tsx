import { GithubIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/avatar";
import { Button } from "~/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/ui/dropdown-menu";

export const NavBar = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-b-slate-200 bg-white px-4 lg:pl-16 dark:border-b-slate-700 dark:bg-slate-900">
        <div className="container flex h-16 items-center">
          <div className="flex gap-4">
            <Link className="flex items-center gap-4 space-x-2" href="/faq">
              <span className="font-bold sm:inline-block">
                Coding / Programming FAQ
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end">
            <div className="flex flex-row items-center justify-center gap-8 lg:gap-14">
              <div>
                <Link href="https://github.com/gneiru/faq">
                  <GithubIcon />
                </Link>
              </div>
              <div>
                {!sessionData && (
                  <Button variant="outline" onClick={() => void signIn()}>
                    Sign In
                  </Button>
                )}

                {sessionData && (
                  <UserDropdown
                    src={sessionData.user.image ?? ""}
                    alt={sessionData.user.name ?? ""}
                    fallback={sessionData.user.name?.slice(0, 1) ?? "SH"}
                  />

                  //   <Button variant="outline" onClick={() => void signIn()}>
                  //     Sign In
                  //   </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

function UserDropdown(props: { src: string; fallback: string; alt: string }) {
  const { src, fallback, alt } = props;
  const {data} = useSession()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={src} alt={alt} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{alt}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link href={`/user/${data?.user.id ?? ''}`}> Profile</Link></DropdownMenuItem>
        <DropdownMenuItem onClick={() => void signOut()}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
