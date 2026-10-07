import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import recentlyAccessedService from '../services/recentlyAccessedService.js'

/**
 * Fire-and-forget: records that the signed-in user viewed a destination,
 * hotel or package, so the "Recently Viewed" section can show it later.
 * No-ops for logged-out visitors and never blocks or throws into the page.
 */
export default function useRecordAccess({ resourceType, resourceId, resourceName, resourceImage = '' }) {
  const { user } = useAuth()

  useEffect(() => {
    if (!user || !resourceId || !resourceName) return
    recentlyAccessedService.record({
      resourceType,
      resourceId: String(resourceId),
      resourceName,
      resourceImage,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, resourceType, resourceId, resourceName, resourceImage])
}
