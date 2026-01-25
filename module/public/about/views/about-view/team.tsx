import Image from 'next/image';

import { GraduationCap } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface AboutTeamProps {
  teamMembers: TeamMember[];
}

export default function AboutTeam({ teamMembers }: AboutTeamProps) {
  return (
    <section className="py-24 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-(--primary-light) text-primary text-sm font-medium mb-4">
            Naš tim
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Upoznajte naše stručnjake
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-8 rounded-2xl bg-card border border-border shadow-card hover:shadow-hover transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Image
                  src={member.imageUrl || '/default-image.png'}
                  alt={member.imageAlt || member.name}
                  className="w-32 h-32 rounded-2xl object-cover shrink-0"
                  width={128}
                  height={128}
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[rgb(13,162,231)] font-medium text-sm mb-1">
                    {member.role}
                  </p>
                  {member.specialty && (
                    <p className="text-muted-foreground text-sm mb-4">
                      <GraduationCap className="w-4 h-4 inline mr-1" />
                      {member.specialty}
                    </p>
                  )}
                  {member.bio && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
