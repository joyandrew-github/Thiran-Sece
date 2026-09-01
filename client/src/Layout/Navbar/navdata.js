// navdata.js
// Central source for navbar links + dropdown items.
// Swap this for an API/CMS response later — Navbar.jsx just maps over it.

export const navData = [
  {
    label: "Home",
    path: "/",
    dropdown: [
      { label: "Overview", path: "/" },
      { label: "Event Schedule", path: "/schedule" },
      { label: "Venue Map", path: "/venue" },
      { label: "Register Now", path: "/register" },
    ],
  },
  {
    label: "Hackathons",
    path: "/hackathons",
    dropdown: [
      { label: "24-Hr National Hackathon", path: "/hackathons/national-24hr" },
      { label: "AI / ML Challenge", path: "/hackathons/ai-ml-challenge" },
      { label: "Web3 Sprint", path: "/hackathons/web3-sprint" },
      { label: "Rules & Guidelines", path: "/hackathons/rules" },
    ],
  },
  {
    label: "Tech Fest",
    path: "/tech-fest",
    dropdown: [
      { label: "Tech Talks", path: "/tech-fest/tech-talks" },
      { label: "Technical Workshops", path: "/tech-fest/workshops" },
      { label: "Paper Presentation", path: "/tech-fest/paper-presentation" },
      { label: "Project Expo", path: "/tech-fest/project-expo" },
    ],
  },
  {
    label: "Spotlight Events",
    path: "/spotlight-events",
    dropdown: [
      { label: "Start-Up Stories", path: "/spotlight-events/startup-stories" },
      { label: "Pitch Fest", path: "/spotlight-events/pitch-fest" },
      { label: "Youth Summit", path: "/spotlight-events/youth-summit" },
      { label: "Leadership Talk", path: "/spotlight-events/leadership-talk" },
    ],
  },
  {
    label: "Events",
    path: "/events",
    dropdown: [
      { label: "Tech & Non-Tech Events", path: "/events/tech-non-tech" },
      { label: "International Education Expo", path: "/events/education-expo" },
      { label: "Sports Meet", path: "/events/sports-meet" },
      { label: "Master Classes", path: "/events/master-classes" },
    ],
  },
  {
    label: "Cultural Contests",
    path: "/cultural-contests",
    dropdown: [
      { label: "Dance", path: "/cultural-contests/dance" },
      { label: "Music", path: "/cultural-contests/music" },
      { label: "Fashion Show", path: "/cultural-contests/fashion-show" },
      { label: "Fine Arts", path: "/cultural-contests/fine-arts" },
    ],
  },
  {
    label: "Guest Lounge",
    path: "/guest-lounge",
    dropdown: [
      { label: "Speaker Profiles", path: "/guest-lounge/speakers" },
      { label: "Judges Panel", path: "/guest-lounge/judges" },
      { label: "Chief Guests", path: "/guest-lounge/chief-guests" },
    ],
  },
  {
    label: "Celebrity Shows",
    path: "/celebrity-shows",
    dropdown: [
      { label: "Day 1 Lineup", path: "/celebrity-shows/day-1" },
      { label: "Day 2 Lineup", path: "/celebrity-shows/day-2" },
      { label: "Day 3 Lineup", path: "/celebrity-shows/day-3" },
    ],
  },
];