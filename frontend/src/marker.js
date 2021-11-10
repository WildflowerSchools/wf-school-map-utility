import React, { useImperativeHandle, useState } from "react"
import { Marker } from "react-map-gl"

import SeedlingIcon from "../public/seedling-flower_icon.svg"
import SchoolPopup from "./popup"

const SchoolMarker = React.forwardRef((props, ref) => {
  const { school, onMarkerClick, latitude, longitude } = props

  const [showPopup, togglePopup] = useState(false)

  useImperativeHandle(ref, () => ({
    togglePopup: togglePopup,
  }))

  const handleMarkerClick = () => {
    if (onMarkerClick) onMarkerClick(school.id)

    if (togglePopup) togglePopup(!showPopup)
  }

  return (
    <div ref={ref}>
      <Marker
        key={school.id}
        longitude={school.longitude}
        latitude={school.latitude}
        offsetLeft={-25}
        offsetTop={-48}
      >
        <SeedlingIcon alt="School Marker" onClick={handleMarkerClick} />
      </Marker>
      <SchoolPopup
        school={school}
        showPopup={showPopup}
        togglePopup={togglePopup}
      />
    </div>
  )
})

export default SchoolMarker
