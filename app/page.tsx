import {
  getHomepageIdentity,
  getHomepageFlagships,
  getHomepageExperience,
  getHomepageMoreWork,
  getHomepagePersonal,
  getHomepageContact,
} from "@/lib/content/homepage-projections";
import {
  SceneIdentity,
  SceneFlagships,
  SceneExperience,
  SceneMoreWork,
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
  const moreWork = getHomepageMoreWork();
  const personal = getHomepagePersonal();
  const contact = getHomepageContact();

  return (
    <>
      <HomepageChapterNav />
      <SceneIdentity data={identity} />
      <SceneFlagships data={flagships} />
      <TechStackSection id={SECTION_IDS.stack} />
      <SceneExperience data={experience} />
      <SceneMoreWork data={moreWork} />
      <ScenePresence data={personal} />
      <SceneContact data={contact} />
    </>
  );
}
