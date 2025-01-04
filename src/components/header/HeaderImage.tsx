interface HeaderImageProps {
  src: string;
  alt: string;
}

export const HeaderImage = ({ src, alt }: HeaderImageProps) => {
  return (
    <div className="relative w-full md:w-[400px] h-40 md:h-[300px] overflow-hidden rounded-lg shadow-inner flex-shrink-0">
      <img
        src="https://images.unsplash.com/photo-1606327054629-64c8b0fd6e4f"
        alt="Agenda numérique en couleur"
        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent shadow-2xl" />
    </div>
  );
};