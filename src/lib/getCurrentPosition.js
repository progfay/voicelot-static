/* global navigator */

export default () => (
  new Promise((resolve, reject) => {
    if (!navigator.onLine) return resolve({})
    return navigator.geolocation.getCurrentPosition(
      ({ coords }) => { resolve(coords) },
      (error) => { resolve({ error }) },
      { enableHighAccuracy: true }
    )
  })
)
