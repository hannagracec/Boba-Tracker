import Image from "next/image";

interface InfoPanelProps {
  icon: string;
  text: string;
  alt: string;
}

const InfoTile = (props: InfoPanelProps) => {
  const { icon, text, alt } = props;

  return(
    <div className="bg-off-white w-full border-2 border-black-ish shadow-b p-4 rounded-lg mb-4">
      <div className="flex justify-center">
        <div className="bg-pastel-pink size-[80px] rounded-[100%] border-2 border-black-ish flex justify-center items-center mr-4">
          <Image 
            src={icon}
            height={45}
            width={45}
            alt={alt}
          />
        </div>
        <div className="flex items-center w-3/5">
          <p className="text-black-ish">{text}</p>
        </div>
      </div>
    </div>
  )
}

export default InfoTile;
