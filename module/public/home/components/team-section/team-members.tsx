import Image, { type StaticImageData } from 'next/image';

interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  image: StaticImageData;
}

interface Props {
  team: TeamMember[];
}

export default function TeamMembers({ team }: Props) {
  return (
    <>
      {team.map((member, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:shadow-hover transition-all duration-300"
        >
          <div className="aspect-3/4 overflow-hidden">
            <Image
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-foreground/90 via-foreground/60 to-transparent p-6">
            <h3 className="text-lg font-heading font-semibold text-primary-foreground">
              {member.name}
            </h3>
            <p className="text-primary text-sm font-medium">{member.role}</p>
            <p className="text-primary-foreground/70 text-sm">
              {member.specialty}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
