import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import DramaDetails from '../components/DramaDetails'
import { getDrama } from '../utils/api'

function DramaDetail() {
  const { title } = useParams()
  const [drama, setDrama] = useState(null)

  useEffect(() => {
    getDrama(decodeURIComponent(title)).then(setDrama)
  }, [title])

  if (!drama) return <div className="container mx-auto p-4">Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <DramaDetails drama={drama} />
    </div>
  )
}

export default DramaDetail