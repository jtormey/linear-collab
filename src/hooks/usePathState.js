import { useState, useEffect } from 'react'

export default function usePathState () {
  const [path, setPath] = useState(window.location.pathname)

  function handleStateChange () {
    setPath(window.location.pathname)
  }

  useEffect(() => {
    window.addEventListener('pushstate', handleStateChange)
    window.addEventListener('popstate', handleStateChange)
    window.addEventListener('replacestate', handleStateChange)
    window.addEventListener('locationchange', handleStateChange)

    return () => {
      window.removeEventListener('pushstate', handleStateChange)
      window.removeeventlistener('popstate', handleStateChange)
      window.removeeventlistener('replacestate', handleStateChange)
      window.removeeventlistener('locationchange', handleStateChange)
    }
  }, [])

  return path
}
