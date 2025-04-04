import images from "../assets/image";

const brands = [
  { name: "BURBERRY", logo: images.logo1 },
  { name: "NIKE", logo: images.logo2 },
  { name: "PRADA", logo: images.logo3 },
  { name: "LACOSTE", logo: images.logo4 },
  { name: "ZARA", logo: images.logo5 },
  { name: "CHANEL", logo: images.logo6 },
];

const BrandLogos = () => {
  return (
    <div className="bg-[#c8ff00] py-4 mb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center flex-wrap">
          {brands.map((brand) => (
            <div key={brand.name} className="px-4 py-2">
              <img 
                src={brand.logo || "/placeholder.svg"} 
                alt={brand.name} 
                className="h-16 w-auto object-contain" // Increased height
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrandLogos;
