import { getFlagsForContext } from '../shared/flags'
import POPULATIONS from './populations'

const shapeGnomadVariantSummary = (subsetKey, context) => {
  let getConsequence
  switch (context.type) {
    case 'gene':
      getConsequence = variant =>
        (variant.sortedTranscriptConsequences || []).find(csq => csq.gene_id === context.geneId)
      break
    case 'region':
      getConsequence = variant => (variant.sortedTranscriptConsequences || [])[0]
      break
    case 'transcript':
      getConsequence = variant =>
        (variant.sortedTranscriptConsequences || []).find(
          csq => csq.transcript_id === context.transcriptId
        )
      break
    default:
      throw Error(`Invalid context for shapeGnomadVariantSummary: ${context.type}`)
  }

  const getFlags = getFlagsForContext(context)

  return esHit => {
    // eslint-disable-next-line no-underscore-dangle
    const variantData = esHit._source

    // eslint-disable-next-line no-underscore-dangle
    const isExomeVariant = esHit._index === 'gnomad_exomes_2_1_1'

    const ac = variantData[subsetKey].AC_adj.total
    const an = variantData[subsetKey].AN_adj.total

    const transcriptConsequence = getConsequence(variantData) || {}

    return {
      // Variant ID fields
      alt: variantData.alt,
      chrom: variantData.chrom,
      pos: variantData.pos,
      ref: variantData.ref,
      variantId: variantData.variant_id,
      xpos: variantData.xpos,
      // Other fields
      consequence: transcriptConsequence.major_consequence,
      consequence_in_canonical_transcript: !!transcriptConsequence.canonical,
      flags: getFlags(variantData, transcriptConsequence),
      gene_id: transcriptConsequence.gene_id,
      gene_symbol: transcriptConsequence.gene_symbol,
      hgvs: transcriptConsequence.hgvs,
      hgvsc: transcriptConsequence.hgvsc ? transcriptConsequence.hgvsc.split(':')[1] : null,
      hgvsp: transcriptConsequence.hgvsp ? transcriptConsequence.hgvsp.split(':')[1] : null,
      lof: transcriptConsequence.lof,
      lof_filter: transcriptConsequence.lof_filter,
      lof_flags: transcriptConsequence.lof_flags,
      rsid: variantData.rsid,
      [isExomeVariant ? 'genome' : 'exome']: null,
      [isExomeVariant ? 'exome' : 'genome']: {
        ac,
        ac_hemi: variantData.nonpar ? variantData[subsetKey].AC_adj.male : 0,
        ac_hom: variantData[subsetKey].nhomalt_adj.total,
        an,
        af: an ? ac / an : 0,
        filters: variantData.filters || [],
        populations: POPULATIONS.map(popId => ({
          id: popId.toUpperCase(),
          ac: (variantData[subsetKey].AC_adj[popId] || {}).total || 0,
          an: (variantData[subsetKey].AN_adj[popId] || {}).total || 0,
          ac_hemi: variantData.nonpar ? (variantData[subsetKey].AC_adj[popId] || {}).male || 0 : 0,
          ac_hom: (variantData[subsetKey].nhomalt_adj[popId] || {}).total || 0,
        })),
      },
    }
  }
}

export default shapeGnomadVariantSummary