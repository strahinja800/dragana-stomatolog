import Image, { type StaticImageData } from 'next/image';

interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  image: string | StaticImageData;
}

interface Props {
  team: TeamMember[];
}

export default function TeamMembers({ team }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {team.map((member, index) => (
        <article
          key={index}
          className="group section-shell relative overflow-hidden border-border/60"
        >
          <div className="aspect-3/4 overflow-hidden">
            <Image
              src={member.image}
              alt={`${member.name}, ${member.role}`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-foreground/90 via-foreground/65 to-transparent p-5">
            <h3 className="text-lg font-semibold text-primary-foreground">
              {member.name}
            </h3>
            <p className="mt-1 text-sm font-semibold text-accent">
              {member.role}
            </p>
            <p className="text-sm text-primary-foreground/75">
              {member.specialty}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
