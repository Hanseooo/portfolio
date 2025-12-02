import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import dynata from "@/assets/images/Companies/dynata.png";
import mata from "@/assets/images/Companies/mata-tech.png";
import rivan from "@/assets/images/Companies/rivan-it-cebu.jpg";
import tarsier from "@/assets/images/Companies/TaRSIER-117.jpg";
import cebuInit from "@/assets/images/Companies/UP-Cebu-Business-Incubator.png";
import { useEffect } from "react";

export type Company = {
  name: string;
  description: string;
  image: string;
  link: string | null;
  JournalEntry: {
    observations: string;
    learnings: string;
  };
};

const companies: Company[] = [
  {
    name: "UP Cebu Business Incubator for Information Technology  (UP CeBu InIT)",
    description:
      "a program at University of the Philippines Cebu, established in 2010 with the Department of Science and Technology (DOST), to support startups and innovators in the IT sector. It provides services like mentorship, training, venture financing, and referrals to help businesses grow from idea development to commercialization.",
    image: cebuInit,
    link: "https://www.facebook.com/UPCebuinIT/",
    JournalEntry: {
      observations: "I observed that they value innovation and try to help achieve and provide sustainable solutions to problems thus helping startups and students by providing guidance.",
      learnings: "I learned to be resourceful with my ideas to solve a problem like using current trends to inefficient systems to improve it.",
    },
  },
  {
    name: "Dynata Philippines Inc.",
    description:
      "the local branch of Dynata, a global data company that collects and provides first-party data for market research and other insights. The company's operations in the Philippines serve as a local hub for these services, which include providing data for marketing, advertising, and consulting purposes.",
    image: dynata,
    link: "https://www.dynata.com/",
    JournalEntry: {
      observations: "I observed that it is a company that gives importance to their employees' career growth and safety.",
      learnings: "I learned about the different positions/roles in the company, how they work, and how they handle projects together. They told us about what the different positions do  or theyr roles. I also learned about programming languages they use in their company.",
    },
  },
  {
    name: "Rivan IT Cebu",
    description:
      "an IT bootcamp and training institute that offers courses in networking and IT certifications, such as CCNA, CompTIA Security+, and ITIL 4 Foundation. It focuses on practical, hands-on training with real-world labs to prepare students for careers in the IT industry and has a high exam passing rate.",
    image: rivan,
    link: "https://www.facebook.com/rivanitcebu/",
    JournalEntry: {
      observations: "I observed that they are more into networking which is a field that is also fundamentally essential in cybersecurity and cloud computing. They value a person's skillset determination to learn.",
      learnings: "I learned about the habitsthat make a skilled professional. I learned about how small habits impact the transition of productive actions with discomfort into a productive action with comfort. I also learned how to configure a switch with analog telephones connected to it using a CLI during the activity.",
    },
  },
  {
    name: "Mata Technologies Inc.",
    description:
      "a Philippine-based digital company specializing in virtual mapping and 360-degree virtual tours for tourism and real estate. They provide immersive, interactive virtual experiences for locations across the country, including scenic and heritage sites, and partner with organizations like the Cebu Provincial Government and the Ramon Aboitiz Foundation Inc.",
    image: mata,
    link: "https://mata.tours/",
    JournalEntry: {
      observations: "I observed that they value their employees and growth and offers trainings. They aim to make it accesible to users the places they are about to visit by providing 360-degree virtual tours.",
      learnings: "I learned about how they made their 3D components/assets and the roles of the people working in the company.",
    },
  },
  {
    name: "T.A.R.S.I.E.R 117",
    description:
      "the province-wide emergency response program for Bohol, which stands for Telephone and Radio System Integrated Emergency Response. Established by the Provincial Government of Bohol in 2010, it provides immediate services for crises and public concerns like calamity aid, medical assistance, and police and fire prevention, using various communication methods such as telephones, radio, and mobile apps.",
    image: tarsier,
    link: "https://www.facebook.com/TaRSIER117/",
    JournalEntry: {
      observations: "tba",
      learnings: "tba",
    },
  },
];

export default function CompaniesVisitedSection() {

    useEffect (() => {
       window.scrollTo(0, 0)
    })

  return (
    <article className="max-w-6xl mx-auto px-4 py-12 space-y-20" id="tour-company-journal">
      <h4 className="text-3xl font-bold">Journal Entries</h4>

      {companies.map((company, index) => (
        <motion.div
          key={company.name}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`flex flex-col items-center gap-8 md:gap-12 lg:flex-row ${
            index % 2 !== 0 ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Image */}
          <div className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-md bg-muted/20 p-2">
            <img
              src={company.image}
              alt={company.name}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>

          {/* Text + Journal Entry */}
          <div className="w-full lg:w-1/2 space-y-4 text-center lg:text-left">
            <h3 className="text-2xl font-semibold">{company.name}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {company.description}
            </p>

            {/* External link */}
            {company.link && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      window.open(company.link!, "_blank", "noopener,noreferrer")
                    }
                    className="mt-3"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>view page</TooltipContent>
              </Tooltip>
            )}

            {/* Journal Entry Section */}
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mt-6 p-4 rounded-lg bg-muted/30 text-left space-y-2">
              <h4 className="text-lg font-semibold">Journal Entry</h4>
              <p className="text-foreground/70">
                <span className="font-semibold text-primary">Observations:</span>{" "}
                {company.JournalEntry.observations}
              </p>
              <p className="text-foreground/70">
                <span className="font-semibold text-primary">Learnings:</span>{" "}
                {company.JournalEntry.learnings}
              </p>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </article>
  );
}