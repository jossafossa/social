import { useState } from 'react'
import { useNavigate } from 'react-router'
import { SearchOverlay, SearchTrigger } from '~/components'
import { paths } from '~/paths'

// The native dialog hands focus back to whatever had it before it opened, so no focus juggling here.
export const GlobalSearch = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)
  const handleSearch = (query: string) => {
    setIsOpen(false)
    navigate(`${paths.search}?q=${encodeURIComponent(query)}`)
  }

  return (
    <>
      <SearchTrigger onClick={handleOpen} />
      <SearchOverlay isOpen={isOpen} onClose={handleClose} onSearch={handleSearch} />
    </>
  )
}
