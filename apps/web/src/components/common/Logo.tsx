import Link from "next/link";
import React from "react";

interface Props {
  isMobile?: boolean;
}

const Logo = ({ isMobile }: Props) => {
  return (
    <Link href={"/"}>
      <div className="flex gap-2 items-center">
        <div className="w-[26px] h-[26px] bg-[#1e3a8a] rounded-lg flex items-center justify-center text-white font-bold text-lg">
          n
        </div>
        {!isMobile ? (
          <h1 className="font-montserrat text-black text-3xl sm:text-[35px] not-italic font-normal leading-[90.3%] tracking-[-0.875px]">
            nAgent
          </h1>
        ) : null}
      </div>
    </Link>
  );
};

export default Logo;
