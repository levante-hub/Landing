import Image from "next/image";
import posthog from "posthog-js";

export const MeetTheTeamSection = () => {
  const teamMembers = [
    {
      name: "Saúl Gómez",
      role: "Co-Founder & CEO",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQFpXxxCGGjcXQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1732099622701?e=1763596800&v=beta&t=hi_evjdu99_7NT1Le0dTDDAqlY4h1uIZdRehjYXBAsc",
      quote: "MCPs are complex and unintuitive. Current tools have unfriendly interfaces that create barriers for most users.",
      socials: {
        linkedin: "#",
        github: "#",
        twitter: "#"
      }
    },
    {
      name: "Oliver Montes",
      role: "Co-Founder & CTO",
      image: "https://media.licdn.com/dms/image/v2/C4D03AQGmxOUCws574A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1516791451112?e=1763596800&v=beta&t=BM_TOjRqJ8-u-4YQhzFEd7_Bgu1WZWC54AkMt1alBsg",
      socials: {
        linkedin: "#",
        github: "#",
        twitter: "#"
      }
    },
    {
      name: "Dennis Montes",
      role: "Product Designer",
      image: "https://media.licdn.com/dms/image/v2/C4D03AQHOMHyJj3dz6g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1601410707035?e=1763596800&v=beta&t=glJNRskSA0dqKrFQh_WozfDPkYdvNLakaV3Xg7S42AY",
      quote: "MCPs are complex and unintuitive. Current tools have unfriendly interfaces that create barriers for most users."
    },
    {
      name: "Alejandro Gómez Cerezo",
      role: "Full Stack Developer",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQGSFhNBTXvfGA/profile-displayphoto-shrink_800_800/B4DZaromkUHQAo-/0/1746636270284?e=1763596800&v=beta&t=sNBNdr7QHP3_nMUYbjOxLNsNQnW_5k7U-GlY3kxx7WU",
      socials: {
        linkedin: "#",
        github: "#",
        twitter: "#"
      }
    }
  ];

  return (
    <section id="team" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 mt-16">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h2 className="text-white text-2xl sm:text-3xl font-medium mb-2">
            Meet the Team
          </h2>
          <p className="text-gray-400 text-sm">
            The visionaries behind the revolution
          </p>
        </div>
        <button
          onClick={() => posthog.capture('join-us-clicked', { location: 'meet-the-team-section' })}
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
                    <a
                      href={member.socials.github}
                      onClick={() => posthog.capture('team-member-social-link-clicked', { member_name: member.name, social_network: 'github' })}
                      className="text-gray-400 hover:text-white transition-colors text-xs"
                    >
                      Github
                    </a>
                    <a
                      href={member.socials.twitter}
                      onClick={() => posthog.capture('team-member-social-link-clicked', { member_name: member.name, social_network: 'twitter' })}
                      className="text-gray-400 hover:text-white transition-colors text-xs"
                    >
                      Twitter (X)
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
