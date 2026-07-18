export type PlaceItem = {
  name: string;
  detail: string;
  icon: string;
  url: string;
  description: string;
  planningNote: string;
};

export const places: PlaceItem[] = [
  {
    name: "Gathering Place",
    detail: "Free · Mostly outdoor · All ages",
    icon: "PLAY",
    url: "https://www.gatheringplace.org/",
    description: "A flexible riverfront park day with playgrounds, gardens, trails, and plenty of room to change plans as you go.",
    planningNote: "Easy for a short stop or a full afternoon",
  },
  {
    name: "Discovery Lab",
    detail: "Paid · Indoor · Best for children",
    icon: "MAKE",
    url: "https://www.discoverylab.org/visit",
    description: "Hands-on science, engineering, and creative play make this a dependable option when the weather is not cooperating.",
    planningNote: "Strong rainy-day and hot-weather choice",
  },
  {
    name: "Tulsa Zoo",
    detail: "Paid · Mostly outdoor · All ages",
    icon: "ZOO",
    url: "https://tulsazoo.org/plan-your-visit/",
    description: "A larger outing with animal habitats, a children’s zoo, indoor viewing areas, and optional attractions along the way.",
    planningNote: "Plan for more walking and a longer visit",
  },
  {
    name: "Tulsa City-County Library",
    detail: "Free · Indoor · All ages",
    icon: "READ",
    url: "https://www.tulsalibrary.org/locations",
    description: "A network of local branches for books, children’s spaces, storytimes, and an easy outing that does not require a full-day commitment.",
    planningNote: "Low-pressure and easy to leave early",
  },
  {
    name: "Philbrook Museum of Art",
    detail: "Paid · Indoor + gardens · All ages",
    icon: "ART",
    url: "https://www.philbrook.org/visit",
    description: "Quiet galleries and outdoor gardens give families a mix of art, open space, and room to choose their own pace.",
    planningNote: "Pair a short gallery visit with garden time",
  },
  {
    name: "Tulsa Botanic Garden",
    detail: "Paid · Outdoor · All ages",
    icon: "GROW",
    url: "https://tulsabotanic.org/visit/",
    description: "Seasonal gardens and wide outdoor spaces offer a slower nature-focused plan away from crowded indoor attractions.",
    planningNote: "Best when the weather supports outdoor time",
  },
];
