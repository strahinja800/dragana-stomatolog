import Image, { type StaticImageData } from 'next/image';

interface Service {
  title: string;
  description: string;
  number: string;
  image: string | StaticImageData;
}

interface Props {
  props: Service[];
}

export default function Services({ props }: Props) {
  return (
    <>
      {props.map((item, index) => (
        <article
          key={index}
          className="section-shell group relative overflow-hidden p-6 transition-smooth hover:-translate-y-1 hover:shadow-hover"
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 font-heading text-lg font-bold text-primary">
              {item.number}
            </span>
            <span className="rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-accent-strong uppercase">
              Premium
            </span>
          </div>

          <h3 className="text-2xl font-semibold text-foreground">
            {item.title}
          </h3>
          <p className="mt-2 max-w-[80%] text-sm text-muted-foreground md:text-base">
            {item.description}
          </p>

          <div className="pointer-events-none absolute -bottom-10 -right-8 h-34 w-34 opacity-85 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100 md:h-40 md:w-40">
            <Image
              src={item.image}
              alt={item.title}
              className="h-full w-full object-contain drop-shadow-xl"
            />
          </div>
        </article>
      ))}
    </>
  );
}
