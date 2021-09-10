import fs from "fs";
import Progress from "progress";
import UserFactory from "./user-factory";
import configs from "./assets/configs.json";
import xlsx from "xlsx";
import path from "path";
const main = async () => {
  const total: { [key: string]: number } = {};
  const bar = new Progress(" generating [:bar] :rate/bps :percent :etas", {
    total: configs.totalRecord,
    width: 80,
  });
  const listId = [];
  let i = 0;
  let result = [];
  for (let i = 0; i < configs.totalRecord; ) {
    try {
      const user = new UserFactory();
      const { gender, id, name, phoneNumber, phoneTelecom } = user.toObject();
      if (listId.includes(id)) {
        continue;
      }
      bar.tick();
      i++;
      listId.push(id);
      if (!phoneNumber || !gender) console.log(``, user.toObject());
      total[phoneTelecom] = !total[phoneTelecom] ? 1 : total[phoneTelecom] + 1;
      total[gender] = !total[gender] ? 1 : total[gender] + 1;
      result.push({
        n: i,
        id,
        name,
        gender,
        phoneNumber,
        phoneTelecom,
      });
    } catch (err) {
      err && console.error(err);
    }
  }
  console.table([total]);
  if (configs.exportType.includes("json")) {
    fs.writeFileSync("./output/data.json", JSON.stringify(result, null, 2), {
      encoding: "utf8",
    });
    console.log("json:", path.join(process.cwd(), "./output/data.json"));
  }
  if (configs.exportType.some((v) => ["xlsx", "csv"].includes(v))) {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(result, {
      header: Object.keys(result[0]),
    });
    if (configs.exportType.includes("csv")) {
      const csvOutput: string = xlsx.utils.sheet_to_csv(ws);
      fs.writeFileSync("./output/data.csv", csvOutput, { encoding: "utf-8" });
      console.log("csv:", path.join(process.cwd(), "./output/data.json"));

    }
    if (!configs.exportType.includes("xlsx")) return;
    ws["!cols"] = [{ wch: 5 }, { wch: 15 }, { wch: 30 }, { wch: 10 }, { wch: 12 }, { wch: 12 }];
    xlsx.utils.book_append_sheet(wb, ws, "Profiles");

    xlsx.writeFile(wb, "./output/data.xlsx");
    console.log("xlsx:", path.join(process.cwd(), "./output/data.xlsx"));
  }
};

main();
