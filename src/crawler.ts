// 优化：现在该文件只管爬虫和存储文件，分析逻辑移到了analyzer.js里面
import fs from 'fs'
import path from 'path'
import superagent from "superagent";

import Analyzer from './analyzer'

export interface Analyze {
  analyze: (html: string, filePath: string) => string
}

class Crawler {
  // private secret = "x3b174jsx";
  // private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;
  // private url = 'http://ybtcn.cn'
  private filePath = path.resolve(__dirname, "../data/course.json");

  // 获取dom
  private getRawHtml = async () => {
    const result = await superagent.get(this.url);
    return result.text;
  };

  // 写入文件
  private writeJsonContent = (fileContent: string) => {
    fs.writeFileSync(this.filePath, fileContent);
  };

  private crawler = async () => {
    const html = await this.getRawHtml();
    const jsonContent = await this.analyzer.analyze(html, this.filePath);
    this.writeJsonContent(jsonContent);
  };

  constructor(private url: string, private analyzer: Analyze) {
    this.crawler();
  }
}

const secret = "x3b174jsx";
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
// const analyzer = new Analyzer()
const analyzer = Analyzer.getInstance();

const crawler = new Crawler(url, analyzer);
