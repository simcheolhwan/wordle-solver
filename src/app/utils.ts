import PossibleWords from "../data/possible-words.json"
import AllowedWords from "../data/allowed-words.json"

export interface GuessItem {
  word: string
  result: string
}

export const validateWord = ({ word, result }: GuessItem, target: string) => {
  const compare = word.split("").map((char, index) => {
    const charResult = result[index]
    switch (charResult) {
      case "b":
        // 존재하면 틀림
        if (target.includes(char)) return false
        return true

      case "y":
        // 존재하고 위치가 같으면 틀림
        if (target[index] === char) return false
        // 존재하면 맞음
        if (target.includes(char)) return true
        return false

      case "g":
        // 존재하고 위치가 같으면 맞음
        if (target[index] === char) return true
        return false

      default:
        return true
    }
  })

  return compare.every((item) => item)
}

export const filterPossibleWords = (guesses: GuessItem[]) => {
  return {
    possible: PossibleWords.filter((target) => guesses.every((guess) => validateWord(guess, target))),
    allowed: AllowedWords.filter((target) => guesses.every((guess) => validateWord(guess, target))),
  }
}
