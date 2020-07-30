import React from 'react'

import { useWeb3Connected } from '../contexts/Web3Context'
import { Question } from '../util/types'

export const useQuestion = (questionId: string) => {
  const { RtioService } = useWeb3Connected()

  const [question, setQuestion] = React.useState<Maybe<Question>>(null)
  const [error, setError] = React.useState(undefined)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    let cancelled = false
    if (!cancelled) setLoading(true)

    const getQuestion = async (questionId: string) => {
      try {
        const question = await RtioService.getQuestion(questionId)
        if (!cancelled) setQuestion(question)
      } catch (err) {
        setError(err)
      }
    }

    getQuestion(questionId)

    if (!cancelled) setLoading(false)

    return () => {
      cancelled = true
    }
  }, [RtioService, questionId])

  return {
    question,
    error,
    loading,
  }
}
