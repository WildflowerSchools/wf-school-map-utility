// Thank you @NickCarducci and @jamalx31 - https://github.com/visgl/react-map-gl/issues/507

import Supercluster from "supercluster"
import { point } from "@turf/helpers"
import { Children, PureComponent, createElement } from "react"
import PropTypes from "prop-types"

import { Marker } from "react-map-gl"

class Cluster extends PureComponent {
  static displayName = "Cluster"

  constructor(props) {
    super(props)

    this.state = {
      minZoom: props.minZoom,
      maxZoom: props.maxZoom,
      radius: props.radius,
      extent: props.extent,
      nodeSize: props.nodeSize,
      clusters: props.clusters,
      children: props.children,
    }
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps.children !== this.props.children) {
      this.setState({
        children: this.props.children,
      })
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const childrenKeys = (children) =>
      Children.toArray(children).map((child) => child.key)
    const prevKeys = childrenKeys(prevState.children)
    const newKeys = new Set(childrenKeys(nextProps.children))
    if (
      Children.count(nextProps.children) !==
        Children.count(prevState.children) ||
      prevKeys.length !== newKeys.size ||
      !prevKeys.every((key) => newKeys.has(key))
    ) {
      return { children: nextProps.children }
    } else return null
  }

  render() {
    const { children } = this.state
    const points = Children.map(
      children,
      (child) =>
        child && point([child.props.longitude, child.props.latitude], child)
    )
    const { minZoom, maxZoom, radius, extent, nodeSize } = this.state
    this._cluster = new Supercluster({
      minZoom,
      maxZoom,
      radius,
      extent,
      nodeSize,
    }).load(points)
    if (this.props.innerRef) {
      this.props.innerRef(this._cluster)
    }
    const zoom = this.props.map.getZoom()
    const bounds = this.props.map.getBounds().toArray()
    const bbox = bounds[0].concat(bounds[1])
    return this._cluster.getClusters(bbox, Math.floor(zoom)).map((cluster) => {
      const [longitude, latitude] = cluster.geometry.coordinates
      if (cluster.properties.cluster) {
        return createElement(Marker, {
          longitude,
          latitude,
          // TODO size
          offsetLeft: -28 / 2,
          offsetTop: -28,
          children: createElement(this.props.element, {
            cluster,
            superCluster: this._cluster,
          }),
          key: `cluster-${cluster.properties.cluster_id}`,
        })
      }
      const { type, ref, key, props } = cluster.properties
      return createElement(type, { key, ref, ...props })
    })
  }
}

Cluster.propTypes = {
  /** Mapbox map object */
  map: PropTypes.object,

  /** Minimum zoom level at which clusters are generated */
  minZoom: PropTypes.number,

  /** Maximum zoom level at which clusters are generated */
  maxZoom: PropTypes.number,

  /** Cluster radius, in pixels */
  radius: PropTypes.number,

  /** (Tiles) Tile extent. Radius is calculated relative to this value */
  extent: PropTypes.number,

  /** Size of the KD-tree leaf node. Affects performance */
  nodeSize: PropTypes.number,

  /** ReactDOM element to use as a marker */
  element: PropTypes.func,

  /**
   * Callback that is called with the supercluster instance as an argument
   * after componentDidMount
   */
  /* eslint-disable react/no-unused-prop-types */
  innerRef: PropTypes.func,
  /* eslint-enable react/no-unused-prop-types */

  /** Markers as children */
  children: PropTypes.node,
}

Cluster.defaultProps = {
  minZoom: 0,
  maxZoom: 20,
  radius: 20,
  extent: 512,
  nodeSize: 10,
  clusters: [],
}

export default Cluster
