export type FloriographyEntry = {
  meaning: string;
  nickname: string;
};

const DEFAULT: FloriographyEntry = { meaning: "beauty, wonder", nickname: "Found Beauty" };

// Keyed by lowercase common name (exact or partial)
const BY_COMMON: Record<string, FloriographyEntry> = {
  // ── Roses & classics ────────────────────────────────────────────
  "rose":                   { meaning: "love, passion, beauty",                          nickname: "Heart's Bloom" },
  "red rose":               { meaning: "deep love, desire, courage",                     nickname: "Scarlet Promise" },
  "white rose":             { meaning: "purity, innocence, silence",                     nickname: "Pure Heart" },
  "yellow rose":            { meaning: "friendship, joy, jealousy",                      nickname: "Bright Companion" },
  "pink rose":              { meaning: "grace, admiration, sweetness",                   nickname: "Gentle Blush" },
  "camellia":               { meaning: "admiration, perfection, longing",                nickname: "Quiet Grace" },
  "red camellia":           { meaning: "you are a flame in my heart",                    nickname: "Hidden Fire" },
  "peony":                  { meaning: "prosperity, romance, compassion",                nickname: "Full Heart" },

  // ── Spring bulbs ─────────────────────────────────────────────────
  "tulip":                  { meaning: "perfect love, declaration of feeling",           nickname: "Spring's Promise" },
  "red tulip":              { meaning: "declaration of love",                            nickname: "Bold Confession" },
  "yellow tulip":           { meaning: "sunshine, cheerful thoughts",                   nickname: "Bright Thought" },
  "white tulip":            { meaning: "forgiveness, worthiness",                       nickname: "Clean Slate" },
  "daffodil":               { meaning: "new beginnings, hope, unrequited love",         nickname: "First Light" },
  "narcissus":              { meaning: "vanity, self-love, new beginnings",              nickname: "Mirror Bloom" },
  "crocus":                 { meaning: "youthful joy, cheerfulness, foresight",         nickname: "Early Riser" },
  "hyacinth":               { meaning: "constancy, sincerity, sport",                   nickname: "Blue Bell" },
  "blue hyacinth":          { meaning: "constancy, sincerity",                          nickname: "True Blue" },
  "purple hyacinth":        { meaning: "sorrow, please forgive me",                     nickname: "Soft Apology" },
  "snowdrop":               { meaning: "hope, consolation, new beginnings",             nickname: "First Hope" },
  "lily of the valley":     { meaning: "return of happiness, purity, humility",         nickname: "Little Bell" },
  "bluebell":               { meaning: "gratitude, everlasting love, humility",         nickname: "Nodding Grace" },
  "allium":                 { meaning: "good fortune, prosperity, unity",               nickname: "Globe Trotter" },

  // ── Wildflowers & meadow ─────────────────────────────────────────
  "daisy":                  { meaning: "innocence, purity, loyal love",                 nickname: "Little Sunshine" },
  "ox-eye daisy":           { meaning: "patience, innocent love",                       nickname: "Patient Heart" },
  "oxeye daisy":            { meaning: "patience, innocent love",                       nickname: "Patient Heart" },
  "poppy":                  { meaning: "consolation, rest, forgetfulness",              nickname: "Dream Keeper" },
  "california poppy":       { meaning: "rest, consolation, fleeting beauty",            nickname: "Golden Hour" },
  "cornflower":             { meaning: "delicacy, hope, anticipation",                  nickname: "Blue Hour" },
  "bachelor's button":      { meaning: "celibacy, blessings, hope",                    nickname: "Blue Hour" },
  "buttercup":              { meaning: "cheerfulness, childlikeness, ingratitude",      nickname: "Bright Button" },
  "creeping buttercup":     { meaning: "cheerfulness, ingratitude",                    nickname: "Bright Button" },
  "clover":                 { meaning: "good fortune, industry, promise",               nickname: "Lucky Patch" },
  "dandelion":              { meaning: "faithfulness, happiness, wishes",               nickname: "Wish-Maker" },
  "foxglove":               { meaning: "stateliness, insincerity, magic",              nickname: "Witch's Thimble" },
  "forget-me-not":          { meaning: "remembrance, true love, constancy",            nickname: "Little Blue Reminder" },
  "forget me not":          { meaning: "remembrance, true love, constancy",            nickname: "Little Blue Reminder" },
  "primrose":               { meaning: "young love, I can't live without you",         nickname: "First Feeling" },
  "cowslip":                { meaning: "grace, pensiveness, winning grace",             nickname: "Country Bell" },
  "violet":                 { meaning: "faithfulness, humility, modesty",              nickname: "Shy Gem" },
  "pansy":                  { meaning: "loving thoughts, freethinking",                nickname: "Deep Thought" },
  "wild rose":              { meaning: "simplicity, beauty, pleasure in the moment",   nickname: "Free Bloom" },
  "bindweed":               { meaning: "humility, night",                              nickname: "Gentle Twiner" },

  // ── Aromatics & herbs ────────────────────────────────────────────
  "lavender":               { meaning: "devotion, serenity, distrust",                 nickname: "Purple Peace" },
  "jasmine":                { meaning: "amiability, grace, attachment",                nickname: "Night Perfume" },
  "star jasmine":           { meaning: "grace, attachment, sweet love",                nickname: "Night Perfume" },
  "geranium":               { meaning: "preference, comfort, gentility",               nickname: "Sweet Comfort" },
  "rose geranium":          { meaning: "preference, comfort",                          nickname: "Sweet Comfort" },
  "sweet-scented geranium": { meaning: "preference, comfort, gentility",               nickname: "Sweet Comfort" },
  "pelargonium":            { meaning: "preference, comfort, gentility",               nickname: "Sweet Comfort" },
  "rosemary":               { meaning: "remembrance, fidelity, love",                  nickname: "Memory Keeper" },
  "mint":                   { meaning: "virtue, warmth of feeling",                    nickname: "Cool Virtue" },
  "thyme":                  { meaning: "courage, strength, activity",                  nickname: "Brave Sprig" },
  "sage":                   { meaning: "wisdom, long life, domestic virtue",           nickname: "Silver Wisdom" },
  "chamomile":              { meaning: "patience in adversity, energy in hardship",    nickname: "Calm One" },
  "honeysuckle":            { meaning: "devoted love, bonds of love, happiness",       nickname: "Sweet Bond" },

  // ── Trees & shrubs ───────────────────────────────────────────────
  "magnolia":               { meaning: "dignity, nobility, love of nature",            nickname: "Ancient Glory" },
  "wisteria":               { meaning: "steadfast love, longing, romance",             nickname: "Purple Dream" },
  "lilac":                  { meaning: "first love, youthful innocence, memory",       nickname: "First Crush" },
  "azalea":                 { meaning: "temperance, passion, take care of yourself",   nickname: "Soft Fire" },
  "rhododendron":           { meaning: "caution, beware, danger",                      nickname: "Warning Bell" },
  "bougainvillea":          { meaning: "passion, welcome, freedom",                    nickname: "Paper Bloom" },
  "jacaranda":              { meaning: "wisdom, good luck, rebirth",                   nickname: "Wish Tree" },
  "cherry blossom":         { meaning: "transience of life, beauty, love",             nickname: "Gone Too Soon" },
  "plum blossom":           { meaning: "perseverance, hope, beauty in adversity",      nickname: "Winter's Hope" },

  // ── Summer & garden blooms ───────────────────────────────────────
  "sunflower":              { meaning: "adoration, loyalty, longevity",                nickname: "Sun Chaser" },
  "hydrangea":              { meaning: "heartfelt emotion, gratitude, understanding",  nickname: "Mrs. Weatherglass" },
  "marigold":               { meaning: "grief, jealousy, creative fire",               nickname: "Sun's Sorrow" },
  "zinnia":                 { meaning: "lasting affection, friendship, constancy",     nickname: "True Friend" },
  "aster":                  { meaning: "patience, elegance, daintiness",               nickname: "Star Petal" },
  "cosmos":                 { meaning: "harmony, tranquility, innocence",              nickname: "Quiet Universe" },
  "dahlia":                 { meaning: "dignity, elegance, commitment",                nickname: "Bold Beauty" },
  "chrysanthemum":          { meaning: "loyalty, longevity, joy",                      nickname: "Autumn Gold" },
  "mum":                    { meaning: "loyalty, longevity, joy",                      nickname: "Autumn Gold" },
  "begonia":                { meaning: "caution, fanciful nature, gratitude",          nickname: "Careful Heart" },
  "cineraria":              { meaning: "joyfulness, always bright, delight",           nickname: "Little Ray" },
  "impatiens":              { meaning: "impatience, ardent love",                      nickname: "Quick Flame" },
  "snapdragon":             { meaning: "graciousness, strength, presumption",          nickname: "Dragon's Breath" },
  "sweet pea":              { meaning: "blissful pleasure, departure, goodbye",        nickname: "Farewell Curl" },
  "carnation":              { meaning: "love, fascination, distinction",               nickname: "Layered Heart" },
  "red carnation":          { meaning: "admiration, deep love",                        nickname: "Red Devotion" },
  "pink carnation":         { meaning: "gratitude, mother's undying love",             nickname: "Tender Thanks" },
  "white carnation":        { meaning: "pure love, good luck",                         nickname: "Clean Feeling" },
  "yellow carnation":       { meaning: "rejection, disappointment",                    nickname: "Bitter Bloom" },
  "stock":                  { meaning: "lasting beauty, bonds of affection",           nickname: "Forever Fragrant" },

  // ── Water & shade ────────────────────────────────────────────────
  "lotus":                  { meaning: "purity, enlightenment, self-regeneration",     nickname: "Rising Light" },
  "water lily":             { meaning: "purity, elegance, chastity",                   nickname: "Still Mirror" },
  "white water-lily":       { meaning: "purity, elegance, chastity",                   nickname: "Still Mirror" },
  "iris":                   { meaning: "faith, hope, wisdom, courage",                 nickname: "Rainbow's Edge" },
  "german iris":            { meaning: "faith, wisdom, courage",                       nickname: "Rainbow's Edge" },
  "calla lily":             { meaning: "magnificent beauty, purity",                   nickname: "Trumpet Beauty" },

  // ── Exotic & tropical ────────────────────────────────────────────
  "orchid":                 { meaning: "rare beauty, refinement, love",                nickname: "Exotic Heart" },
  "hibiscus":               { meaning: "delicate beauty, fleeting love, joy",          nickname: "One-Day Wonder" },
  "bird of paradise":       { meaning: "joyfulness, paradise, magnificence",           nickname: "Sky Bloom" },
  "plumeria":               { meaning: "positivity, new beginnings, protection",       nickname: "Island Spirit" },
  "frangipani":             { meaning: "positivity, new beginnings, protection",       nickname: "Island Spirit" },
  "anthurium":              { meaning: "hospitality, happiness, abundance",            nickname: "Wax Heart" },

  // ── Climbers & vines ─────────────────────────────────────────────
  "clematis":               { meaning: "mental beauty, ingenuity, artifice",           nickname: "Clever Vine" },
  "morning glory":          { meaning: "affectation, love in vain, departure",        nickname: "Early Dreamer" },

  // ── Unusual & neighbourhood finds ────────────────────────────────
  "cheddar pink":           { meaning: "pure love, boldness, lively spirit",          nickname: "Cliffside Heart" },
  "dianthus":               { meaning: "pure love, boldness, lively spirit",          nickname: "Cliffside Heart" },
};

// Keyed by lowercase genus (first word of latin name)
const BY_GENUS: Record<string, FloriographyEntry> = {
  "rosa":            BY_COMMON["rose"],
  "tulipa":          BY_COMMON["tulip"],
  "narcissus":       BY_COMMON["narcissus"],
  "hyacinthus":      BY_COMMON["hyacinth"],
  "galanthus":       BY_COMMON["snowdrop"],
  "convallaria":     BY_COMMON["lily of the valley"],
  "hyacinthoides":   BY_COMMON["bluebell"],
  "bellis":          BY_COMMON["daisy"],
  "leucanthemum":    BY_COMMON["ox-eye daisy"],
  "eschscholzia":    BY_COMMON["california poppy"],
  "papaver":         BY_COMMON["poppy"],
  "centaurea":       BY_COMMON["cornflower"],
  "ranunculus":      BY_COMMON["buttercup"],
  "trifolium":       BY_COMMON["clover"],
  "taraxacum":       BY_COMMON["dandelion"],
  "digitalis":       BY_COMMON["foxglove"],
  "myosotis":        BY_COMMON["forget-me-not"],
  "primula":         BY_COMMON["primrose"],
  "viola":           BY_COMMON["violet"],
  "lavandula":       BY_COMMON["lavender"],
  "jasminum":        BY_COMMON["jasmine"],
  "trachelospermum": BY_COMMON["star jasmine"],
  "pelargonium":     BY_COMMON["geranium"],
  "salvia":          BY_COMMON["sage"],
  "matricaria":      BY_COMMON["chamomile"],
  "lonicera":        BY_COMMON["honeysuckle"],
  "magnolia":        BY_COMMON["magnolia"],
  "wisteria":        BY_COMMON["wisteria"],
  "syringa":         BY_COMMON["lilac"],
  "rhododendron":    BY_COMMON["azalea"],
  "azalea":          BY_COMMON["azalea"],
  "bougainvillea":   BY_COMMON["bougainvillea"],
  "jacaranda":       BY_COMMON["jacaranda"],
  "prunus":          BY_COMMON["cherry blossom"],
  "helianthus":      BY_COMMON["sunflower"],
  "hydrangea":       BY_COMMON["hydrangea"],
  "tagetes":         BY_COMMON["marigold"],
  "zinnia":          BY_COMMON["zinnia"],
  "symphyotrichum":  BY_COMMON["aster"],
  "cosmos":          BY_COMMON["cosmos"],
  "dahlia":          BY_COMMON["dahlia"],
  "chrysanthemum":   BY_COMMON["chrysanthemum"],
  "dendranthema":    BY_COMMON["chrysanthemum"],
  "begonia":         BY_COMMON["begonia"],
  "antirrhinum":     BY_COMMON["snapdragon"],
  "lathyrus":        BY_COMMON["sweet pea"],
  "dianthus":        BY_COMMON["carnation"],
  "nelumbo":         BY_COMMON["lotus"],
  "nymphaea":        BY_COMMON["water lily"],
  "iris":            BY_COMMON["iris"],
  "zantedeschia":    BY_COMMON["calla lily"],
  "orchidaceae":     BY_COMMON["orchid"],
  "phalaenopsis":    BY_COMMON["orchid"],
  "dendrobium":      BY_COMMON["orchid"],
  "hibiscus":        BY_COMMON["hibiscus"],
  "strelitzia":      BY_COMMON["bird of paradise"],
  "plumeria":        BY_COMMON["plumeria"],
  "anthurium":       BY_COMMON["anthurium"],
  "clematis":        BY_COMMON["clematis"],
  "ipomoea":         BY_COMMON["morning glory"],
  "paeonia":         BY_COMMON["peony"],
  "camellia":        BY_COMMON["camellia"],
};

export function lookupFloriography(commonName: string, latinName = ""): FloriographyEntry {
  const common = commonName.toLowerCase().trim();
  const genus = latinName.toLowerCase().split(" ")[0].trim();

  // 1. Exact match on full common name
  if (BY_COMMON[common]) return BY_COMMON[common];

  // 2. Exact genus match
  if (genus && BY_GENUS[genus]) return BY_GENUS[genus];

  // 3. Common name contains a dictionary key (longest key wins to avoid "rose" matching "rosemary")
  const keys = Object.keys(BY_COMMON).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (common.includes(key)) return BY_COMMON[key];
  }

  // 4. A dictionary key contains the common name
  for (const key of keys) {
    if (key.includes(common)) return BY_COMMON[key];
  }

  return DEFAULT;
}
