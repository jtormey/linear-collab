import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import useCollabState from '../hooks/useCollabState'

const Global = createGlobalStyle`
  * {
    margin: 0px;
    padding: 0px;
    border: none;
  }
`

const Menu = styled.div`
  display: flex;
  justify-content: center;
  background-color: rgb(31, 32, 35);
`

export default function App () {
  const [enabled, setEnabled] = useCollabState()

  return (
    <>
      <Menu className='w-64 py-8'>
        {enabled ? (
          <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={() => setEnabled(false)}>
            Disable collab-mode
          </button>
        ) : (
          <button className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded' onClick={() => setEnabled(true)}>
            Enable collab-mode
          </button>
        )}
      </Menu>
      <Global />
    </>
  )
}
