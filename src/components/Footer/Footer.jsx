import React from "react";

const Footer = () => {
  return (
    <footer className="max-h-[5vh] min-h-[5vh] rounded-none sm:max-h-[4vh] sm:min-h-[4vh] md:max-h-[4vh] lg:max-h-[3vh] lg:min-h-[3vh] text-[0.55rem] sm:text-xs md:text-sm lg:text-sm text-center px-1 flex-1 flex-row gap-2 justify-between h-min overflow-hidden items-center flex">
      <span className="text-white w-full">
        Website made for non profit, proof of concept goal. For any inquiries
        email daniel.meloptica@gmail.com
      </span>
    </footer>
  );
};

export default Footer;
