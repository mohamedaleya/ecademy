import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.svg";

export const Logo = () => {
  return (
    <Link href="/">
      <Image height={150} width={150} alt="logo" src={logo} />
    </Link>
  );
};
