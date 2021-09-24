import PropTypes from 'prop-types'

const ShortTandemRepeatRepeatUnitPropType = PropTypes.shape({
  repeat_unit: PropTypes.string.isRequired,
  repeats: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  populations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      repeats: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    })
  ).isRequired,
})

export const ShortTandemRepeatAdjacentRepeatPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  reference_region: PropTypes.shape({
    chrom: PropTypes.string.isRequired,
    start: PropTypes.number.isRequired,
    stop: PropTypes.number.isRequired,
  }).isRequired,
  reference_repeat_unit: PropTypes.string.isRequired,
  repeat_units: PropTypes.arrayOf(PropTypes.string).isRequired,
  repeat_counts: PropTypes.shape({
    total: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    populations: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        repeats: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
      })
    ).isRequired,
    repeat_units: PropTypes.arrayOf(ShortTandemRepeatRepeatUnitPropType).isRequired,
  }).isRequired,
})

export const ShortTandemRepeatPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  gene: PropTypes.shape({
    ensembl_id: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
  }).isRequired,
  inheritance_mode: PropTypes.string.isRequired,
  associated_disease: PropTypes.shape({
    name: PropTypes.string.isRequired,
    omim_id: PropTypes.string,
    normal_threshold: PropTypes.number,
    pathogenic_threshold: PropTypes.number,
  }).isRequired,
  stripy_id: PropTypes.string,
  reference_region: PropTypes.shape({
    chrom: PropTypes.string.isRequired,
    start: PropTypes.number.isRequired,
    stop: PropTypes.number.isRequired,
  }).isRequired,
  reference_repeat_unit: PropTypes.string.isRequired,
  repeat_units: PropTypes.arrayOf(
    PropTypes.shape({
      repeat_unit: PropTypes.string.isRequired,
      classification: PropTypes.string.isRequired,
    })
  ).isRequired,
  repeat_counts: PropTypes.shape({
    total: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    populations: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        repeats: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
      })
    ).isRequired,
    repeat_units: PropTypes.arrayOf(ShortTandemRepeatRepeatUnitPropType).isRequired,
  }).isRequired,
  adjacent_repeats: PropTypes.arrayOf(ShortTandemRepeatAdjacentRepeatPropType).isRequired,
})