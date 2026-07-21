const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "great", "between", "need", "large", "often", "hand", "high", "place", "hold",
  "free", "real", "life", "few", "north", "open", "seem", "together", "next",
  "white", "children", "begin", "got", "walk", "example", "ease", "paper", "group",
  "always", "music", "those", "both", "mark", "book", "letter", "until", "mile",
  "river", "car", "feet", "care", "second", "enough", "plain", "girl", "usual",
  "young", "ready", "above", "ever", "red", "list", "though", "feel", "talk",
  "bird", "soon", "body", "dog", "family", "direct", "pose", "leave", "song",
  "measure", "door", "product", "black", "short", "number", "class", "wind",
  "question", "happen", "complete", "ship", "area", "half", "rock", "order",
  "fire", "south", "problem", "piece", "told", "knew", "pass", "since", "top",
  "whole", "king", "space", "heard", "best", "hour", "better", "true", "during",
  "hundred", "five", "remember", "step", "early", "strong", "hold", "west",
  "ground", "interest", "reach", "fast", "verb", "sing", "listen", "six",
  "table", "travel", "less", "morning", "ten", "simple", "several", "vowel",
  "toward", "war", "lay", "against", "pattern", "slow", "center", "love",
  "person", "money", "serve", "appear", "road", "map", "rain", "rule",
  "govern", "pull", "cold", "notice", "voice", "energy", "hunt", "probable",
  "bed", "brother", "egg", "ride", "cell", "believe", "perhaps", "pick",
  "sudden", "count", "reason", "square", "exact", "develop", "eat", "force",
  "blue", "object", "decide", "surface", "deep", "moon", "island", "foot",
  "system", "busy", "test", "record", "boat", "common", "gold", "possible",
  "plane", "age", "dry", "wonder", "laugh", "thousand", "ago", "ran",
  "check", "game", "shape", "yes", "hot", "miss", "brought", "heat",
  "snow", "tire", "fill", "east", "paint", "language", "among", "unit",
  "power", "town", "fine", "fly", "fall", "lead", "cry", "dark", "machine",
  "note", "wait", "plan", "figure", "star", "box", "noun", "field", "rest",
  "correct", "able", "pound", "done", "beauty", "drive", "stood", "contain",
  "front", "teach", "week", "final", "gave", "green", "oh", "quick",
  "ocean", "warm", "turn", "matter", "mind", "cloud", "earth", "garden",
  "hard", "run", "round", "light", "voice", "wood", "main", "must",
];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateText(wordCount: number): string {
  const words: string[] = [];
  while (words.length < wordCount) {
    const shuffled = shuffle(commonWords);
    words.push(...shuffled);
  }
  return words.slice(0, wordCount).join(" ");
}

export function generateTextForTime(seconds: number): string {
  const estimatedWpm = 80;
  const wordCount = Math.ceil((estimatedWpm / 60) * seconds * 1.5);
  return generateText(wordCount);
}
