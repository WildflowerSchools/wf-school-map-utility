import React, { useState, useEffect } from "react"
import ReactMapGL, { LinearInterpolator } from "react-map-gl"

import SchoolMarker from "./marker"
import useSchools from "./api/schools"

const Map = () => {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 35.383,
    longitude: -90.583,
    zoom: 3.3,
  })

  const [schools, setSchools] = useState([])

  const [rawSchoolData, rawSchoolDataLoading, rawSchoolDataError] = useSchools()

  useEffect(() => {
    if (!rawSchoolDataLoading && !rawSchoolDataError && rawSchoolData) {
      const filtered = rawSchoolData.filter((school) => {
        return school["latitude"] !== null && school["longitude"] !== null
      })
      setSchools(filtered)
    }
  }, [rawSchoolData, rawSchoolDataLoading, rawSchoolDataError])

  const onMarkerClick = (markerKey) => {
    for (const marker of markers) {
      if (marker.key === markerKey) {
        setViewport({
          ...viewport,
          longitude: marker.props.school.longitude,
          latitude: marker.props.school.latitude,
          zoom: viewport.zoom,
          transitionDuration: 1000,
          transitionInterpolator: new LinearInterpolator(),
        })
      }
    }

    // Close all popups except for the marker that was just clicked
    for (const marker of markers) {
      if (marker.key !== markerKey && marker.ref.current) {
        marker.ref.current.togglePopup(false)
      }
    }
  }

  // Might be a good idea to useMemo this
  const markers = schools.map((school) => {
    return (
      <SchoolMarker
        key={school.id}
        ref={React.createRef()}
        school={school}
        onMarkerClick={onMarkerClick}
      />
    )
  })

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
      mapStyle={"mapbox://styles/wfbtalberg/ckst2ao5l3rqc18o40k727tvi"}
      onViewportChange={(nextViewport) => {
        setViewport(nextViewport)
      }}
    >
      {markers}
    </ReactMapGL>
  )
}

export default Map
