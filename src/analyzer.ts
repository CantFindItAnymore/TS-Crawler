import cheerio from "cheerio";
import fs from "fs";
import { Analyze } from "./crawler";

interface Course {
  title: string;
  count: number;
}

interface CourseResult {
  date: number;
  data: Course[];
}

interface Content {
  [propName: number]: Course[]
}

export default class Analyzer implements Analyze {

  private static instance: Analyzer

  static getInstance() {
    if(!Analyzer.instance) {
      Analyzer.instance = new Analyzer()
    }
    return Analyzer.instance
  }


  // 拿到www.dell-lee.com中的我们需要的数据
  private getCourseInfo = (html: string) => {
    const $ = cheerio.load(html);
    const courseItems = $(".course-item");
    const courseInfos: Course[] = [];
    courseItems.map((index, element) => {
      const desc = $(element).find(".course-desc");
      const title = desc.eq(0).text();
      const count = parseInt(desc.eq(1).text().split("：")[1], 10);
      courseInfos.push({
        title,
        count,
      });
    });
    const result = {
      date: new Date().getTime(),
      data: courseInfos,
    };
    return result;
  };

  // 转化为我们需要的数据结构
  private generateJsonContent = (courseInfo: CourseResult, filePath: string) => {
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    fileContent[courseInfo.date] = courseInfo.data;
    return fileContent;
  };

  public analyze = (html: string, filePath: string) => {
    const courseInfo = this.getCourseInfo(html)
    const jsonContent = this.generateJsonContent(courseInfo, filePath);
    return JSON.stringify(jsonContent)
  };

  // 单例模式 不能被外部实例化
  private constructor() {}
}