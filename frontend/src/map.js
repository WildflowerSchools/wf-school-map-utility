import React, { useState, useEffect, useRef, useMemo, createRef } from "react"
import ReactMapGL, { LinearInterpolator } from "react-map-gl"

import Cluster from "./cluster"
import ClusterMarker from "./clusterMarker"
import SchoolMarker from "./marker"
import useSchools from "./api/schools"

const Map = () => {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: 35.383,
    longitude: -90.583,
    zoom: 3.3,
  })

  const [schools, setSchools] = useState([])

  const mapRef = useRef(null)
  const schoolRefs = useRef([])

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
      } else if (marker.ref.current) {
        marker.ref.current.togglePopup(false)
      }
    }

    // Close all popups except for the marker that was just clicked
    // for (const marker of markers) {
    //   if (marker.key !== markerKey && marker.ref.current) {
    //     marker.ref.current.togglePopup(false)
    //   }
    // }
  }

  const onClusterMarkerClick = (coordinates) => {
    const zoom = viewport.zoom + 4
    setViewport({
      ...viewport,
      longitude: coordinates[0],
      latitude: coordinates[1],
      zoom: zoom > 10 ? 10 : zoom,
      transitionDuration: 1000,
      transitionInterpolator: new LinearInterpolator(),
    })
  }

  const onViewportChange = (nextViewport) => {
    setViewport(nextViewport)
  }

  // Might be a good idea to useMemo here, but I'm not sure how to retain access to ref...
  // const markers = useMemo(() => {
  const markers = schools.map((school) => {
    {
      return (
        <SchoolMarker
          key={school.id}
          longitude={school.longitude}
          latitude={school.latitude}
          ref={createRef()}
          school={school}
          onMarkerClick={onMarkerClick}
        />
      )
    }
  })
  // }, [schools, schoolRefs])

  return (
    <ReactMapGL
      {...viewport}
      ref={mapRef}
      mapboxApiAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
      mapStyle={"mapbox://styles/wfbtalberg/ckst2ao5l3rqc18o40k727tvi"}
      onViewportChange={onViewportChange}
    >
      {mapRef.current && (
        <Cluster
          map={mapRef.current.getMap()}
          radius={20}
          extent={512}
          nodeSize={40}
          maxZoom={8}
          element={(clusterProps) => (
            <ClusterMarker
              onMarkerClick={onClusterMarkerClick}
              onViewportChange={onViewportChange}
              {...clusterProps}
            />
          )}
        >
          {markers}
        </Cluster>
      )}
    </ReactMapGL>
  )
}

export default Map
