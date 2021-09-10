import firstNames = require("./assets/firstnames.json");
import middleNames = require("./assets/middlenames.json");
import lastNames = require("./assets/lastnames.json");

export type NameType = "firstNames" | "middleNames" | "lastNames";
export type Gender = "male" | "female";

export default {
  firstNames,
  middleNames,
  lastNames,
};
