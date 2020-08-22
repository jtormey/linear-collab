import { useState, useEffect } from 'react'

export default function useElemBoundingRect (selector) {
  const [rect, setRect] = useState(null)

  function computeBoundingRect () {
    const elem = document.querySelector(selector)

    if (elem) {
      setRect(elem.getBoundingClientRect())
    }

    return elem !== null
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const success = computeBoundingRect()

      if (success) {
        clearInterval(interval)
      }
    })

    return () => {
      clearInterval(interval)
    }
  }, [selector])

  useEffect(() => {
    window.addEventListener('resize', computeBoundingRect)

    return () => {
      window.removeEventListener('resize', computeBoundingRect)
    }
  }, [selector])

  return rect
}
