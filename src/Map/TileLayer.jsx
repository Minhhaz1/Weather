import React from 'react'
import { TileLayer as LeafletTileLayer } from 'react-leaflet'

const TileLayer = () => (
  <LeafletTileLayer
    url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
    attribution='&copy; <a href="https://www.carto.com/">Carto</a> contributors'
  />
)

export default TileLayer
