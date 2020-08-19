
import fs from 'fs'
import path from 'path'
import superagent from "superagent";

import Analyzer from './analyzer'

class Crawler {
  private secret = "x3b174jsx";
  // private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;
  private url = 'http://ybtcn.cn'
  private filePath = path.resolve(__dirname, "../data/course.json");

  getRawHtml = async () => {
    const result = await superagent.get(this.url);
    console.log(result)
    return result.text;
  };

  writeJsonContent = (fileContent: string) => {
    fs.writeFileSync(this.filePath, JSON.stringify(fileContent));
  };

  crawler = async () => {
    const html = await this.getRawHtml();
    const jsonContent = await this.analyzer.analyze(html, this.filePath)
    this.writeJsonContent(jsonContent);
  };

  constructor(private analyzer: any) {
    this.crawler();
  }
}

const analyzer = new Analyzer()
const crawler = new Crawler(analyzer);
