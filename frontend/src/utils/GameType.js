export default class GameType {
  validNames = ["kanji", "hiragana", "katakana"];
  constructor(name) {
    if (validNames.includes(name)) {
      this.name = name;
    } else {
      throw new Error("Invalid game type name");
    }
  }
}
