// 优化：现在该文件只管爬虫和存储文件，分析逻辑移到了analyzer.js里面
import fs from 'fs'
import path from 'path'
import superagent from 'superagent'

import Analyzer from './analyzer'

export interface Analyze {
	analyze: (html: string, filePath: string) => string
}

class Crawler {
	private filePath = path.resolve(__dirname, '../data/luo.json')

	// 获取dom
	private getRawHtml = async () => {
		const result = await superagent.get(this.url)
		return result.text
	}

	// 写入文件
	private writeJsonContent = (fileContent: string) => {
		fs.writeFileSync(this.filePath, fileContent)
	}

	private crawler = async () => {
		const html = await this.getRawHtml()
		const jsonContent = await this.analyzer.analyze(html, this.filePath)
		this.writeJsonContent(jsonContent)
	}

	constructor(private url: string, private analyzer: Analyze) {
		this.crawler()
	}
}

const start = (url: string) => {
	const analyzer = Analyzer.getInstance()

	const crawler = new Crawler(url, analyzer)
}

start(`https://www.luoow.com`)
start(`https://www.luoow.com/1_100.html`)
start(`https://www.luoow.com/101_200.html`)
start(`https://www.luoow.com/201_300.html`)
start(`https://www.luoow.com/301_400.html`)
start(`https://www.luoow.com/401_500.html`)
start(`https://www.luoow.com/501_600.html`)
start(`https://www.luoow.com/601_700.html`)
start(`https://www.luoow.com/701_800.html`)
start(`https://www.luoow.com/801_900.html`)
