const BIRTHDAY_NAME = "Love"; // Replace with the birthday person's name

export const siteConfig = {
  name: BIRTHDAY_NAME,
  birthday: {
    month: 10, // October
    day: 31,
  },
  hero: {
    headline: `Happy Birthday, ${BIRTHDAY_NAME}! 🎉`,
    subtitle: "Wishing you a day filled with love, laughter, and all your favorite things.",
    ctaText: "Open your surprise",
  },
  wishes: [
    {
      id: 1,
      title: "Hmm...",
      content:
        "Thinking of you on your special day and hoping it's as wonderful as you are. May this year bring you endless joy and beautiful moments.",
    },
    {
      id: 2,
      title: "Twww...",
      content:
        "Sending you the biggest hug and the warmest wishes. You deserve all the happiness in the world today and always.",
    },
    {
      id: 3,
      title: "Is cheez k ladd nahi hein",
      content:
        "There's no one quite like you — kind, radiant, and truly special. Hope your birthday is just as amazing as you make everyone around you feel.",
    },
    {
      id: 4,
      title: "Pata nahi...",
      content:
        "May your year ahead sparkle with new adventures, sweet surprises, and dreams coming true. Keep shining, birthday star! ✨",
    },
    {
      id: 5,
      title: "Kuch nahi..",
      content:
        "So lucky to celebrate you today. Thank you for being you — for the laughter, the memories, and the love you bring into every room.",
    },
  ],
  memories: [
    {
      id: 1,
      image: "/photos/memory1.jpg",
      caption: "A beautiful moment together",
    },
    {
      id: 2,
      image: "/photos/memory2.jpg",
      caption: "Laughter that never ends",
    },
    {
      id: 3,
      image: "/photos/memory3.jpg",
      caption: "Making memories",
    },
    {
      id: 4,
      image: "/photos/memory4.jpg",
      caption: "Pure joy",
    },
  ],
  surprise: {
    title: " A Special Surprise for You",
    message:
      `${BIRTHDAY_NAME}, on your birthday, I just want you to know how incredibly special you are. Every moment with you is a gift, and I'm so grateful for you. May this year bring you everything your heart desires and more. Happy Birthday, my love! ❤️`,
  },
  footer: {
    credit: "Made with ❤️ by your Love",
  },
  mascot: {
    directions: "/mascots/ballerina-directions.webp",
    reactions: "/mascots/ballerina-reactions.webp",
    size: 180,
    label: "Birthday mascot",
  },
} as const;

export type SiteConfig = typeof siteConfig;