import cheerio from 'cheerio'
import fs from 'fs'
import { Analyze } from './crawler'

export interface Course {
	id: string
	title: string
	img: string
	alt: string
}

interface CourseResult {
	date: number
	data: Course[]
}

interface Content {
	[propName: number]: Course[]
}

export default class Analyzer implements Analyze {
	private static instance: Analyzer

	static getInstance() {
		if (!Analyzer.instance) {
			Analyzer.instance = new Analyzer()
		}
		return Analyzer.instance
	}

	// 拿到www.dell-lee.com中的我们需要的数据
	private getCourseInfo = (html: string) => {
		const $ = cheerio.load(html)
		const courseItems = $('.thumbnail')
		const courseInfos: Course[] = []
		courseItems.map((index, element) => {
			const img = $(element).find('img')[0].attribs.src
			const alt = $(element).find('img')[0].attribs.alt
			const a = $(element).find('a')
			const title = a.eq(1).text()
			const id = a.eq(1)[0].attribs.href.split('/')[1]
			courseInfos.push({
				id,
				img,
				alt,
				title,
			})
		})

		return courseInfos
	}

	// 转化为我们需要的数据结构
	private generateJsonContent = (courseInfo: Course[], filePath: string) => {
		let fileContent: Course[] = []
		let exitedIds: string[] = []
		if (fs.existsSync(filePath)) {
			fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
		}

    // 有的就不要了
		fileContent.map(child => {
			exitedIds.push(child.id)
    })
    console.log(exitedIds)
		courseInfo.map(item => {
			if (!exitedIds.includes(item.id)) {
				fileContent.push(item)
			}
		})

		return fileContent
	}

	public analyze = (html: string, filePath: string) => {
		const courseInfo = this.getCourseInfo(html)
		const jsonContent = this.generateJsonContent(courseInfo, filePath)
		return JSON.stringify(jsonContent)
	}

	// 单例模式 不能被外部实例化
	private constructor() {}
}
