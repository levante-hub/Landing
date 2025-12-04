import Image from "next/image";
import posthog from "posthog-js";

interface MeetTheTeamSectionProps {
  onOpenQuestionnaire: () => void;
}

export const MeetTheTeamSection = ({ onOpenQuestionnaire }: MeetTheTeamSectionProps) => {
  const teamMembers = [
    {
      name: "Saúl Gómez",
      role: "Co-Founder & CEO",
      image: "https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/Perfiles%20Linkedin/saul.jpeg",
      socials: {
        linkedin: "https://www.linkedin.com/in/saul-gomez-jimenez-47b30328b/"
      }
    },
    {
      name: "Oliver Montes",
      role: "Co-Founder & CTO",
      image: "https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/Perfiles%20Linkedin/oliver.jpeg",
      socials: {
        linkedin: "https://www.linkedin.com/in/olivermontes/"
      }
    },
    {
      name: "Dennis Montes",
      role: "Product Designer",
      image: "https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/Perfiles%20Linkedin/Dennis.jpeg",
      socials: {
        linkedin: "https://www.linkedin.com/in/dennis-montes/"
      }
    },
    {
      name: "Alejandro Gómez Cerezo",
      role: "Full Stack Developer",
      image: "https://1y03izjmgsaiyedf.public.blob.vercel-storage.com/Perfiles%20Linkedin/Alejandro.jpeg",
      socials: {
        linkedin: "https://www.linkedin.com/in/alejandro-gomez-cerezo/"
      }
    }
  ];

  return (
    <section id="team" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 mt-16">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h2 className="text-white text-2xl sm:text-3xl font-medium mb-2">
            Founders
          </h2>
          <p className="text-gray-400 text-sm">
            The visionaries behind the revolution
          </p>
        </div>
        <button
          onClick={() => {
            posthog.capture('join-us-clicked', { location: 'meet-the-team-section' });
            onOpenQuestionnaire();
          }}
          className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Join Us
        </button>
      </div>

      {/* Team Members */}
      <div className="space-y-6">
        {teamMembers.map((member, index) => (
          <div
            key={member.name}
            className="border-t border-gray-800 pt-6"
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
                  />
                </div>
              </div>

              {/* Name */}
              <div className="lg:col-span-3">
                <h3 className="text-white text-base font-medium">
                  {member.name}
                </h3>
              </div>

              {/* Role */}
              <div className="lg:col-span-3">
                <p className="text-gray-400 text-sm">
                  {member.role}
                </p>
              </div>

              {/* Quote or Socials */}
              <div className="lg:col-span-4">
                {member.quote ? (
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {member.quote}
                  </p>
                ) : member.socials ? (
                  <div className="flex items-center gap-4">
                    <a
                      href={member.socials.linkedin}
                      onClick={() => posthog.capture('team-member-social-link-clicked', { member_name: member.name, social_network: 'linkedin' })}
                      className="text-gray-400 hover:text-white transition-colors text-xs"
                    >
                      LinkedIn
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
