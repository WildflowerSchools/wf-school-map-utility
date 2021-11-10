import React, { PureComponent } from "react"

class ClusterMarker extends PureComponent {
  constructor(props) {
    super(props)

    this.onMarkerClick = props.onMarkerClick

    this.handleMarkerClick = this.handleMarkerClick.bind(this)
  }

  handleMarkerClick() {
    if (this.onMarkerClick) {
      this.onMarkerClick(this.props.cluster.geometry.coordinates)
    }
  }

  render() {
    const { cluster } = this.props
    // if you want to access the leaves in this cluster group
    // const leaves = superCluster.getLeaves(cluster.properties.cluster_id, 3);
    // the number of leaves in this cluster group
    const count = cluster.properties.point_count_abbreviated
    return (
      <div className="cluster-marker" onClick={this.handleMarkerClick}>
        <div>
          <span>{count}</span>
        </div>
      </div>
    )
  }
}

export default ClusterMarker
