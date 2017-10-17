import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'

import RegionViewer from '@broad/region'
import NavigatorConnected from '@broad/gene-page/src/containers/NavigatorConnected'
import TranscriptConnected from '@broad/gene-page/src/containers/TranscriptConnected'
import CoverageTrack from '@broad/track-coverage'
import VariantTrack from '@broad/track-variant'
// import StackedBarTrack from '@broad/track-stacked-bar'
import { screenSize, exonPadding, actions as activeActions } from '@broad/gene-page/src/resources/active'
import { geneData, regionalConstraint } from '@broad/gene-page/src/resources/genes'

import { SectionTitle } from '@broad/gene-page/src/presentation/UserInterface'

import {
  finalFilteredVariants,
  selectedVariantDataset,
} from '@broad/gene-page/src/resources/variants'

import {
  coverageConfigClassic,
  coverageConfigNew,
  markerExacClassic,
  attributeConfig,
} from '@broad/gene-page/src/presentation/RegionViewerStyles'

const COVERAGE_TRACK_HEIGHT = 200
const REGIONAL_CONSTRAINED_TRACK_HEIGHT = 17
const VARIANT_TRACK_HEIGHT = 60

export const TOTAL_REGION_VIEWER_HEIGHT =
  COVERAGE_TRACK_HEIGHT +
  REGIONAL_CONSTRAINED_TRACK_HEIGHT +
  VARIANT_TRACK_HEIGHT

const GeneRegion = ({
  gene,
  allVariants,
  selectedVariantDataset,
  exonPadding,
  regionalConstraint,
  screenSize,
}) => {
  const smallScreen = screenSize.width < 900
  const regionViewerWidth = smallScreen ? screenSize.width - 150 : screenSize.width - 330

  const geneJS = gene.toJS()
  const canonicalExons = geneJS.transcript.exons
  const { transcript, strand } = geneJS
  const { exome_coverage, genome_coverage, exacv1_coverage } = transcript
  const variantsReversed = allVariants.reverse()

  const showVariants = true

  // const coverageConfig = selectedVariantDataset === 'exacVariants' ?
  //   coverageConfigClassic(exome_coverage) :
  //   coverageConfigNew(exome_coverage, genome_coverage)

  const getCoverageConfig = (selectedVariantDataset) => {
    switch (selectedVariantDataset) {
      case 'exacVariants':
        return coverageConfigClassic(exacv1_coverage)
      case 'gnomadExomeVariants':
        return coverageConfigNew(exome_coverage)
      case 'gnomadGenomeVariants':
        return coverageConfigNew(null, genome_coverage)
      case 'gnomadCombinedVariants':
        return coverageConfigNew(exome_coverage, genome_coverage)
      default:
        return coverageConfigNew(exome_coverage, genome_coverage)
    }
  }

  const coverageConfig = getCoverageConfig(selectedVariantDataset)

  const RegionalConstraintTrackWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 100%;
  `

  const RegionalConstraintLeft = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: ${props => props.leftPanelWidth}px;
  `

  const RegionalConstraintText = styled.p`
    height: 100%;
  `

  const RegionalConstraintData = styled.div`
    height: 100%;
  `

  const RegionalConstraintRegion = styled.rect`

  `

  const RegionalConstraintTrack = ({
    regionalConstraintData,
    leftPanelWidth,
    xScale,
    positionOffset,
    width,
    height,
    strand,
  }) => {
    const padding = 2
    return (
      <RegionalConstraintTrackWrapper>
        <RegionalConstraintLeft leftPanelWidth={leftPanelWidth} >
          <RegionalConstraintText>Regional constraint</RegionalConstraintText>
        </RegionalConstraintLeft>
        <RegionalConstraintData>
          <svg height={height} width={width}>
            {/* <rect
              x={0}
              y={0}
              width={width / 2}
              height={height}
              fill={'yellow'}
              stroke={'black'}
            /> */}
            {regionalConstraintData.map((region, i) => {
              const regionStart = strand === '+' ? region.genomic_start : region.genomic_end
              const regionStop = strand === '+' ? region.genomic_end : region.genomic_start
              const regionStartPos = positionOffset(regionStart).offsetPosition
              const regionStopPos = positionOffset(regionStop).offsetPosition
              return (
                <g key={`${i}-region`}>
                  <RegionalConstraintRegion
                    x={xScale(regionStartPos)}
                    y={padding}
                    width={xScale(regionStopPos) - xScale(regionStartPos)}
                    height={height - padding}
                    fill={'rgb(255, 88, 63)'}
                    // fill={'transparent'}
                    strokeWidth={1}
                    stroke={'black'}
                    opacity={0.2}
                  />
                  <text
                    x={(xScale(regionStopPos) + xScale(regionStartPos)) / 2}
                    y={height / 2 + 6}
                    textAnchor={'middle'}
                  >
                    {/* {region.region_name} */}
                  </text>
                </g>
              )
            })}
          </svg>
        </RegionalConstraintData>
      </RegionalConstraintTrackWrapper>
    )
  }

  const RegionViewerWrapper = styled.div`
    margin-left: 3px;
    width: 100%;
    padding-left: 0;
  `

  const RegionViewerSectionTitle = SectionTitle.extend`
    margin-left: 80px;
    @media (max-width: 900px) {
      margin-left: 0;
    }
  `

  return (
    <RegionViewerWrapper>
      {/* <RegionViewerSectionTitle>Positional data</RegionViewerSectionTitle> */}
      <RegionViewer
        width={regionViewerWidth}
        padding={exonPadding}
        regions={canonicalExons}
        regionAttributes={attributeConfig}
        // broadcast={setRegionViewerAttributes}
      >
        <CoverageTrack
          title={'Coverage'}
          height={200}
          dataConfig={coverageConfig}
          yTickNumber={11}
          yMax={110}
        />
        <TranscriptConnected height={12} showRightPanel={!smallScreen} />
        {regionalConstraint.length > 0 && selectedVariantDataset === 'exacVariants' &&
          <RegionalConstraintTrack
            height={17}
            regionalConstraintData={regionalConstraint}
            strand={strand}
          />}

        {showVariants &&
          <VariantTrack
            key={'All-variants'}
            title={`variants (${allVariants.size})`}
            height={60}
            color={'#75757'}
            markerConfig={markerExacClassic}
            variants={variantsReversed}
          />}
        <NavigatorConnected />
      </RegionViewer>
    </RegionViewerWrapper>
  )
}
GeneRegion.propTypes = {
  gene: PropTypes.object.isRequired,
  allVariants: PropTypes.any.isRequired,
  exonPadding: PropTypes.number.isRequired,
  setRegionViewerAttributes: PropTypes.func.isRequired,
  selectedVariantDataset: PropTypes.string.isRequired,
  regionalConstraint: PropTypes.array.isRequired,
  screenSize: PropTypes.object.isRequired,
}
export default connect(
  state => ({
    gene: geneData(state),
    exonPadding: exonPadding(state),
    allVariants: finalFilteredVariants(state),
    selectedVariantDataset: selectedVariantDataset(state),
    regionalConstraint: regionalConstraint(state),
    screenSize: screenSize(state),
  }),
  dispatch => ({
    setRegionViewerAttributes: regionViewerAttributes =>
      dispatch(activeActions.setRegionViewerAttributes(regionViewerAttributes))
  })
)(GeneRegion)
