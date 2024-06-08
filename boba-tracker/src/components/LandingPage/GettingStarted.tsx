import Image from "next/image";

const LOGO_CONTAINER_STYLES =
  "bg-off-white size-[150px] border-2  border-black-ish rounded-[100%] flex shadow-[0px_8px_0px_0px_#222222] justify-center";

const GettingStarted = () => {
  return (
    <div className="bg-coral-pink">
      <div className="flex flex-col items-center">
        <div className={LOGO_CONTAINER_STYLES}>
          <Image
            src="/logo.svg"
            height={120}
            width={120}
            alt="Boba Tracker Logo"
          />
        </div>
        <h1 className="font-rubikMonoOne text-5xl">Boba</h1>
      </div>
    </div>
  );
};

export default GettingStarted;
