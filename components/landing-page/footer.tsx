"use client";
import footerImage from "@/public/images/landing-page/footer.png";

const Footer = () => {
  return (
    <footer
      className=" bg-cover bg-center bg-no-repeat relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-default-900/90 dark:before:bg-default-100"
      style={{
        background: `url(${footerImage.src})`,
      }}
    ></footer>
  );
};

export default Footer;
