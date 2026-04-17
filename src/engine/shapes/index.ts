/**
 * Shape Registry
 *
 * The master list of all built-in shapes.
 * Each shape is an SVG path designed for a 200x150 viewBox (4:3 barcode ratio).
 *
 * Rules for paths:
 * - All paths must be closed (end with Z)
 * - Must be a single compound path (multiple subpaths OK, M...Z M...Z)
 * - The base of the shape should sit at or near y=150 (bottom of viewBox)
 * - Shapes should span at least 60% of the width (120px of 200px)
 * - No internal holes — silhouette only
 */

import type { Shape } from "@/types/shapes";

export const SHAPES: Shape[] = [
  // ─── Nature ───────────────────────────────────────────────────────────────
  {
    id: "palm-tree",
    name: "Palm Tree",
    category: "nature",
    tags: ["tropical", "beach", "summer", "tree"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.8,
    svgPath:
      "M100,150 L95,80 C80,70 50,55 30,60 C50,50 75,55 92,70 L88,50 C70,35 40,25 20,30 C42,18 70,28 88,45 L86,30 C72,15 50,8 35,12 C55,2 78,12 88,28 L90,15 C88,5 100,0 100,0 C100,0 112,5 110,15 L112,28 C122,12 145,2 165,12 C150,8 128,15 114,30 L112,45 C130,28 158,18 180,30 C160,25 130,35 112,50 L108,70 C125,55 150,50 170,60 C150,55 120,70 105,80 L100,150 Z",
    recommendedTypes: ["EAN-13", "EAN-8", "CODE-128", "UPC-A"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "mountain",
    name: "Mountain",
    category: "nature",
    tags: ["mountain", "peak", "landscape", "outdoor"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M0,150 L60,60 L80,85 L100,30 L120,85 L140,55 L200,150 Z",
    recommendedTypes: ["EAN-13", "CODE-128", "UPC-A"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "wave",
    name: "Wave",
    category: "nature",
    tags: ["ocean", "sea", "water", "wave", "surf"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.75,
    svgPath:
      "M0,100 C25,70 50,120 75,90 C100,60 125,110 150,80 C175,50 190,90 200,75 L200,150 L0,150 Z",
    recommendedTypes: ["EAN-13", "EAN-8", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "tree",
    name: "Pine Tree",
    category: "nature",
    tags: ["tree", "pine", "forest", "christmas"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.8,
    svgPath:
      "M100,5 L65,55 L80,55 L50,95 L70,95 L40,135 L85,135 L85,150 L115,150 L115,135 L160,135 L130,95 L150,95 L120,55 L135,55 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "cloud",
    name: "Cloud",
    category: "nature",
    tags: ["cloud", "sky", "weather", "tech"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.75,
    svgPath:
      "M155,120 L45,120 C25,120 10,105 10,88 C10,72 22,59 38,57 C37,53 36,49 36,45 C36,27 51,12 70,12 C78,12 85,15 91,20 C97,8 111,0 127,0 C150,0 168,18 168,40 C168,42 168,44 167,46 C185,50 198,65 198,83 C198,103 179,120 155,120 Z",
    recommendedTypes: ["EAN-8", "QR"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "cactus",
    name: "Cactus",
    category: "nature",
    tags: ["cactus", "desert", "succulent", "southwest"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M90,150 L90,90 L65,90 L65,60 L75,60 L75,80 L90,80 L90,60 C90,40 100,10 100,10 C100,10 110,40 110,60 L110,80 L125,80 L125,60 L135,60 L135,90 L110,90 L110,150 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },

  // ─── Animals ──────────────────────────────────────────────────────────────
  {
    id: "cat",
    name: "Cat",
    category: "animals",
    tags: ["cat", "kitten", "pet", "animal"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M40,150 L40,100 L20,70 L35,65 L50,85 L60,70 C65,50 75,30 100,20 C125,30 135,50 140,70 L150,85 L165,65 L180,70 L160,100 L160,150 Z M70,20 L60,5 L75,18 Z M130,20 L140,5 L125,18 Z",
    recommendedTypes: ["EAN-13", "CODE-128", "EAN-8"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "whale",
    name: "Whale",
    category: "animals",
    tags: ["whale", "ocean", "sea", "marine"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.8,
    svgPath:
      "M10,80 C10,50 35,25 80,20 C130,15 170,35 185,60 L200,50 L190,80 L200,100 L180,90 C165,115 140,130 105,130 C55,130 10,110 10,80 Z M155,55 C158,50 162,50 165,55 C162,57 158,57 155,55 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "bird",
    name: "Bird in Flight",
    category: "animals",
    tags: ["bird", "fly", "freedom", "wings"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.7,
    svgPath:
      "M100,75 C80,50 20,30 0,50 C30,50 60,60 80,80 C60,70 20,80 5,100 C35,85 70,80 90,90 L100,100 L110,90 C130,80 165,85 195,100 C180,80 140,70 120,80 C140,60 170,50 200,50 C180,30 120,50 100,75 Z",
    recommendedTypes: ["EAN-8", "QR", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "butterfly",
    name: "Butterfly",
    category: "animals",
    tags: ["butterfly", "wings", "nature", "transformation"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M100,30 C95,60 85,75 60,70 C30,65 5,80 10,100 C15,120 50,130 80,110 C90,100 97,90 100,80 C103,90 110,100 120,110 C150,130 185,120 190,100 C195,80 170,65 140,70 C115,75 105,60 100,30 Z M98,30 L102,30 L102,150 L98,150 Z",
    recommendedTypes: ["EAN-8", "QR"],
    isCustom: false,
    isPremium: false,
  },

  // ─── Food & Drink ─────────────────────────────────────────────────────────
  {
    id: "coffee-cup",
    name: "Coffee Cup",
    category: "food-drink",
    tags: ["coffee", "cup", "cafe", "drink", "morning"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M40,40 L50,130 C50,140 60,145 75,145 L125,145 C140,145 150,140 150,130 L160,40 Z M160,60 C175,62 185,70 185,85 C185,100 175,108 160,110 Z M60,20 C65,10 75,5 80,15 C85,5 95,0 100,10 C105,0 115,5 120,15 C125,5 135,10 140,20 Z",
    recommendedTypes: ["EAN-13", "CODE-128", "EAN-8"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "wine-bottle",
    name: "Wine Bottle",
    category: "food-drink",
    tags: ["wine", "bottle", "drink", "luxury"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M85,0 L85,35 C70,45 60,65 60,85 L60,140 C60,146 67,150 75,150 L125,150 C133,150 140,146 140,140 L140,85 C140,65 130,45 115,35 L115,0 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "ice-cream",
    name: "Ice Cream",
    category: "food-drink",
    tags: ["ice cream", "dessert", "summer", "sweet"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M100,0 C70,0 45,22 45,50 C45,72 60,90 80,97 L70,150 L130,150 L120,97 C140,90 155,72 155,50 C155,22 130,0 100,0 Z",
    recommendedTypes: ["EAN-8", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "pizza-slice",
    name: "Pizza Slice",
    category: "food-drink",
    tags: ["pizza", "food", "slice", "italian"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M100,5 L10,145 C10,148 15,150 20,148 L100,120 L180,148 C185,150 190,148 190,145 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "cocktail",
    name: "Cocktail",
    category: "food-drink",
    tags: ["cocktail", "drink", "bar", "martini"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M20,10 L100,90 L100,135 L75,135 L75,145 L125,145 L125,135 L100,135 L100,90 L180,10 Z",
    recommendedTypes: ["EAN-13", "EAN-8", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "pineapple",
    name: "Pineapple",
    category: "food-drink",
    tags: ["pineapple", "tropical", "fruit", "summer"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M100,0 C85,0 70,15 75,25 C65,20 60,30 65,38 C55,35 52,48 60,52 C55,65 60,80 65,90 L70,145 C70,148 75,150 80,148 L120,148 C125,150 130,148 130,145 L135,90 C140,80 145,65 140,52 C148,48 145,35 135,38 C140,30 135,20 125,25 C130,15 115,0 100,0 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },

  // ─── People & Culture ─────────────────────────────────────────────────────
  {
    id: "human",
    name: "Human Figure",
    category: "people-culture",
    tags: ["person", "human", "people", "figure"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M100,0 C88,0 80,8 80,18 C80,28 88,36 100,36 C112,36 120,28 120,18 C120,8 112,0 100,0 Z M75,40 C65,40 58,48 58,58 L58,100 L45,150 L65,150 L75,110 L80,110 L80,150 L120,150 L120,110 L125,110 L135,150 L155,150 L142,100 L142,58 C142,48 135,40 125,40 Z",
    recommendedTypes: ["EAN-13", "CODE-128", "EAN-8"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "heart",
    name: "Heart",
    category: "people-culture",
    tags: ["heart", "love", "valentine", "romantic"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M100,140 C95,135 20,85 20,50 C20,25 40,10 60,10 C75,10 88,18 100,30 C112,18 125,10 140,10 C160,10 180,25 180,50 C180,85 105,135 100,140 Z",
    recommendedTypes: ["EAN-8", "QR", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "star",
    name: "Star",
    category: "people-culture",
    tags: ["star", "award", "rating", "celebrity"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M100,5 L120,60 L180,60 L130,95 L148,150 L100,115 L52,150 L70,95 L20,60 L80,60 Z",
    recommendedTypes: ["EAN-8", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "crown",
    name: "Crown",
    category: "people-culture",
    tags: ["crown", "king", "queen", "luxury", "premium"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.8,
    svgPath:
      "M20,120 L20,60 L55,90 L100,20 L145,90 L180,60 L180,120 Z",
    recommendedTypes: ["EAN-13", "CODE-128", "EAN-8"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "guitar",
    name: "Guitar",
    category: "people-culture",
    tags: ["guitar", "music", "instrument", "rock"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M95,0 L105,0 L110,55 C125,55 140,68 140,85 C140,105 122,120 100,120 C78,120 60,105 60,85 C60,68 75,55 90,55 Z M100,5 C97,5 97,30 100,30 C103,30 103,5 100,5 Z",
    recommendedTypes: ["CODE-128", "EAN-8"],
    isCustom: false,
    isPremium: false,
  },

  // ─── Architecture ─────────────────────────────────────────────────────────
  {
    id: "house",
    name: "House",
    category: "architecture",
    tags: ["house", "home", "real estate", "building"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M100,15 L10,75 L30,75 L30,145 L80,145 L80,110 L120,110 L120,145 L170,145 L170,75 L190,75 Z",
    recommendedTypes: ["EAN-13", "CODE-128", "UPC-A"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "skyline",
    name: "City Skyline",
    category: "architecture",
    tags: ["city", "skyline", "urban", "buildings"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M0,150 L0,100 L20,100 L20,80 L30,80 L30,70 L40,70 L40,60 L50,60 L50,90 L60,90 L60,50 L70,50 L70,40 L80,40 L80,50 L90,50 L90,30 L100,20 L110,30 L110,50 L120,50 L120,40 L130,40 L130,60 L140,60 L140,55 L150,45 L155,45 L155,55 L165,55 L165,70 L175,70 L175,85 L185,85 L185,100 L200,100 L200,150 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "lighthouse",
    name: "Lighthouse",
    category: "architecture",
    tags: ["lighthouse", "ocean", "navigation", "coastal"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M90,0 L110,0 L115,30 L125,30 L125,45 L115,45 L120,120 L130,145 L70,145 L80,120 L85,45 L75,45 L75,30 L85,30 Z M85,8 L115,8 L115,25 L85,25 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },

  // ─── Transport ────────────────────────────────────────────────────────────
  {
    id: "car",
    name: "Car",
    category: "transport",
    tags: ["car", "vehicle", "auto", "transport"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.75,
    svgPath:
      "M20,100 L20,80 L40,60 L80,50 L120,50 L160,60 L180,80 L180,100 L20,100 Z M45,100 C45,110 55,118 67,118 C79,118 89,110 89,100 Z M111,100 C111,110 121,118 133,118 C145,118 155,110 155,100 Z",
    recommendedTypes: ["EAN-13", "CODE-128", "UPC-A"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "rocket",
    name: "Rocket",
    category: "transport",
    tags: ["rocket", "space", "launch", "startup"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M100,0 C85,20 75,50 75,80 L75,140 L85,150 L100,145 L115,150 L125,140 L125,80 C125,50 115,20 100,0 Z M75,90 C65,90 55,100 50,115 L75,115 Z M125,90 L125,115 L150,115 C145,100 135,90 125,90 Z",
    recommendedTypes: ["CODE-128", "EAN-8"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "airplane",
    name: "Airplane",
    category: "transport",
    tags: ["airplane", "flight", "travel", "air"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.7,
    svgPath:
      "M100,40 C90,42 85,50 85,65 L20,100 L20,110 L85,95 L85,120 L65,130 L65,138 L100,128 L135,138 L135,130 L115,120 L115,95 L180,110 L180,100 L115,65 C115,50 110,42 100,40 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "bicycle",
    name: "Bicycle",
    category: "transport",
    tags: ["bicycle", "bike", "cycling", "eco"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.8,
    svgPath:
      "M55,145 C35,145 18,128 18,108 C18,88 35,71 55,71 C75,71 92,88 92,108 C92,128 75,145 55,145 Z M55,71 L100,40 L145,71 M145,145 C125,145 108,128 108,108 C108,88 125,71 145,71 C165,71 182,88 182,108 C182,128 165,145 145,145 Z M100,40 L100,108 M100,40 L120,108",
    recommendedTypes: ["EAN-8", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },

  // ─── Tech & Objects ───────────────────────────────────────────────────────
  {
    id: "camera",
    name: "Camera",
    category: "tech-objects",
    tags: ["camera", "photo", "photography", "lens"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M20,45 L20,130 C20,138 28,145 38,145 L162,145 C172,145 180,138 180,130 L180,45 C180,37 172,30 162,30 L145,30 L135,15 L65,15 L55,30 L38,30 C28,30 20,37 20,45 Z M100,112 C80,112 65,97 65,78 C65,59 80,44 100,44 C120,44 135,59 135,78 C135,97 120,112 100,112 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "headphones",
    name: "Headphones",
    category: "tech-objects",
    tags: ["headphones", "music", "audio", "sound"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M100,15 C60,15 28,45 28,83 L28,100 C18,103 10,112 10,123 C10,136 20,145 33,145 L50,145 L50,100 C50,65 72,38 100,38 C128,38 150,65 150,100 L150,145 L167,145 C180,145 190,136 190,123 C190,112 182,103 172,100 L172,83 C172,45 140,15 100,15 Z",
    recommendedTypes: ["CODE-128", "EAN-8"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "diamond",
    name: "Diamond",
    category: "tech-objects",
    tags: ["diamond", "gem", "luxury", "precious"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M100,145 L10,55 L40,10 L160,10 L190,55 Z M10,55 L75,55 L100,10 L40,10 Z M190,55 L125,55 L100,10 L160,10 Z",
    recommendedTypes: ["EAN-13", "CODE-128", "EAN-8"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "flame",
    name: "Flame",
    category: "tech-objects",
    tags: ["fire", "flame", "hot", "energy"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M100,0 C100,0 80,30 90,55 C70,40 65,60 75,80 C55,65 50,90 60,110 C65,130 80,145 100,150 C120,145 135,130 140,110 C150,90 145,65 125,80 C135,60 130,40 110,55 C120,30 100,0 100,0 Z",
    recommendedTypes: ["CODE-128", "EAN-8"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "lightning",
    name: "Lightning Bolt",
    category: "tech-objects",
    tags: ["lightning", "electric", "power", "energy", "fast"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M120,0 L55,80 L90,80 L80,150 L145,65 L110,65 Z",
    recommendedTypes: ["EAN-13", "CODE-128", "EAN-8"],
    isCustom: false,
    isPremium: false,
  },

  // ─── Abstract ─────────────────────────────────────────────────────────────
  {
    id: "shield",
    name: "Shield",
    category: "abstract",
    tags: ["shield", "security", "protection", "badge"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M100,8 L20,40 L20,90 C20,120 55,142 100,150 C145,142 180,120 180,90 L180,40 Z",
    recommendedTypes: ["EAN-13", "CODE-128", "UPC-A"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "hexagon",
    name: "Hexagon",
    category: "abstract",
    tags: ["hexagon", "geometric", "tech", "modern"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.95,
    svgPath:
      "M100,5 L175,47 L175,103 L100,145 L25,103 L25,47 Z",
    recommendedTypes: ["EAN-13", "CODE-128", "EAN-8"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "arch",
    name: "Arch",
    category: "abstract",
    tags: ["arch", "doorway", "portal", "minimal"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M20,150 L20,80 C20,38 55,10 100,10 C145,10 180,38 180,80 L180,150 L155,150 L155,82 C155,52 130,32 100,32 C70,32 45,52 45,82 L45,150 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },

  // ─── Nature (Extended) ────────────────────────────────────────────────────
  {
    id: "sun",
    name: "Sun",
    category: "nature",
    tags: ["sun", "bright", "summer", "energy"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M100,75 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0 Z M95,10 L105,10 L105,30 L95,30 Z M95,120 L105,120 L105,140 L95,140 Z M25,70 L45,70 L45,80 L25,80 Z M155,70 L175,70 L175,80 L155,80 Z M40,30 L50,20 L65,35 L55,45 Z M135,115 L145,105 L160,120 L150,130 Z M40,120 L55,105 L65,115 L50,130 Z M135,35 L150,20 L160,30 L145,45 Z",
    recommendedTypes: ["EAN-8", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "moon",
    name: "Crescent Moon",
    category: "nature",
    tags: ["moon", "night", "lunar", "crescent"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M70,10 C40,20 20,50 20,85 C20,125 55,145 95,145 C130,145 160,125 175,95 C150,115 115,115 90,95 C60,70 55,35 70,10 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "flower",
    name: "Flower",
    category: "nature",
    tags: ["flower", "bloom", "petals", "spring"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M100,75 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0 Z M100,10 C85,25 85,50 100,60 C115,50 115,25 100,10 Z M100,140 C85,125 85,100 100,90 C115,100 115,125 100,140 Z M35,75 C50,60 75,60 85,75 C75,90 50,90 35,75 Z M165,75 C150,60 125,60 115,75 C125,90 150,90 165,75 Z M50,25 C70,30 85,50 85,65 C70,60 55,45 50,25 Z M150,25 C130,30 115,50 115,65 C130,60 145,45 150,25 Z M50,125 C70,120 85,100 85,85 C70,90 55,105 50,125 Z M150,125 C130,120 115,100 115,85 C130,90 145,105 150,125 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "leaf",
    name: "Leaf",
    category: "nature",
    tags: ["leaf", "plant", "nature", "eco"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M100,10 C60,30 30,70 40,110 C50,140 90,145 100,140 C110,145 150,140 160,110 C170,70 140,30 100,10 Z M100,30 L100,140 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },

  // ─── Animals (Extended) ───────────────────────────────────────────────────
  {
    id: "dog",
    name: "Dog",
    category: "animals",
    tags: ["dog", "puppy", "pet", "animal"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M30,80 L30,140 L50,140 L50,100 L80,100 L80,140 L120,140 L120,100 L150,100 L150,140 L170,140 L170,80 C170,60 155,45 135,45 L130,35 L115,15 L100,35 L85,15 L70,35 L65,45 C45,45 30,60 30,80 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "horse",
    name: "Horse",
    category: "animals",
    tags: ["horse", "equestrian", "pony", "animal"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.88,
    svgPath:
      "M25,145 L25,90 C25,75 35,65 50,65 L60,65 L55,45 L65,25 L75,20 L80,30 L100,25 L115,30 L135,25 L140,35 L150,50 L150,75 L165,80 L175,100 L170,145 L155,145 L150,115 L115,115 L115,145 L100,145 L100,120 L70,120 L70,145 L55,145 L55,115 L40,115 L40,145 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "fish",
    name: "Fish",
    category: "animals",
    tags: ["fish", "sea", "ocean", "aquatic"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.8,
    svgPath:
      "M20,75 L50,40 L55,60 C75,45 105,45 135,55 C160,65 180,75 195,60 L180,100 C195,85 175,85 150,95 C120,105 85,105 65,90 L50,110 Z M140,70 C142,68 146,68 148,70 C146,72 142,72 140,70 Z",
    recommendedTypes: ["EAN-8", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "penguin",
    name: "Penguin",
    category: "animals",
    tags: ["penguin", "bird", "antarctic", "cute"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.92,
    svgPath:
      "M100,5 C80,5 65,20 65,40 L65,55 C50,60 40,80 40,105 L40,145 L70,145 L75,125 L85,145 L115,145 L125,145 L130,125 L135,145 L160,145 L160,105 C160,80 150,60 135,55 L135,40 C135,20 120,5 100,5 Z M85,28 C85,30 87,32 89,32 C91,32 93,30 93,28 Z M107,28 C107,30 109,32 111,32 C113,32 115,30 115,28 Z M93,42 L107,42 L100,52 Z",
    recommendedTypes: ["CODE-128", "EAN-8"],
    isCustom: false,
    isPremium: false,
  },

  // ─── Food & Drink (Extended) ──────────────────────────────────────────────
  {
    id: "banana",
    name: "Banana",
    category: "food-drink",
    tags: ["banana", "fruit", "yellow", "tropical"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.88,
    svgPath:
      "M40,20 C30,15 22,25 25,40 C30,75 55,115 95,135 C135,150 170,135 175,120 C165,128 140,125 115,110 C85,92 60,65 50,40 C48,32 48,25 55,22 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "avocado",
    name: "Avocado",
    category: "food-drink",
    tags: ["avocado", "fruit", "green", "healthy"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M100,5 C80,5 65,15 60,35 C45,55 40,85 45,105 C50,130 75,145 100,145 C125,145 150,130 155,105 C160,85 155,55 140,35 C135,15 120,5 100,5 Z M100,70 m-12,0 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "beer-mug",
    name: "Beer Mug",
    category: "food-drink",
    tags: ["beer", "mug", "drink", "bar"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.88,
    svgPath:
      "M50,15 C70,5 100,5 120,10 C140,15 145,25 145,30 L160,30 C170,30 175,40 175,50 C175,70 170,80 160,80 L145,80 L145,130 C145,138 140,145 130,145 L65,145 C55,145 50,138 50,130 Z M155,40 L155,70 L162,70 C165,70 168,65 168,55 C168,45 165,40 162,40 Z M70,30 C75,25 95,25 115,28 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "burger",
    name: "Burger",
    category: "food-drink",
    tags: ["burger", "food", "fast food", "lunch"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.85,
    svgPath:
      "M30,25 C30,15 55,5 100,5 C145,5 170,15 170,25 L170,35 L30,35 Z M25,45 L175,45 L175,55 L25,55 Z M20,65 L180,65 L180,75 L20,75 Z M25,85 L175,85 L175,95 L25,95 Z M30,105 L170,105 C170,125 150,145 100,145 C50,145 30,125 30,105 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "donut",
    name: "Donut",
    category: "food-drink",
    tags: ["donut", "dessert", "sweet", "round"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M100,10 C55,10 20,40 20,75 C20,110 55,140 100,140 C145,140 180,110 180,75 C180,40 145,10 100,10 Z M100,50 C125,50 140,62 140,75 C140,88 125,100 100,100 C75,100 60,88 60,75 C60,62 75,50 100,50 Z",
    recommendedTypes: ["EAN-8", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },

  // ─── People & Culture (Extended) ──────────────────────────────────────────
  {
    id: "dancer",
    name: "Dancer",
    category: "people-culture",
    tags: ["dancer", "dance", "movement", "art"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.92,
    svgPath:
      "M100,5 C93,5 88,10 88,17 C88,24 93,29 100,29 C107,29 112,24 112,17 C112,10 107,5 100,5 Z M95,32 L95,55 L50,50 L45,62 L85,75 L80,110 L35,140 L45,148 L90,120 L95,150 L105,150 L110,120 L155,148 L165,140 L120,110 L115,75 L155,62 L150,50 L105,55 L105,32 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "peace-hand",
    name: "Peace Hand",
    category: "people-culture",
    tags: ["peace", "hand", "victory", "symbol"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.95,
    svgPath:
      "M75,10 L75,75 L70,75 L65,65 L60,60 L55,60 L50,70 L50,85 L55,120 L65,140 L90,148 L135,148 L155,125 L160,95 L160,55 L155,50 L145,50 L140,55 L140,80 L130,80 L130,30 L125,25 L115,25 L110,30 L110,80 L100,80 L100,15 L95,10 L85,10 L85,80 L75,80 Z",
    recommendedTypes: ["CODE-128", "EAN-8"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "skull",
    name: "Skull",
    category: "people-culture",
    tags: ["skull", "skeleton", "halloween", "edgy"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.95,
    svgPath:
      "M100,5 C60,5 30,35 30,75 L30,95 C30,105 35,115 45,120 L50,130 L50,145 L75,145 L75,135 L85,135 L85,145 L115,145 L115,135 L125,135 L125,145 L150,145 L150,130 L155,120 C165,115 170,105 170,95 L170,75 C170,35 140,5 100,5 Z M75,65 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 Z M125,65 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 Z M90,95 L100,110 L110,95 Z",
    recommendedTypes: ["CODE-128", "EAN-13"],
    isCustom: false,
    isPremium: false,
  },

  // ─── Architecture (Extended) ──────────────────────────────────────────────
  {
    id: "castle",
    name: "Castle",
    category: "architecture",
    tags: ["castle", "fortress", "medieval", "fantasy"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M20,145 L20,60 L30,60 L30,50 L45,50 L45,60 L60,60 L60,40 L75,40 L75,30 L90,30 L90,40 L105,40 L110,25 L115,40 L125,40 L125,30 L140,30 L140,40 L155,40 L155,60 L170,60 L170,50 L185,50 L185,60 L195,60 L195,145 Z M85,145 L85,100 L115,100 L115,145 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "pyramid",
    name: "Pyramid",
    category: "architecture",
    tags: ["pyramid", "egypt", "triangle", "ancient"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.95,
    svgPath:
      "M100,10 L10,145 L190,145 Z M100,10 L100,145 Z",
    recommendedTypes: ["EAN-13", "CODE-128", "EAN-8"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "windmill",
    name: "Windmill",
    category: "architecture",
    tags: ["windmill", "dutch", "country", "power"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.92,
    svgPath:
      "M100,35 L70,145 L130,145 Z M100,35 L170,20 L160,45 L105,45 Z M100,35 L180,100 L155,105 L103,50 Z M100,35 L125,130 L95,130 L97,45 Z M100,35 L20,50 L30,75 L97,52 Z M95,90 L105,90 L105,145 L95,145 Z",
    recommendedTypes: ["CODE-128", "EAN-13"],
    isCustom: false,
    isPremium: false,
  },

  // ─── Transport (Extended) ─────────────────────────────────────────────────
  {
    id: "train",
    name: "Train",
    category: "transport",
    tags: ["train", "railway", "transport", "locomotive"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.8,
    svgPath:
      "M25,40 L25,110 L45,110 L45,40 L55,40 L55,20 L180,20 L180,110 L25,110 Z M70,50 L100,50 L100,80 L70,80 Z M110,50 L140,50 L140,80 L110,80 Z M150,50 L170,50 L170,80 L150,80 Z M40,110 C40,115 45,120 50,120 C55,120 60,115 60,110 Z M120,110 C120,115 125,120 130,120 C135,120 140,115 140,110 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "hot-air-balloon",
    name: "Hot Air Balloon",
    category: "transport",
    tags: ["balloon", "air", "float", "travel"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.95,
    svgPath:
      "M100,5 C60,5 35,35 35,70 C35,90 45,105 60,115 L70,115 L80,145 L120,145 L130,115 L140,115 C155,105 165,90 165,70 C165,35 140,5 100,5 Z M70,115 L80,125 L120,125 L130,115 Z",
    recommendedTypes: ["CODE-128", "EAN-8"],
    isCustom: false,
    isPremium: false,
  },

  // ─── Tech & Objects (Extended) ────────────────────────────────────────────
  {
    id: "lightbulb",
    name: "Lightbulb",
    category: "tech-objects",
    tags: ["lightbulb", "idea", "innovation", "bright"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.95,
    svgPath:
      "M100,10 C70,10 50,35 50,60 C50,80 60,95 70,105 L70,125 L130,125 L130,105 C140,95 150,80 150,60 C150,35 130,10 100,10 Z M75,130 L125,130 L125,140 L75,140 Z M85,143 L115,143 L115,148 L85,148 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "key",
    name: "Key",
    category: "tech-objects",
    tags: ["key", "lock", "security", "access"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.9,
    svgPath:
      "M55,75 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0 Z M55,75 m-12,0 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0 Z M85,75 L180,75 L180,90 L170,90 L170,105 L155,105 L155,90 L140,90 L140,110 L125,110 L125,90 L85,90 Z",
    recommendedTypes: ["CODE-128", "EAN-13"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "gear",
    name: "Gear",
    category: "tech-objects",
    tags: ["gear", "cog", "mechanical", "settings"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.95,
    svgPath:
      "M100,10 L110,25 L125,22 L130,38 L145,42 L143,58 L156,68 L148,82 L156,96 L143,106 L145,122 L130,126 L125,142 L110,139 L100,154 L90,139 L75,142 L70,126 L55,122 L57,106 L44,96 L52,82 L44,68 L57,58 L55,42 L70,38 L75,22 L90,25 Z M100,55 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0 Z",
    recommendedTypes: ["CODE-128", "EAN-13"],
    isCustom: false,
    isPremium: false,
  },

  // ─── Abstract (Extended) ──────────────────────────────────────────────────
  {
    id: "infinity",
    name: "Infinity",
    category: "abstract",
    tags: ["infinity", "loop", "forever", "endless"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.8,
    svgPath:
      "M50,75 C50,50 70,40 85,55 C95,65 105,85 115,95 C130,110 150,100 150,75 C150,50 130,40 115,55 C105,65 95,85 85,95 C70,110 50,100 50,75 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
  {
    id: "yin-yang",
    name: "Yin Yang",
    category: "abstract",
    tags: ["yinyang", "balance", "zen", "harmony"],
    viewBox: "0 0 200 150",
    artZoneRatio: 0.95,
    svgPath:
      "M100,5 C60,5 30,37 30,75 C30,113 60,145 100,145 C138,145 170,113 170,75 C170,37 138,5 100,5 Z M100,5 C80,5 65,20 65,40 C65,60 80,75 100,75 C120,75 135,90 135,110 C135,130 120,145 100,145 C60,145 30,113 30,75 C30,37 60,5 100,5 Z M100,32 m-6,0 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0 Z",
    recommendedTypes: ["EAN-13", "CODE-128"],
    isCustom: false,
    isPremium: false,
  },
];

// Shape lookup by ID — O(1) access
const SHAPE_MAP = new Map(SHAPES.map((s) => [s.id, s]));

export function getShapeById(id: string): Shape | undefined {
  return SHAPE_MAP.get(id);
}

export function getShapesByCategory(
  category: Shape["category"]
): Shape[] {
  return SHAPES.filter((s) => s.category === category);
}

export function searchShapes(query: string): Shape[] {
  const q = query.toLowerCase();
  return SHAPES.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.tags.some((t) => t.includes(q)) ||
      s.category.includes(q)
  );
}
