import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import classNames from "classnames"
import { filterPossibleWords, GuessItem } from "./utils"

const SAMPLE: GuessItem[] = [
  // { word: "adieu", result: "bbbyb" },
  // { word: "horse", result: "bybyg" },
  // { word: "stone", result: "gbgbg" },
]

const App = () => {
  const [guesses, setGuesses] = useState<GuessItem[]>(SAMPLE)
  const defaultValues = { word: "", result: "" }
  const { register, handleSubmit, watch, reset } = useForm<GuessItem>({ defaultValues })
  const guess = watch()

  const submit = handleSubmit((values) => {
    setGuesses([...guesses, values])
    reset()
  })

  const possibleWords = useMemo(() => {
    if (!(guesses.length > 1)) return
    return filterPossibleWords(guesses)
  }, [guesses])

  const renderPossibleWords = useMemo(() => {
    if (!possibleWords) return null
    const { allowed, possible } = possibleWords
    return (
      <section className="possible">
        {allowed.map((word) => (
          <span className={classNames("item", !possible.includes(word) && "muted")} key={word}>
            {word}
          </span>
        ))}
      </section>
    )
  }, [possibleWords])

  return (
    <>
      <form onSubmit={submit}>
        <input {...register("word", { required: true, pattern: /[a-z]{5}/ })} autoComplete="off" />
        <input {...register("result", { required: true, pattern: /[gyb]{5}/ })} autoComplete="off" />
        <button type="submit">Submit</button>
      </form>

      <section className="guesses">
        {[...guesses, guess].map(({ word, result }, guessIndex) => (
          <div className="guess" key={guessIndex}>
            {word.split("").map((char, charIndex) => (
              <span className={classNames("char", getClassname(result[charIndex]))} style={{ width: 32, height: 32 }} key={charIndex}>
                {char}
              </span>
            ))}
          </div>
        ))}
      </section>

      {renderPossibleWords}
    </>
  )
}

export default App

const getClassname = (color: string) => {
  if (!color) return "tbd"
  return "bg-" + { y: "present", g: "correct", b: "absent" }[color]
}
