interface HeaderImageProps {
  src: string;
  alt: string;
}

export const HeaderImage = ({ src, alt }: HeaderImageProps) => {
  return (
    <div className="relative w-full md:w-1/2 h-40 md:h-48 lg:h-80 overflow-hidden rounded-t-lg md:rounded-lg shadow-inner">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent shadow-2xl" />
    </div>
  );
};