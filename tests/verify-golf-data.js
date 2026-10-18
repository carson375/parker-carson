const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'data', 'golf.json')

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`)
    process.exit(1)
  }
}

console.log('🔍 Running Golf Data Verification...')

assert(fs.existsSync(filePath), `golf.json must exist at ${filePath}`)

const content = fs.readFileSync(filePath, 'utf-8')
let data
try {
  data = JSON.parse(content)
} catch (err) {
  assert(false, `golf.json must be valid JSON: ${err.message}`)
}

assert(Array.isArray(data), 'golf.json top-level must be an array')
assert(data.length >= 2, 'golf.json must have at least 2 seasons')

const seasons = data.map(s => s.year)
assert(seasons.includes('2026'), 'golf.json must contain 2026 season')
assert(seasons.includes('2025'), 'golf.json must contain 2025 season')

let totalRounds = 0
let totalPhotos = 0
let totalBirdies = 0
let totalPars = 0
let min18 = Infinity
let min9 = Infinity

data.forEach(season => {
  assert(season.year, 'Season must have a year string')
  assert(Array.isArray(season.months), `Season ${season.year} must have months array`)

  season.months.forEach(month => {
    assert(month.month, `Month must have a name in season ${season.year}`)
    assert(typeof month.birdies === 'number', `Month ${month.month} must have birdies number`)
    assert(typeof month.girPercent === 'number', `Month ${month.month} must have girPercent number`)
    assert(typeof month.highlight === 'string' && month.highlight.length > 0, `Month ${month.month} must have a highlight`)
    assert(Array.isArray(month.roundsDetail), `Month ${month.month} must have roundsDetail array`)

    month.roundsDetail.forEach((round, idx) => {
      totalRounds++
      assert(typeof round.score === 'number' && round.score > 0, `Round ${idx} in ${month.month} has invalid score`)
      assert(typeof round.course === 'string' && round.course.length > 0, `Round ${idx} in ${month.month} has invalid course`)
      assert(typeof round.date === 'string' && round.date.length > 0, `Round ${idx} in ${month.month} has invalid date`)
      assert(round.holes === 9 || round.holes === 18, `Round ${idx} in ${month.month} must be 9 or 18 holes`)

      if (round.holes === 18) {
        if (round.score < min18) min18 = round.score
      } else {
        if (round.score < min9) min9 = round.score
      }

      if (round.photos && Array.isArray(round.photos)) {
        totalPhotos += round.photos.length
      }

      if (round.stats) {
        if (typeof round.stats.birdies === 'number') totalBirdies += round.stats.birdies
        if (typeof round.stats.pars === 'number') totalPars += round.stats.pars
      }

      if (round.holeStrokes && Array.isArray(round.holeStrokes)) {
        assert(
          round.holeStrokes.length === round.holes,
          `Round ${round.course} on ${round.date}: holeStrokes length (${round.holeStrokes.length}) must match holes (${round.holes})`
        )
      }
    })
  })
})

console.log(`✅ Total Seasons: ${data.length}`)
console.log(`✅ Total Rounds Verified: ${totalRounds}`)
console.log(`✅ Career Low 18 Score: ${min18}`)
console.log(`✅ Career Low 9 Score: ${min9}`)
console.log(`✅ Total Birdies: ${totalBirdies}`)
console.log(`✅ Total Pars: ${totalPars}`)
console.log(`✅ Photos Preserved: ${totalPhotos}`)

assert(totalRounds === 55, `Expected 55 rounds, got ${totalRounds}`)
assert(totalPhotos === 23, `Expected 23 photos preserved, got ${totalPhotos}`)
assert(min18 === 83, `Expected career low 18 to be 83, got ${min18}`)
assert(min9 === 40, `Expected career low 9 to be 40, got ${min9}`)
assert(totalBirdies === 8, `Expected 8 birdies total, got ${totalBirdies}`)

console.log('🎉 All golf data verification checks passed successfully!')
