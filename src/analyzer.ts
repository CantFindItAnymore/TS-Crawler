import cheerio from "cheerio";
import fs from "fs";

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

export default class Analyzer {
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

  private generateJsonContent = (courseInfo: CourseResult, filePath: string) => {
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    fileContent[courseInfo.date] = courseInfo.data;
    return fileContent;
  };

  public analyze = async (html: string, filePath: string) => {
    const courseInfo = await this.getCourseInfo(html)
    const jsonContent = await this.generateJsonContent(courseInfo, filePath);
    return jsonContent
  };
}