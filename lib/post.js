import path from "path"// パス（住所）を操作するための道具(オブジェクト)
import fs from "fs"// ファイルシステム（ファイル操作）の道具
import matter from "gray-matter"
import {remark} from "remark"
import html from "remark-html"
// process.cwd() は Macの pwd と同じく「今いる場所」を返す
const postsDirectory = path.join(process.cwd(), "posts")


//mdファイルのデータを取り出す
export function getPostsDate() {
  // 2. 指定したフォルダ（postsDirectory）の中にあるファイル名をすべて取得
  // fs.readdirSync は、フォルダの中身を「文字列の配列」として返してくれる
  // 例: ["ssg-ssr.md", "react-next.md"]
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "") //ファイル名(id)

    //マークダウンファイルを文字列として読み取る
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, "utf8")

    const matterResult = matter(fileContents)

    //idとデータを返す
    return {
      id,
      ...matterResult.data,
    }
  })
  return allPostsData
}

//getStaticPathでreturnで使うpathを取得する
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, "")
      }
    }
  })
}

//idに基づいてブログ投稿データを返す
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContent = fs.readFileSync(fullPath, "utf8")

  const matterResult = matter(fileContent)

  const blogContent = await remark()
  .use(html)
  .process(matterResult.content)

  const blogContentHTML = blogContent.toString()
  return {
    id,
    blogContentHTML,
    ...matterResult.data,
  }
}