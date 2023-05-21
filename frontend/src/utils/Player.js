export default class Player {
  constructor(name) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.score = 0;
  }
}
