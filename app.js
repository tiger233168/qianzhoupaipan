const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const zodiac = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
const palaceNames = ["命宫", "兄弟", "夫妻", "子女", "财帛", "疾厄", "迁移", "交友", "事业", "田宅", "福德", "父母"];
const gridSlots = [3, 7, 11, 15, 14, 13, 12, 8, 4, 0, 1, 2];
const hourLabels = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const trigramNames = {
  "111": "乾", "110": "兑", "101": "离", "100": "震",
  "011": "巽", "010": "坎", "001": "艮", "000": "坤"
};
const trigramImages = {
  "乾": "天", "兑": "泽", "离": "火", "震": "雷",
  "巽": "风", "坎": "水", "艮": "山", "坤": "地"
};
const hexagramTable = {
  "乾乾": "乾为天", "乾兑": "天泽履", "乾离": "天火同人", "乾震": "天雷无妄", "乾巽": "天风姤", "乾坎": "天水讼", "乾艮": "天山遁", "乾坤": "天地否",
  "兑乾": "泽天夬", "兑兑": "兑为泽", "兑离": "泽火革", "兑震": "泽雷随", "兑巽": "泽风大过", "兑坎": "泽水困", "兑艮": "泽山咸", "兑坤": "泽地萃",
  "离乾": "火天大有", "离兑": "火泽睽", "离离": "离为火", "离震": "火雷噬嗑", "离巽": "火风鼎", "离坎": "火水未济", "离艮": "火山旅", "离坤": "火地晋",
  "震乾": "雷天大壮", "震兑": "雷泽归妹", "震离": "雷火丰", "震震": "震为雷", "震巽": "雷风恒", "震坎": "雷水解", "震艮": "雷山小过", "震坤": "雷地豫",
  "巽乾": "风天小畜", "巽兑": "风泽中孚", "巽离": "风火家人", "巽震": "风雷益", "巽巽": "巽为风", "巽坎": "风水涣", "巽艮": "风山渐", "巽坤": "风地观",
  "坎乾": "水天需", "坎兑": "水泽节", "坎离": "水火既济", "坎震": "水雷屯", "坎巽": "水风井", "坎坎": "坎为水", "坎艮": "水山蹇", "坎坤": "水地比",
  "艮乾": "山天大畜", "艮兑": "山泽损", "艮离": "山火贲", "艮震": "山雷颐", "艮巽": "山风蛊", "艮坎": "山水蒙", "艮艮": "艮为山", "艮坤": "山地剥",
  "坤乾": "地天泰", "坤兑": "地泽临", "坤离": "地火明夷", "坤震": "地雷复", "坤巽": "地风升", "坤坎": "地水师", "坤艮": "地山谦", "坤坤": "坤为地"
};
const hexagramHints = {
  "乾": "刚健进取，宜定主心骨，主动开局。",
  "坤": "厚载顺承，宜稳守资源，顺势而成。",
  "坎": "险中求通，先避锋芒，再寻可行之路。",
  "离": "明察附丽，重在看清关系与边界。",
  "震": "动而有惊，事情将起变化，宜快而不乱。",
  "巽": "入而渐进，以柔入局，细节最要紧。",
  "艮": "止而后定，先暂停判断，守住底线。",
  "兑": "悦而有言，沟通、承诺、口舌需谨慎。"
};
const DB_NAME = "qianzhou-chart-db";
const DB_STORE = "charts";
const DB_VERSION = 1;

let currentChartState = null;
let selectedBranchIndex = null;
let isSyncingDate = false;

const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
  0x0d520
];

const fourTransformations = {
  "甲": ["廉贞化禄", "破军化权", "武曲化科", "太阳化忌"],
  "乙": ["天机化禄", "天梁化权", "紫微化科", "太阴化忌"],
  "丙": ["天同化禄", "天机化权", "文昌化科", "廉贞化忌"],
  "丁": ["太阴化禄", "天同化权", "天机化科", "巨门化忌"],
  "戊": ["贪狼化禄", "太阴化权", "右弼化科", "天机化忌"],
  "己": ["武曲化禄", "贪狼化权", "天梁化科", "文曲化忌"],
  "庚": ["太阳化禄", "武曲化权", "太阴化科", "天同化忌"],
  "辛": ["巨门化禄", "太阳化权", "文曲化科", "文昌化忌"],
  "壬": ["天梁化禄", "紫微化权", "左辅化科", "武曲化忌"],
  "癸": ["破军化禄", "巨门化权", "太阴化科", "贪狼化忌"]
};

const naYinElement = {
  "甲子": "金", "乙丑": "金", "丙寅": "火", "丁卯": "火", "戊辰": "木", "己巳": "木",
  "庚午": "土", "辛未": "土", "壬申": "金", "癸酉": "金", "甲戌": "火", "乙亥": "火",
  "丙子": "水", "丁丑": "水", "戊寅": "土", "己卯": "土", "庚辰": "金", "辛巳": "金",
  "壬午": "木", "癸未": "木", "甲申": "水", "乙酉": "水", "丙戌": "土", "丁亥": "土",
  "戊子": "火", "己丑": "火", "庚寅": "木", "辛卯": "木", "壬辰": "水", "癸巳": "水",
  "甲午": "金", "乙未": "金", "丙申": "火", "丁酉": "火", "戊戌": "木", "己亥": "木",
  "庚子": "土", "辛丑": "土", "壬寅": "金", "癸卯": "金", "甲辰": "火", "乙巳": "火",
  "丙午": "水", "丁未": "水", "戊申": "土", "己酉": "土", "庚戌": "金", "辛亥": "金",
  "壬子": "木", "癸丑": "木", "甲寅": "水", "乙卯": "水", "丙辰": "土", "丁巳": "土",
  "戊午": "火", "己未": "火", "庚申": "木", "辛酉": "木", "壬戌": "水", "癸亥": "水"
};

const bureauMap = {
  "水": "水二局",
  "木": "木三局",
  "金": "金四局",
  "土": "土五局",
  "火": "火六局"
};

const majorStarOffsets = [
  ["紫微", 0], ["天机", -1], ["太阳", -3], ["武曲", -4], ["天同", -5], ["廉贞", -8],
  ["天府", 0], ["太阴", 1], ["贪狼", 2], ["巨门", 3], ["天相", 4], ["天梁", 5], ["七杀", 6], ["破军", 10]
];
const changSheng = ["长生", "沐浴", "冠带", "临官", "帝旺", "衰", "病", "死", "墓", "绝", "胎", "养"];
const doctorStars = ["博士", "力士", "青龙", "小耗", "将军", "奏书", "飞廉", "喜神", "病符", "大耗", "伏兵", "官符"];
const yearGods = ["岁建", "晦气", "丧门", "贯索", "官符", "小耗", "大耗", "龙德", "白虎", "天德", "吊客", "病符"];

const stemElements = {
  "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土",
  "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水"
};

const elementCycle = ["木", "火", "土", "金", "水"];
const branchMainStem = {
  "子": "癸", "丑": "己", "寅": "甲", "卯": "乙", "辰": "戊", "巳": "丙",
  "午": "丁", "未": "己", "申": "庚", "酉": "辛", "戌": "戊", "亥": "壬"
};

const branchHiddenStems = {
  "子": [["主气", "癸"]],
  "丑": [["主气", "己"], ["中气", "癸"], ["余气", "辛"]],
  "寅": [["主气", "甲"], ["中气", "丙"], ["余气", "戊"]],
  "卯": [["主气", "乙"]],
  "辰": [["主气", "戊"], ["中气", "乙"], ["余气", "癸"]],
  "巳": [["主气", "丙"], ["中气", "戊"], ["余气", "庚"]],
  "午": [["主气", "丁"], ["中气", "己"]],
  "未": [["主气", "己"], ["中气", "丁"], ["余气", "乙"]],
  "申": [["主气", "庚"], ["中气", "壬"], ["余气", "戊"]],
  "酉": [["主气", "辛"]],
  "戌": [["主气", "戊"], ["中气", "辛"], ["余气", "丁"]],
  "亥": [["主气", "壬"], ["中气", "甲"]]
};

const noblemanMap = {
  "甲": ["丑", "未"], "戊": ["丑", "未"], "庚": ["丑", "未"],
  "乙": ["子", "申"], "己": ["子", "申"],
  "丙": ["亥", "酉"], "丁": ["亥", "酉"],
  "壬": ["卯", "巳"], "癸": ["卯", "巳"],
  "辛": ["寅", "午"]
};

const wenChangMap = {
  "甲": "巳", "乙": "午", "丙": "申", "丁": "酉", "戊": "申",
  "己": "酉", "庚": "亥", "辛": "子", "壬": "寅", "癸": "卯"
};

function leapMonth(year) {
  return lunarInfo[year - 1900] & 0xf;
}

function leapDays(year) {
  if (!leapMonth(year)) return 0;
  return (lunarInfo[year - 1900] & 0x10000) ? 30 : 29;
}

function monthDays(year, month) {
  return (lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

function lunarYearDays(year) {
  let total = 348;
  for (let mask = 0x8000; mask > 0x8; mask >>= 1) {
    total += (lunarInfo[year - 1900] & mask) ? 1 : 0;
  }
  return total + leapDays(year);
}

function solarToLunar(date) {
  const base = new Date(1900, 0, 31);
  let offset = Math.floor((date - base) / 86400000);
  let year = 1900;
  let daysOfYear = 0;

  while (year < 2101 && offset > 0) {
    daysOfYear = lunarYearDays(year);
    if (offset < daysOfYear) break;
    offset -= daysOfYear;
    year += 1;
  }

  const leap = leapMonth(year);
  let isLeap = false;
  let month = 1;
  let daysOfMonth = 0;

  while (month <= 12 && offset >= 0) {
    if (leap > 0 && month === leap + 1 && !isLeap) {
      month -= 1;
      isLeap = true;
      daysOfMonth = leapDays(year);
    } else {
      daysOfMonth = monthDays(year, month);
    }

    if (offset < daysOfMonth) break;
    offset -= daysOfMonth;

    if (isLeap && month === leap) {
      isLeap = false;
    }
    month += 1;
  }

  return { year, month, day: offset + 1, isLeap };
}

function lunarToSolar(year, month, day, isLeap) {
  const base = new Date(1900, 0, 31);
  let offset = 0;

  for (let y = 1900; y < year; y += 1) {
    offset += lunarYearDays(y);
  }

  const leap = leapMonth(year);
  for (let m = 1; m < month; m += 1) {
    offset += monthDays(year, m);
    if (leap === m) {
      offset += leapDays(year);
    }
  }

  if (isLeap && leap === month) {
    offset += monthDays(year, month);
  }

  offset += day - 1;
  return new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset);
}

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentSolarDate() {
  const mode = document.getElementById("dateMode").value;
  if (mode === "lunar") {
    const year = Number(document.getElementById("lunarYear").value);
    const month = Number(document.getElementById("lunarMonth").value);
    const day = Number(document.getElementById("lunarDay").value);
    const isLeap = document.getElementById("lunarLeap").checked;
    return lunarToSolar(year, month, day, isLeap);
  }
  const dateValue = document.getElementById("date").value;
  return dateValue ? new Date(`${dateValue}T00:00:00`) : null;
}

function syncDateFields(source) {
  if (isSyncingDate) return;
  isSyncingDate = true;

  const solarInput = document.getElementById("date");
  const dateMode = document.getElementById("dateMode").value;

  if (source === "solar" || dateMode === "solar") {
    const date = solarInput.value ? new Date(`${solarInput.value}T00:00:00`) : new Date();
    const lunar = solarToLunar(date);
    document.getElementById("lunarYear").value = String(lunar.year);
    populateLunarMonths(lunar.year, lunar.month);
    document.getElementById("lunarMonth").value = String(lunar.month);
    populateLunarDays(lunar.year, lunar.month, lunar.day, lunar.isLeap);
    document.getElementById("lunarDay").value = String(lunar.day);
    document.getElementById("lunarLeap").checked = lunar.isLeap;
  } else {
    const date = getCurrentSolarDate();
    if (date) {
      solarInput.value = formatDateInput(date);
    }
  }

  updateConversionText();
  isSyncingDate = false;
}

function updateConversionText() {
  const dateValue = document.getElementById("date").value;
  if (!dateValue) return;
  const date = new Date(`${dateValue}T00:00:00`);
  const lunar = solarToLunar(date);
  document.getElementById("conversionText").textContent =
    `阳历 ${formatDateInput(date)} ｜ 农历 ${lunar.year}年${lunar.isLeap ? "闰" : ""}${lunar.month}月${lunar.day}日`;
}

function updateDateModeVisibility() {
  const lunarMode = document.getElementById("dateMode").value === "lunar";
  document.getElementById("solarDateField").hidden = lunarMode;
  document.getElementById("date").disabled = lunarMode;
  ["lunarYearField", "lunarMonthField", "lunarDayField", "lunarLeapField"].forEach(id => {
    document.getElementById(id).hidden = !lunarMode;
  });
  ["lunarYear", "lunarMonth", "lunarDay", "lunarLeap"].forEach(id => {
    document.getElementById(id).disabled = !lunarMode;
  });
}

function populateLunarYears() {
  const yearSelect = document.getElementById("lunarYear");
  yearSelect.innerHTML = "";
  for (let year = 1900; year <= 2100; year += 1) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = `${year}年`;
    yearSelect.appendChild(option);
  }
}

function populateLunarMonths(year, selectedMonth = 1) {
  const monthSelect = document.getElementById("lunarMonth");
  monthSelect.innerHTML = "";
  for (let month = 1; month <= 12; month += 1) {
    const option = document.createElement("option");
    option.value = String(month);
    option.textContent = `${month}月`;
    monthSelect.appendChild(option);
  }
  monthSelect.value = String(selectedMonth);
}

function populateLunarDays(year, month, selectedDay = 1, isLeap = false) {
  const daySelect = document.getElementById("lunarDay");
  const maxDay = isLeap ? leapDays(year) || monthDays(year, month) : monthDays(year, month);
  daySelect.innerHTML = "";
  for (let day = 1; day <= maxDay; day += 1) {
    const option = document.createElement("option");
    option.value = String(day);
    option.textContent = `${day}日`;
    daySelect.appendChild(option);
  }
  daySelect.value = String(Math.min(selectedDay, maxDay));
}

function cyclical(num) {
  return stems[num % 10] + branches[num % 12];
}

function getTenGod(dayStem, targetStem) {
  if (!dayStem || !targetStem) return "";
  const dayElement = stemElements[dayStem];
  const targetElement = stemElements[targetStem];
  const samePolarity = stems.indexOf(dayStem) % 2 === stems.indexOf(targetStem) % 2;
  const dayIndex = elementCycle.indexOf(dayElement);
  const targetIndex = elementCycle.indexOf(targetElement);

  if (dayElement === targetElement) return samePolarity ? "比肩" : "劫财";
  if ((dayIndex + 1) % 5 === targetIndex) return samePolarity ? "食神" : "伤官";
  if ((dayIndex + 2) % 5 === targetIndex) return samePolarity ? "偏财" : "正财";
  if ((targetIndex + 1) % 5 === dayIndex) return samePolarity ? "偏印" : "正印";
  if ((targetIndex + 2) % 5 === dayIndex) return samePolarity ? "七杀" : "正官";
  return "";
}

function getBranchGroup(branch) {
  if (["申", "子", "辰"].includes(branch)) return { peach: "酉", horse: "寅", canopy: "辰" };
  if (["寅", "午", "戌"].includes(branch)) return { peach: "卯", horse: "申", canopy: "戌" };
  if (["巳", "酉", "丑"].includes(branch)) return { peach: "午", horse: "亥", canopy: "丑" };
  return { peach: "子", horse: "巳", canopy: "未" };
}

function getShenSha(pillars) {
  const dayStem = pillars.dayPillar[0];
  const dayBranch = pillars.dayPillar[1];
  const yearBranch = pillars.yearPillar[1];
  const branchesInChart = [
    pillars.yearPillar[1],
    pillars.monthPillar[1],
    pillars.dayPillar[1],
    pillars.hourPillar[1]
  ];
  const group = getBranchGroup(dayBranch);
  const shenSha = [];

  if (branchesInChart.includes(group.peach)) shenSha.push(`桃花在${group.peach}`);
  if (branchesInChart.includes(group.horse)) shenSha.push(`驿马在${group.horse}`);
  if (branchesInChart.includes(group.canopy)) shenSha.push(`华盖在${group.canopy}`);

  const nobleBranches = noblemanMap[dayStem] || [];
  nobleBranches.forEach(branch => {
    if (branchesInChart.includes(branch)) shenSha.push(`天乙贵人${branch}`);
  });

  const wenChang = wenChangMap[dayStem];
  if (branchesInChart.includes(wenChang)) shenSha.push(`文昌${wenChang}`);

  const yearGroup = getBranchGroup(yearBranch);
  if (branchesInChart.includes(yearGroup.horse)) shenSha.push(`年驿马${yearGroup.horse}`);

  return [...new Set(shenSha)].slice(0, 8);
}

function trigramFromLines(lines) {
  return trigramNames[lines.map(line => line.yang ? "1" : "0").join("")] || "坤";
}

function castHexagram() {
  const lines = Array.from({ length: 6 }, () => {
    const value = 6 + Math.floor(Math.random() * 4);
    return { value, yang: value % 2 === 1, moving: value === 6 || value === 9 };
  });
  const lower = trigramFromLines(lines.slice(0, 3));
  const upper = trigramFromLines(lines.slice(3, 6));
  const name = hexagramTable[`${upper}${lower}`] || `${trigramImages[upper]}${trigramImages[lower]}卦`;
  const moving = lines
    .map((line, index) => line.moving ? `初二三四五上`[index] || `${index + 1}` : "")
    .filter(Boolean);

  document.getElementById("hexagramLines").innerHTML = lines.slice().reverse().map(line =>
    `<div class="hex-line ${line.yang ? "yang" : "yin"} ${line.moving ? "moving" : ""}"></div>`
  ).join("");
  document.getElementById("hexagramName").textContent = name;
  document.getElementById("hexagramMeta").textContent =
    `上${upper}${trigramImages[upper]} 下${lower}${trigramImages[lower]}｜${moving.length ? `动爻：${moving.join("、")}` : "静卦"}`;
  document.getElementById("hexagramText").textContent =
    `${hexagramHints[upper]} ${hexagramHints[lower]} ${moving.length ? "有动爻，说明局势正在转折，宜先抓变化点。" : "静卦重在守中，宜按既有节奏推进。"}`;
}

function getBaziRows(pillars) {
  const dayStem = pillars.dayPillar[0];
  return [
    ["年柱", pillars.yearPillar],
    ["月柱", pillars.monthPillar],
    ["日柱", pillars.dayPillar],
    ["时柱", pillars.hourPillar]
  ].map(([label, pillar]) => {
    const stem = pillar[0];
    const branch = pillar[1];
    const hidden = (branchHiddenStems[branch] || []).map(([name, hiddenStem]) => ({
      name,
      stem: hiddenStem,
      tenGod: getTenGod(dayStem, hiddenStem)
    }));
    return {
      label,
      stem,
      branch,
      tenGod: label === "日柱" ? "日主" : getTenGod(dayStem, stem),
      hidden
    };
  });
}

function getPillarTenGods(dayStem, pillar) {
  const stem = pillar[0];
  const branch = pillar[1];
  const hidden = branchMainStem[branch];
  return {
    stemGod: getTenGod(dayStem, stem),
    branchGod: getTenGod(dayStem, hidden)
  };
}

function normalizeCycleIndex(stemIndex, branchIndex) {
  let safeStem = (stemIndex + 1000) % 10;
  let safeBranch = (branchIndex + 1200) % 12;
  while (safeStem % 2 !== safeBranch % 2) {
    safeStem = (safeStem + 1) % 10;
  }
  return { stemIndex: safeStem, branchIndex: safeBranch };
}

function pillarFromIndexes(stemIndex, branchIndex) {
  const normalized = normalizeCycleIndex(stemIndex, branchIndex);
  return stems[normalized.stemIndex] + branches[normalized.branchIndex];
}

function getLuckStartAge(lunar, hourIndex) {
  return Math.max(1, ((lunar.month * 2 + lunar.day + hourIndex) % 8) + 2);
}

function getFortuneCycles(pillars, chartData, lunar) {
  const dayStem = pillars.dayPillar[0];
  const monthStemIndex = stems.indexOf(pillars.monthPillar[0]);
  const monthBranchIndex = branches.indexOf(pillars.monthPillar[1]);
  const step = chartData.direction === "顺行" ? 1 : -1;
  const startAge = getLuckStartAge(lunar, branches.indexOf(pillars.hourPillar[1]));

  return Array.from({ length: 10 }, (_, index) => {
    const pillar = pillarFromIndexes(monthStemIndex + step * (index + 1), monthBranchIndex + step * (index + 1));
    const gods = getPillarTenGods(dayStem, pillar);
    const ageStart = startAge + index * 10;
    return {
      age: `${ageStart}~${ageStart + 9}`,
      year: `${lunar.year + ageStart}年`,
      pillar,
      stemGod: gods.stemGod,
      branchGod: gods.branchGod,
      current: false
    };
  });
}

function getAnnualCycles(pillars, baseYear) {
  const dayStem = pillars.dayPillar[0];
  const startYear = baseYear - 1;
  return Array.from({ length: 10 }, (_, index) => {
    const year = startYear + index;
    const pillar = cyclical(year - 4);
    const gods = getPillarTenGods(dayStem, pillar);
    return {
      year: `${year}年`,
      pillar,
      stemGod: gods.stemGod,
      branchGod: gods.branchGod,
      current: year === baseYear
    };
  });
}

function getMonthlyCycles(pillars, baseYear) {
  const dayStem = pillars.dayPillar[0];
  const yearStemIndex = stems.indexOf(cyclical(baseYear - 4)[0]);
  const firstMonthStem = ((yearStemIndex % 5) * 2 + 2) % 10;
  const monthNames = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];

  return monthNames.map((name, index) => {
    const pillar = stems[(firstMonthStem + index) % 10] + branches[(2 + index) % 12];
    const gods = getPillarTenGods(dayStem, pillar);
    return {
      month: name,
      pillar,
      stemGod: gods.stemGod,
      branchGod: gods.branchGod,
      current: index === new Date().getMonth()
    };
  });
}

function getPillars(date, hourIndex) {
  const year = date.getFullYear();
  const spring = new Date(year, 1, 4, 12);
  const gzYear = date < spring ? year - 1 : year;
  const yearPillar = cyclical(gzYear - 4);
  const monthPillar = cyclical((gzYear - 1900) * 12 + date.getMonth() + 12);
  const base = new Date(1900, 0, 1);
  const dayIndex = Math.floor((date - base) / 86400000);
  const dayPillar = cyclical(dayIndex + 40);
  const hourStemIndex = (stems.indexOf(dayPillar[0]) % 5 * 2 + hourIndex) % 10;
  const hourPillar = stems[hourStemIndex] + branches[hourIndex];
  return { yearPillar, monthPillar, dayPillar, hourPillar };
}

function getHourIndex(time) {
  const [h, m] = time.split(":").map(Number);
  const minutes = h * 60 + m;
  if (minutes >= 23 * 60 || minutes < 60) return 0;
  return Math.floor((minutes + 60) / 120) % 12;
}

function getPalaceStems(yearStem) {
  const startMap = { "甲": 2, "己": 2, "乙": 4, "庚": 4, "丙": 6, "辛": 6, "丁": 8, "壬": 8, "戊": 0, "癸": 0 };
  const yinStemIndex = startMap[yearStem];
  const result = [];
  for (let i = 0; i < 12; i += 1) {
    result[(2 + i) % 12] = stems[(yinStemIndex + i) % 10];
  }
  return result;
}

function palaceIndexFromMing(mingIndex, targetPalaceOrder) {
  return (mingIndex - targetPalaceOrder + 120) % 12;
}

function getBureau(mingIndex, palaceStems) {
  const key = palaceStems[mingIndex] + branches[mingIndex];
  const element = naYinElement[key] || "木";
  return { key, element, name: bureauMap[element] || "木三局" };
}

function getZiweiStart(day, bureauName) {
  const bureauNums = { "二": 2, "三": 3, "四": 4, "五": 5, "六": 6 };
  const bureauNum = bureauNums[bureauName.match(/[二三四五六]/)?.[0]] || 3;
  const seed = Math.ceil(day / bureauNum) + day + bureauNum;
  return (seed + 1) % 12;
}

function getStarBrightness(starName, branchIndex) {
  const sequence = ["庙", "旺", "得", "利", "平", "陷"];
  const base = Array.from(starName).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return sequence[(base + branchIndex * 2) % sequence.length];
}

function getSanFangSiZheng(branchIndex) {
  return [
    branchIndex,
    (branchIndex + 4) % 12,
    (branchIndex + 8) % 12,
    (branchIndex + 6) % 12
  ];
}

function getPalaceByBranch(chartData, branchIndex) {
  return chartData.palaces.find(palace => palace.branchIndex === branchIndex);
}

function buildChart({ lunar, pillars, hourIndex, gender }) {
  const monthBase = 2 + lunar.month - 1;
  const mingIndex = (monthBase - hourIndex + 120) % 12;
  const shenIndex = (monthBase + hourIndex) % 12;
  const palaceStems = getPalaceStems(pillars.yearPillar[0]);
  const bureau = getBureau(mingIndex, palaceStems);
  const ziweiIndex = getZiweiStart(lunar.day, bureau.name);
  const starsByBranch = Array.from({ length: 12 }, () => []);

  majorStarOffsets.forEach(([name, offset]) => {
    const branchIndex = (ziweiIndex + offset + 120) % 12;
    starsByBranch[branchIndex].push({ name, major: true, brightness: getStarBrightness(name, branchIndex) });
  });

  const helperStars = [
    ["左辅", (lunar.month + 3) % 12], ["右弼", (11 - lunar.month + 3) % 12],
    ["文昌", (10 - hourIndex + 12) % 12], ["文曲", (hourIndex + 4) % 12],
    ["禄存", stems.indexOf(pillars.yearPillar[0]) % 12],
    ["天马", [2, 11, 8, 5][branches.indexOf(pillars.yearPillar[1]) % 4]]
  ];
  helperStars.forEach(([name, index]) => {
    starsByBranch[index].push({ name, major: false, brightness: getStarBrightness(name, index) });
  });

  const palaces = [];
  for (let order = 0; order < 12; order += 1) {
    const branchIndex = palaceIndexFromMing(mingIndex, order);
    palaces.push({
      order,
      branchIndex,
      name: palaceNames[order],
      ganZhi: palaceStems[branchIndex] + branches[branchIndex],
      stars: starsByBranch[branchIndex],
      minorGods: [
        changSheng[(branchIndex + lunar.day) % 12],
        doctorStars[(order + stems.indexOf(pillars.yearPillar[0]) + 12) % 12],
        yearGods[(branchIndex - branches.indexOf(pillars.yearPillar[1]) + 12) % 12]
      ],
      badges: [
        branchIndex === mingIndex ? "命" : "",
        branchIndex === shenIndex ? "身" : "",
        order === 8 ? "官禄" : ""
      ].filter(Boolean)
    });
  }

  const direction = (gender === "male" && ["甲", "丙", "戊", "庚", "壬"].includes(pillars.yearPillar[0]))
    || (gender === "female" && ["乙", "丁", "己", "辛", "癸"].includes(pillars.yearPillar[0]))
    ? "顺行" : "逆行";

  return { mingIndex, shenIndex, bureau, palaces, direction };
}

function render(chartData, person) {
  const chart = document.getElementById("chart");
  chart.innerHTML = "";

  chartData.palaces.forEach((palace, i) => {
    const slot = gridSlots[i];
    const div = document.createElement("article");
    div.className = "palace";
    div.dataset.branchIndex = String(palace.branchIndex);
    div.dataset.palaceName = palace.name;
    div.style.gridColumn = `${(slot % 4) + 1}`;
    div.style.gridRow = `${Math.floor(slot / 4) + 1}`;
    div.innerHTML = `
      <div class="palace-head">
        <span class="palace-title">${palace.name}</span>
        <span>${palace.ganZhi}</span>
      </div>
      <div class="stars">
        ${palace.stars.length ? palace.stars.map(star => `
          <span class="star ${star.major ? "major" : ""}">
            <span>${star.name}</span>
            <span class="brightness brightness-${star.brightness}">${star.brightness}</span>
          </span>
        `).join("") : "<span class=\"star\"><span>平</span><span class=\"brightness brightness-平\">平</span></span>"}
      </div>
      <div class="palace-foot">
        ${palace.badges.map(badge => `<span class="badge">${badge}</span>`).join("")}
      </div>
      <div class="minor-row">
        ${palace.minorGods.map(item => `<span>${item}</span>`).join("")}
      </div>
    `;
    chart.appendChild(div);
  });

  document.getElementById("centerName").textContent = person.name || "未命名";
  document.getElementById("centerMeta").textContent = `${person.genderText}｜${chartData.direction}｜${person.place || "未填地点"}`;
  document.getElementById("baziGrid").innerHTML = person.baziRows.map(row => `
    <div class="pillar">
      <span class="pillar-label">${row.label}</span>
      <span class="ten-god">${row.tenGod}</span>
      <span class="pillar-chars"><span>${row.stem}</span><span>${row.branch}</span></span>
      <span class="hidden-stems">
        ${row.hidden.map(item => `<span>${item.tenGod}</span>`).join("")}
      </span>
    </div>
  `).join("");
  document.getElementById("flowYearText").textContent = person.flowYearPillar;
  document.getElementById("flowTransformText").textContent = person.flowTransformations.join("、");
  document.getElementById("shenShaText").innerHTML = person.shenSha.length
    ? person.shenSha.map(item => `<span class="mini-tag">${item}</span>`).join("")
    : "<span class=\"mini-tag\">未见常用神煞</span>";
  renderCycles("fortuneInline", person.fortuneCycles.slice(0, 5), "fortune");
  renderCycles("annualCycles", person.annualCycles, "annual");
  renderCycles("monthlyCycles", person.monthlyCycles, "monthly");
  applyRelationHighlights(chartData);
}

function renderCycles(id, cycles, type) {
  document.getElementById(id).innerHTML = cycles.map(item => `
    <div class="cycle-cell ${item.current ? "is-current" : ""} ${type === "fortune" ? "fortune-cell" : ""}">
      ${type !== "fortune" ? `<span class="${type === "monthly" ? "cycle-month" : "cycle-year"}">${item.month || item.year}</span>` : ""}
      <span class="cycle-god">${item.stemGod}</span>
      <span class="cycle-pillar">${item.pillar}</span>
      <span class="cycle-god">${item.branchGod}</span>
      ${item.age ? `<span class="cycle-age">${item.age}</span>` : ""}
      ${type === "fortune" ? `<span class="cycle-year">${item.year}</span>` : ""}
    </div>
  `).join("");
}

function applyRelationHighlights(chartData) {
  document.querySelectorAll(".palace").forEach(node => {
    node.classList.remove("is-selected", "is-related");
  });

  if (selectedBranchIndex === null) {
    document.getElementById("relationText").textContent = "点击任一宫位查看三方四正";
    return;
  }

  const related = getSanFangSiZheng(selectedBranchIndex);
  document.querySelectorAll(".palace").forEach(node => {
    const branchIndex = Number(node.dataset.branchIndex);
    if (branchIndex === selectedBranchIndex) {
      node.classList.add("is-selected");
    } else if (related.includes(branchIndex)) {
      node.classList.add("is-related");
    }
  });

  const names = related
    .map(branchIndex => getPalaceByBranch(chartData, branchIndex))
    .filter(Boolean)
    .map(palace => `${palace.name}${branches[palace.branchIndex]}`);
  document.getElementById("relationText").textContent = `三方四正：${names.join("、")}`;
}

function handlePalaceClick(event) {
  const palace = event.target.closest(".palace");
  if (!palace || !currentChartState) return;
  const branchIndex = Number(palace.dataset.branchIndex);
  selectedBranchIndex = selectedBranchIndex === branchIndex ? null : branchIndex;
  applyRelationHighlights(currentChartState.chartData);
}

function openChartDb() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("当前浏览器不支持本地数据库"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        const store = db.createObjectStore(DB_STORE, { keyPath: "id" });
        store.createIndex("lastOpenedAt", "lastOpenedAt");
        store.createIndex("nameInitial", "nameInitial");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function withStore(mode, callback) {
  return openChartDb().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, mode);
    const store = tx.objectStore(DB_STORE);
    const result = callback(store);
    tx.oncomplete = () => {
      db.close();
      resolve(result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  }));
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getNameInitial(name) {
  const trimmed = (name || "未命名").trim();
  const first = trimmed[0] || "#";
  if (/^[A-Za-z]$/.test(first)) return first.toUpperCase();
  if (/^[0-9]$/.test(first)) return "#";

  const bounds = ["阿", "八", "嚓", "咑", "妸", "发", "旮", "铪", "讥", "咔", "垃", "嘸", "拏", "噢", "妑", "七", "呥", "仨", "他", "屲", "夕", "丫", "帀"];
  const initials = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let index = bounds.length - 1; index >= 0; index -= 1) {
    if (first.localeCompare(bounds[index], "zh-Hans-u-co-pinyin") >= 0) {
      return initials[index] || "#";
    }
  }
  return "#";
}

async function saveCurrentChart() {
  const state = update();
  if (!state) return;

  const id = `${state.form.name || "未命名"}-${state.form.date}-${state.form.time}`.replace(/\s+/g, "");
  const now = Date.now();
  const record = {
    id,
    name: state.form.name || "未命名",
    nameInitial: getNameInitial(state.form.name),
    gender: state.form.gender,
    place: state.form.place,
    date: state.form.date,
    time: state.form.time,
    lunar: state.lunar,
    pillars: state.pillars,
    form: state.form,
    createdAt: now,
    lastOpenedAt: now
  };

  await withStore("readwrite", store => store.put(record));
  document.getElementById("dbStatus").textContent = `已保存：${record.name}`;
  await loadDatabaseList();
}

async function loadDatabaseList() {
  try {
    const records = await withStore("readonly", store => requestToPromise(store.getAll()));
    renderDatabaseList(records || []);
  } catch (error) {
    document.getElementById("dbList").innerHTML = `<div class="db-empty">${error.message}</div>`;
  }
}

function renderDatabaseList(records) {
  const list = document.getElementById("dbList");
  const sortMode = document.getElementById("dbSort").value;

  if (!records.length) {
    list.innerHTML = "<div class=\"db-empty\">还没有保存的命盘</div>";
    document.getElementById("dbStatus").textContent = "可保存 1000+ 命盘";
    return;
  }

  const sorted = [...records].sort((a, b) => {
    if (sortMode === "initial") {
      return `${a.nameInitial}${a.name}`.localeCompare(`${b.nameInitial}${b.name}`, "zh-Hans-u-co-pinyin");
    }
    return (b.lastOpenedAt || 0) - (a.lastOpenedAt || 0);
  });

  let currentGroup = "";
  list.innerHTML = sorted.map(record => {
    const group = sortMode === "initial" ? record.nameInitial || "#" : "";
    const groupMarkup = sortMode === "initial" && group !== currentGroup
      ? `<div class="db-group">${group}</div>`
      : "";
    currentGroup = group || currentGroup;
    return `
      ${groupMarkup}
      <div class="db-item" data-id="${record.id}">
        <button type="button" class="db-open">
          <span class="db-name">${record.name}</span>
          <span class="db-meta">${record.date} ${record.time}｜${record.place || "未填地点"}</span>
        </button>
        <button type="button" class="db-delete" aria-label="删除${record.name}">删</button>
      </div>
    `;
  }).join("");

  document.getElementById("dbStatus").textContent = `${records.length} 个命盘`;
}

async function openChartRecord(id) {
  const record = await withStore("readonly", store => requestToPromise(store.get(id)));
  if (!record) return;

  await withStore("readwrite", store => {
    record.lastOpenedAt = Date.now();
    store.put(record);
  });

  applyRecordToForm(record);
  update();
  await loadDatabaseList();
}

async function deleteChartRecord(id) {
  await withStore("readwrite", store => store.delete(id));
  await loadDatabaseList();
}

function applyRecordToForm(record) {
  const form = record.form || record;
  document.getElementById("name").value = form.name || record.name || "";
  document.getElementById("gender").value = form.gender || record.gender || "male";
  document.getElementById("dateMode").value = "solar";
  document.getElementById("date").value = form.date || record.date;
  document.getElementById("time").value = form.time || record.time || "08:30";
  document.getElementById("place").value = form.place || record.place || "";
  syncDateFields("solar");
}

function handleDatabaseClick(event) {
  const item = event.target.closest(".db-item");
  if (!item) return;
  const id = item.dataset.id;
  if (event.target.closest(".db-delete")) {
    deleteChartRecord(id);
    return;
  }
  openChartRecord(id);
}

function showLoadingThenUpdate() {
  const overlay = document.getElementById("loadingOverlay");
  overlay.classList.add("is-visible");
  overlay.setAttribute("aria-hidden", "false");
  window.setTimeout(() => {
    update();
    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");
  }, 720);
}

function update() {
  const name = document.getElementById("name").value.trim();
  const gender = document.getElementById("gender").value;
  const timeValue = document.getElementById("time").value;
  const place = document.getElementById("place").value.trim();
  const date = getCurrentSolarDate();

  if (!date || !timeValue) return null;

  const timedDate = new Date(`${formatDateInput(date)}T${timeValue}:00`);
  document.getElementById("date").value = formatDateInput(timedDate);
  const lunar = solarToLunar(timedDate);
  const hourIndex = getHourIndex(timeValue);
  const pillars = getPillars(timedDate, hourIndex);
  const chartData = buildChart({ lunar, pillars, hourIndex, gender });
  const currentYear = new Date().getFullYear();
  const flowYearPillar = cyclical(currentYear - 4);
  const flowTransformations = fourTransformations[flowYearPillar[0]] || [];
  const fortuneCycles = getFortuneCycles(pillars, chartData, lunar);
  const currentAge = currentYear - lunar.year + 1;
  fortuneCycles.forEach(item => {
    const [start, end] = item.age.split("~").map(Number);
    item.current = currentAge >= start && currentAge <= end;
  });

  document.getElementById("solarText").textContent = `${formatDateInput(timedDate)} ${timeValue}`;
  document.getElementById("lunarText").textContent = `${lunar.year}年${lunar.isLeap ? "闰" : ""}${lunar.month}月${lunar.day}日 ${hourLabels[hourIndex]}时`;
  document.getElementById("pillarsText").textContent = `${pillars.yearPillar} ${pillars.monthPillar} ${pillars.dayPillar} ${pillars.hourPillar}`;
  document.getElementById("bodyText").textContent = `命在${branches[chartData.mingIndex]}，身在${branches[chartData.shenIndex]}`;
  document.getElementById("bureauText").textContent = `${chartData.bureau.name}（${chartData.bureau.key}）`;

  const tags = fourTransformations[pillars.yearPillar[0]].map(item => `<span class="tag">${item}</span>`);
  tags.push(`<span class="tag">${zodiac[(lunar.year - 4) % 12]}年</span>`);
  document.getElementById("transformations").innerHTML = tags.join("");

  const person = {
    name,
    genderText: gender === "male" ? "男命" : "女命",
    place,
    baziRows: getBaziRows(pillars),
    flowYearPillar,
    flowTransformations,
    shenSha: getShenSha(pillars),
    fortuneCycles,
    annualCycles: getAnnualCycles(pillars, currentYear),
    monthlyCycles: getMonthlyCycles(pillars, currentYear)
  };

  currentChartState = {
    chartData,
    person,
    form: {
      name,
      gender,
      date: formatDateInput(timedDate),
      time: timeValue,
      place,
      dateMode: document.getElementById("dateMode").value,
      lunarYear: lunar.year,
      lunarMonth: lunar.month,
      lunarDay: lunar.day,
      lunarLeap: lunar.isLeap
    },
    lunar,
    pillars,
    updatedAt: Date.now()
  };

  render(chartData, person);
  updateConversionText();
  return currentChartState;
}

function setDefaultDate() {
  populateLunarYears();
  populateLunarMonths(1990, 1);
  populateLunarDays(1990, 1, 1);
  const dateInput = document.getElementById("date");
  if (!dateInput.value) {
    dateInput.value = "1990-05-18";
  }
  syncDateFields("solar");
  updateDateModeVisibility();
}

document.getElementById("birthForm").addEventListener("submit", event => {
  event.preventDefault();
  showLoadingThenUpdate();
});

document.getElementById("printBtn").addEventListener("click", () => window.print());
document.getElementById("saveChartBtn").addEventListener("click", saveCurrentChart);
document.getElementById("castHexagramBtn").addEventListener("click", castHexagram);
document.getElementById("dbSort").addEventListener("change", loadDatabaseList);
document.getElementById("dbList").addEventListener("click", handleDatabaseClick);
document.getElementById("chart").addEventListener("click", handlePalaceClick);

document.getElementById("dateMode").addEventListener("change", () => {
  updateDateModeVisibility();
  syncDateFields(document.getElementById("dateMode").value);
  update();
});

document.getElementById("date").addEventListener("change", () => {
  document.getElementById("dateMode").value = "solar";
  updateDateModeVisibility();
  syncDateFields("solar");
  update();
});

["lunarYear", "lunarMonth", "lunarDay", "lunarLeap"].forEach(id => {
  document.getElementById(id).addEventListener("change", () => {
    const year = Number(document.getElementById("lunarYear").value);
    const month = Number(document.getElementById("lunarMonth").value);
    const day = Number(document.getElementById("lunarDay").value);
    const isLeap = document.getElementById("lunarLeap").checked;
    document.getElementById("dateMode").value = "lunar";
    updateDateModeVisibility();
    if (id === "lunarYear") {
      populateLunarMonths(year, month);
    }
    if (id === "lunarYear" || id === "lunarMonth" || id === "lunarLeap") {
      populateLunarDays(year, month, day, isLeap);
    }
    syncDateFields("lunar");
    update();
  });
});

setDefaultDate();
update();
loadDatabaseList();
castHexagram();
