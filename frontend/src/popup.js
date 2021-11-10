import React from "react"

import { Container, Col, Row } from "react-bootstrap"

import { Popup } from "react-map-gl"

import IconGeoAlt from "bootstrap-icons/icons/geo-alt.svg"
import IconGlobe from "bootstrap-icons/icons/globe.svg"
import IconEnvelope from "bootstrap-icons/icons/envelope.svg"
import IconPerson from "bootstrap-icons/icons/person.svg"

const SchoolPopup = (props) => {
  const { school, showPopup, togglePopup } = props

  const hasImage = () => {
    return school.logo && school.logo.hasOwnProperty("thumbnails")
  }

  return (
    <div>
      {showPopup && (
        <Popup
          className="marker-popup"
          latitude={school.latitude}
          longitude={school.longitude}
          closeButton={true}
          closeOnClick={false}
          onClose={togglePopup}
          anchor="bottom"
          offsetTop={-40}
          dynamicPosition={true}
        >
          <>
            <Container style={{ minWidth: "375px" }}>
              <Row>
                {hasImage() && (
                  <Col xs={3} className="center-horizontal">
                    <img
                      className="popup-school-logo"
                      src={school.logo["thumbnails"]["large"]["url"]}
                    />
                  </Col>
                )}
                <Col xs={hasImage() ? 9 : 12} style={{ paddingBottom: "10px" }}>
                  <Row
                    style={{
                      backgroundColor: "#00a69c",
                      color: "white",
                      paddingTop: "5px",
                    }}
                  >
                    <h4>{school.name}</h4>
                  </Row>
                  <span className={"empty-line"} />
                  <Row className={"flex-nowrap"}>
                    <Col xs={1}>
                      <IconPerson style={{ fontSize: "2.5rem" }} />
                    </Col>
                    <Col xs={11}>
                      {/*<span className="fw-bold">Classrooms:</span>*/}
                      {school.ages.join(", ")}
                    </Col>
                  </Row>
                  {school.address && (
                    <>
                      <span className={"empty-line"} />
                      <Row className={"flex-nowrap"}>
                        <Col xs={1}>
                          <IconGeoAlt style={{ fontSize: "2.5rem" }} />
                        </Col>
                        <Col xs={11}>
                          {/*<span>{school.address['full']}</span>*/}
                          <span>
                            {school.address["street"]} <br />
                            {school.address["city"] &&
                              `${school.address["city"]}, `}
                            {school.address["state"]} {school.address["zip"]}
                          </span>
                        </Col>
                      </Row>
                      <span className={"empty-line"} />
                    </>
                  )}
                  {school.website && (
                    <Row className={"flex-nowrap"}>
                      <Col xs={1}>
                        <IconGlobe style={{ fontSize: "2.5rem" }} />
                      </Col>
                      <Col xs={11}>
                        <a href={school.website} target="_blank">
                          {school.website}
                        </a>
                      </Col>
                    </Row>
                  )}
                  {school.email &&
                    school.email.split(" ").map((email, idx) => {
                      return (
                        <Row key={idx} className={"flex-nowrap"}>
                          <React.Fragment>
                            <Col xs={1}>
                              <IconEnvelope style={{ fontSize: "2.5rem" }} />
                            </Col>
                            <Col xs={11}>
                              <a href={`mailto:${email}`}>{email}</a>
                            </Col>
                          </React.Fragment>
                        </Row>
                      )
                    })}
                </Col>
              </Row>
            </Container>
          </>
        </Popup>
      )}
    </div>
  )
}

export default SchoolPopup
