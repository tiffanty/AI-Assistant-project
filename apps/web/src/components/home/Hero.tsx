import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section
      className="bg_image"
      style={{
        backgroundImage: 'url("/images/robot-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="container py-16 sm:py-36 px-6 sm:px-0">
        <div className="flex sm:flex-wrap flex-nowrap items-center max-h-[690px] h-full">
          <div className="w-full max-w-3xl">
            <div className="">
              <h2 className="font-montserrat pb-7 sm:pb-[26px] text-black text-[44px] sm:text-[75px] not-italic font-medium leading-[111.3%] tracking-[-1.1px] sm:tracking-[-1.875px]">
                Your AI Voice<br />
                <span className="block">Calling Assistant</span>
              </h2>
              <p className="font-montserrat sm:pb-16 max-w-[680px] text-black text-xl sm:text-3xl not-italic font-normal leading-[103.3%] tracking-[-0.5px] sm:tracking-[-0.75px] pb-11">
                
                nAgents transforms everyday communication with intelligent voice AI that makes calls, gathers information, and delivers smart summaries — so you can focus on what matters most.
              </p>
              <Link href={"/notes"}>
                <button className="bg-[#1e3a8a] rounded-lg gap-2.5 px-8 py-4 font-montserrat text-white text-xl sm:text-3xl not-italic font-semibold leading-[90.3%] tracking-[-0.5px] sm:tracking-[-0.75px]">
                  Try nAgents Free
                </button>
              </Link>
            </div>
            {/* Removed right-side images */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
