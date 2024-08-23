"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft, BookMarked, HomeIcon, UserCog } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { isTeacher } from "@/lib/teacher";

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/browse";

  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: "w-9 h-9",
    },
  };

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="gap-x-4 ml-auto flex items-center">
        {isTeacherPage ? (
          <Link href="/">
            <Button size="sm" variant="secondary">
              <BookMarked className="h-4 w-4 mr-2" /> Student Mode
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="secondary">
              <UserCog className="h-4 w-4 mr-2" />
              Teacher Mode
            </Button>
          </Link>
        ) : isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="secondary">
              <HomeIcon className="h-4 w-4 mr-2" /> Dashboard
            </Button>
          </Link>
        ) : null}
        <UserButton appearance={userButtonAppearance} />
      </div>
    </>
  );
};
