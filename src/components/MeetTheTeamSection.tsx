'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import posthog from "posthog-js";

interface MeetTheTeamSectionProps {
  onOpenQuestionnaire: () => void;
}


interface TeamMember {
  name: string;
  role: string;
  image: string;
  quote?: string;
  socials?: {
    linkedin: string;
    github?: string;
  };
}

export const MeetTheTeamSection = ({ onOpenQuestionnaire }: MeetTheTeamSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const teamSection = document.getElementById('team');
    if (teamSection) {
      observer.observe(teamSection);
    }

    return () => {
      if (teamSection) {
        observer.unobserve(teamSection);
      }
    };
  }, []);

  const teamMembers: TeamMember[] = [
    {
      name: "Saúl Gómez",
      role: "Co-Founder & CEO",
      image: "/saul-img.png",
      socials: {
        linkedin: "https://www.linkedin.com/in/saul-gomez-jimenez-47b30328b/",
        github: "https://github.com/Saul-Gomez-J"
      }
    },
    {
      name: "Oliver Montes",
      role: "Co-Founder & CTO",
      image: "/oliver-img.png",
      socials: {
        linkedin: "https://www.linkedin.com/in/olivermontes/",
        github: "https://github.com/olivermontes"
      }
    },
    {
      name: "Alejandro Gómez",
      role: "Full Stack Developer",
      image: "/Alejandro-img.png",
      socials: {
        linkedin: "https://www.linkedin.com/in/alejandro-gomez-cerezo/",
        github: "#"
      }
    },
    {
      name: "Dennis Montes",
      role: "Product Designer",
      image: "/dennis-img.png",
      socials: {
        linkedin: "https://www.linkedin.com/in/dennis-montes/",
        github: "#"
      }
    }
  ];

  return (
    <section 
      id="team" 
      className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 mt-16 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-10">
        <div>
          <h2 className="text-slate-900 text-2xl sm:text-3xl font-medium mb-2">
            Founders
          </h2>
          <p className="text-slate-600 text-sm">
            The visionaries behind the revolution
          </p>
        </div>
        <button
          onClick={() => {
            posthog.capture('join-us-clicked', { location: 'meet-the-team-section' });
            onOpenQuestionnaire();
          }}
          className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-black/90 transition-colors self-start md:self-auto"
        >
          Join Us
        </button>
      </div>

      {/* Team Members */}
      <div className="space-y-6">
        {teamMembers.map((member, index) => (
          <div
            key={member.name}
            className="border-t border-slate-200 pt-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* Avatar */}
              <div className="lg:col-span-2">
                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              {/* Name */}
              <div className="lg:col-span-3">
                <h3 className="text-slate-900 text-base font-medium">
                  {member.name}
                </h3>
              </div>

              {/* Role */}
              <div className="lg:col-span-3">
                <p className="text-slate-600 text-sm">
                  {member.role}
                </p>
              </div>

              {/* Quote or Socials */}
              <div className="lg:col-span-4">
                {member.socials && (
                  <div className="flex items-center gap-4">
                    {member.socials.linkedin && (
                      <a
                        href={member.socials.linkedin}
                        onClick={() => posthog.capture('team-member-social-link-clicked', { member_name: member.name, social_network: 'linkedin' })}
                        className="text-slate-700 hover:text-slate-900 transition-colors text-xs"
                      >
                        LinkedIn
                      </a>
                    )}
                    {member.socials.github && member.socials.github !== "#" && (
                      <a
                        href={member.socials.github}
                        onClick={() => posthog.capture('team-member-social-link-clicked', { member_name: member.name, social_network: 'github' })}
                        className="text-slate-700 hover:text-slate-900 transition-colors text-xs"
                      >
                        Github
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
