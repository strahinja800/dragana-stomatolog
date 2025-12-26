import Image, { type StaticImageData } from 'next/image';

interface Service {
  title: string;
  description: string;
  number: string;
  image: StaticImageData;
}

interface Props {
  props: Service[];
}

export default function Services({ props }: Props) {
  return (
    <>
      {props.map((item, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-2xl bg-[rgba(2, 255, 255, 0.5)] border border-border p-7 hover:shadow-hover transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-8">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-card text-foreground font-heading font-bold text-xl shadow-card">
              {item.number}
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-heading font-semibold text-foreground mb-2">
              {item.title}
            </h3>
            <p className="text-muted-foreground text-sm">{item.description}</p>
          </div>
          {/* 3D Image */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
            <Image
              src={item.image}
              alt={item.title}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        </div>
      ))}
    </>
  );
}
