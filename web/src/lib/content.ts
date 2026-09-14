export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experiences", label: "Experiences" },
  { href: "/technology", label: "Technology" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
] as const;

export const services = [
  {
    line1: "Experiential",
    line2: "Activations",
    icon: "lightbulb",
  },
  {
    line1: "Digital",
    line2: "Experiences",
    icon: "phone",
  },
  {
    line1: "Event",
    line2: "Technology",
    icon: "gear",
  },
  {
    line1: "Crowd",
    line2: "Management",
    icon: "crowd",
  },
  {
    line1: "Event",
    line2: "Environments",
    icon: "chair",
  },
  {
    line1: "Consultation",
    line2: "& Concept Development",
    icon: "consult",
  },
] as const;

export const processSteps = [
  {
    number: "01",
    title: "Attract",
    copy: "Create something impossible to ignore.",
  },
  {
    number: "02",
    title: "Engage",
    copy: "Give people a reason to participate.",
  },
  {
    number: "03",
    title: "Experience",
    copy: "Make the interaction memorable.",
  },
  {
    number: "04",
    title: "Capture",
    copy: "Turn participation into measurable engagement.",
  },
  {
    number: "05",
    title: "Connect",
    copy: "Build a relationship beyond the event.",
  },
] as const;

export const featuredExperiences = [
  {
    title: "The Giant Claw",
    description:
      "A familiar game transformed into an event landmark. Scale creates curiosity. Participation creates entertainment. Queues create further curiosity.",
    image: "/images/exp-claw.png",
    href: "/experiences#giant-claw",
  },
  {
    title: "The Gift Tree",
    description:
      "Discovery creates engagement. A branded display becomes a physical discovery experience — when the audience interacts with the branding, the branding becomes part of the memory.",
    image: "/images/exp-touch.png",
    href: "/experiences#gift-tree",
  },
  {
    title: "Walking LED Media",
    description:
      "Take the message to the crowd. Mobile digital content moves through exhibitions, malls and event environments as audience attraction and directional media.",
    image: "/images/exp-led.png",
    href: "/experiences#walking-led",
  },
] as const;

export const proofPoints = [
  "Visitor Queues",
  "Social Sharing",
  "Brand Engagement",
  "Measurable Registration",
] as const;
