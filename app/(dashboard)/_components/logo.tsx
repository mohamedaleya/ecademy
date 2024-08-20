import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/">
      <Image height={150} width={150} alt="logo" src="/logo.svg" />
    </Link>
  );
};
