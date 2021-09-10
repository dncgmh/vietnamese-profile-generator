import _ from "lodash";
import names, { Gender, NameType } from "./names";
import telecoms from "./assets/telecoms.json";
import configs from "./assets/configs.json";

export default class UserFactory {
  private names: string[];
  private id: number[];
  private middleLetter: number;
  private gender: Gender;
  private phoneNumber: string;
  private phoneTelecom: string;
  constructor() {
    this.getFullName();
    this.getPhoneNumber();
  }
  private generateName = (type: NameType) => {
    if (type === "lastNames") {
      const total = getTotal(names[type]);
      const number = getRndInteger({ max: total });
      const distributedNames = getDistributedNames(names[type]);
      const name = distributedNames.find((name) => name[1] >= number);
      this.names = [name[0]];
      this.id = [name[1]];
      return;
    }
    if (type === "middleNames") {
      const total = getTotal(names["middleNames"][this.gender]);
      for (let i = 0; i < this.middleLetter; i++) {
        const number = getRndInteger({ max: total });
        let distributedNames = getDistributedNames(names["middleNames"][this.gender]).filter(
          (name) => !this.id.includes(name[1]),
        );
        this.middleLetter > 1 &&
          (distributedNames = distributedNames.filter(
            (name) => !names.middleNames.specificName[this.gender][i].includes(name[0]),
          ));
        const name = distributedNames.find((name) => name[1] >= number);
        this.names.push(name[0]);
        this.id.push(name[1]);
      }
      return;
    }
    if (type === "firstNames") {
      const total = getTotal(names["firstNames"][this.gender]);
      const number = getRndInteger({ max: total });
      const distributedNames = getDistributedNames(names["firstNames"][this.gender]).filter(
        (name) => !this.id.includes(name[1]),
      );
      const last_name = distributedNames.find((name) => name[1] >= number);
      this.names.push(last_name[0]);
      this.id.push(last_name[1]);
    }
  };
  private getFullName = (gender?: Gender) => {
    this.gender = gender || Math.random() < (configs.maleRatio || 0.5) ? "male" : "female";
    this.middleLetter = Math.random() < configs.middleNameWithTwoLettersRatio ? 2 : 1;
    [(this.generateName("lastNames"), this.generateName("middleNames"), this.generateName("firstNames"))];
    return this;
  };
  private getPhoneNumber() {
    const number = getRndInteger({ max: totalPhoneCode - 1 });
    const phoneCode = listPhoneCode[number];
    this.phoneTelecom = mapTelecom[phoneCode];
    this.phoneNumber = "0" + phoneCode + randomString({ string: "0123456789", length: 6 });
    return this;
  }
  toObject() {
    return {
      id: +this.id.join(""),
      name: this.names.join(" "),
      gender: this.gender,
      phoneNumber: this.phoneNumber,
      phoneTelecom: this.phoneTelecom,
    };
  }
}

type Names = { [key: string]: number };

const getTotal = (names: Names) =>
  Object.values(names)
    .slice(0, -1)
    .reduce((prev, curt) => prev + curt * 10, 0);

const randomString = ({ length, string }: { string: string; length: number }) => {
  let temp: string = "";
  while (length-- >= 0) {
    const number = getRndInteger({ max: string.length - 1 });
    temp += string[number];
  }
  return temp;
};

const listPhoneCode = _.flattenDeep(
  Object.values(telecoms).map((tele) => [].concat(...Array(tele.rate).fill(tele.list))),
);
const totalPhoneCode = listPhoneCode.length;

const getDistributedNames = (names: Names) => {
  const arrayName = _.toPairs(names);
  let tempTotal: number = 0;
  const distributedNames: [string, number][] = arrayName.map((name) => {
    tempTotal += name[1] * 10;
    return [name[0], tempTotal];
  });
  // const invertName = _(distributeName).fromPairs().value();
  const sortedNames = distributedNames.sort((a, b) => a[1] - b[1]);
  return sortedNames;
};
const getRndInteger = ({ min = 0, max }: { min?: number; max: number }) =>
  Math.round(Math.random() * (max - min)) + min;

const listTelecom = Object.entries(telecoms).map((tele) => tele[1].list.map((tl) => ({ [tl]: tele[0] })));
const mapTelecom = _.flattenDeep(listTelecom).reduce(
  (prev, curt) => ({ ...prev, ...curt }),
  {} as { [key: string]: string },
);
