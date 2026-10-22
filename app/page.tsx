import {
  getHomepageIdentity,
  getHomepageFlagships,
  getHomepageCapabilities,
  getHomepageExperience,
  getHomepagePersonal,
  getHomepageContact,
} from "@/lib/content/homepage-projections";
import {
  SceneIdentity,
  SceneFlagships,
  SceneExperience,
  ScenePresence,
  SceneContact,
  HomepageChapterNav,
} from "@/components/homepage";
import TechStackSection from "@/components/sections/TechStackSection";
import { SECTION_IDS } from "@/lib/anchor-navigation";

export default function Home() {
  const identity = getHomepageIdentity();
  const flagships = getHomepageFlagships();
  const experience = getHomepageExperience();
  const personal = getHomepagePersonal();
  const contact = getHomepageContact();

  return (
    <>
      <HomepageChapterNav />
      <SceneIdentity data={identity} />
      <SceneFlagships data={flagships} />
      <TechStackSection id={SECTION_IDS.stack} capabilities={getHomepageCapabilities()} />
      <SceneExperience data={experience} />
      <ScenePresence data={personal} />
      <SceneContact data={contact} />
    </>
  );
}
