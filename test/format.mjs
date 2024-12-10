import fs from 'fs'


// Constants
// const allowedChars = "фываолдж"
const charsList = [
  "ао",
  "вл ао",
  "ыд влао",
  "фж ыдвлао",
  "прэ фжыдвлао",
  "фывапролджэ",

  "кг фывапролджэ",
  "уш фывапролджэкг",
  "цщ фывапролджэкгуш",
  "йз фывапролджэкгушцщ",
  "ёхъ фывапролджэкгушцщйз",
  "ёйцукенгшщзхъ фывапролджэ",

]
const special = {
  2: {
    typeLen: 100
  }
}
const lessonNumbers = [
  "1.1",
  "1.2",
  "1.3",
  "1.4",
  "1.5",
  "1.6",
  "2.1"
]


async function main() {

  // Get googleTrans.csv
  const googleTrans = (await fs.promises.readFile('googleTrans.csv', 'utf8')).toString()
  const googleTransMap = new Map()
  for (const line of googleTrans.split('\n')) {
    const [russian, english] = line.split(',')
    googleTransMap.set(russian, english)
  }


  // Remove everything in ../src/lib/data/lessons
  const dir = '../src/lib/data/lessons'
  const lessonVar = []
  const files = await fs.promises.readdir(dir)
  for (const file of files) {
    await fs.promises.unlink(`${dir}/${file}`)
  }

  let lessonNumber = 1
  for (const cl of charsList) {
    const [newChars, oldChars] = cl.split(' ')
    const acceptableChars = newChars.concat(oldChars)
    const title = `Lesson ${lessonNumber}: ${newChars.toUpperCase()}`

    // Get list
    const file = await fs.promises.readFile('10000.json', 'utf8')
    const data = JSON.parse(file)

    // For every col1, find the words
    const wordsSet = new Set()
    const wordsInfo = []
    for (const { col1, col2, col3 } of data) {
      const regex = /[а-яА-ЯёЁ]+/g
      const words = col1.match(regex)
      if (words) {
        for (const word of words) {
          let valid = true;
          let hasOnePlusNewChar = false
          for (const char of word) {
            if (!acceptableChars.includes(char)) {
              valid = false
              break
            }
            if (newChars.includes(char)) {
              hasOnePlusNewChar = true
            }
          }
          if (!wordsSet.has(word) && valid && hasOnePlusNewChar && word.length > 1) {
            wordsSet.add(word)
            wordsInfo.push({
              word,
              def: col2,
              ex: col3,
              gt: googleTransMap.get(word)
            })
          }
        }
      }
    }


    // Write to file
    const format = {
      title,
      alphabet: newChars,
      words: wordsInfo
    }
    if (special[lessonNumber]) {
      Object.assign(format, special[lessonNumber])
    }
    lessonVar.push({
      lesson: `lesson${lessonNumber}`,
      title
    })
    await fs.promises.writeFile(`../src/lib/data/lessons/lesson${lessonNumber}.json`, JSON.stringify(format, null, 2))
    console.log(`Added ${wordsSet.size} words. Sample: ${wordsInfo.slice(0, 5).map(w => w.word).join(', ')}`)

    lessonNumber++
  }

  console.log('Finished formatting')
  console.log(lessonVar)

}

main()
