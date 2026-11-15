import { NavLink, useSearchParams } from 'react-router-dom'
import { stations, stationPath, type DisplayMode } from './navigation'

export function StationNavigation({ mode, crewId }: { mode: DisplayMode; crewId: string }) {
  const [search] = useSearchParams()
  const quality = search.get('quality')
  const qualityQuery = quality === 'low' || quality === 'standard' ? `&quality=${quality}` : ''
  return <nav className="station-navigation" aria-label="Medical stations">{stations.map(station =>
    <NavLink key={station.id} to={stationPath(mode, station.id, crewId) + qualityQuery} className={({ isActive }) => `station-link${isActive ? ' active' : ''}`}><span className="station-indicator" aria-hidden="true" />{station.short}</NavLink>,
  )}</nav>
}
