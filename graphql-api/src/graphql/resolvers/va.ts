const TEST_RESULT = JSON.parse(
  `
{"alleles":["TCA","T"],"gks_va_freq":{"alleleFrequency":6.570388572780194e-06,"ancillaryResults":{"homozygotes":0,"meanDepth":32.96730914060974,"popMaxFAF95":{"confidenceInterval":0.95,"frequency":0.0,"popFreqId":"chr1-55057475-TCA-T.SAS"}},"cohort":[{"key":"id","value":"ALL"}],"derivedFrom":[{"key":"id","value":"gnomAD3.1.4"},{"key":"label","value":"gnomAD v3.1.4"},{"key":"type","value":"DataSet"},{"key":"version","value":"3.1.4"}],"focusAllele":{"_id":"ga4gh:VA.26-PIGRwFRiaNfLDKBSzGIRe6j0WdOWD","location":{"_id":"ga4gh:VSL.GPpNG9JRHtLgATLtw10GjjEnULxfu5J-","interval":{"end":55057479,"start":55057475,"type":"SimpleInterval"},"sequence_id":"ga4gh:SQ.Ya6Rs7DHhDeg7YaOSg1EoNi3U_nQ9SvO","type":"SequenceLocation"},"state":{"sequence":"CA","type":"LiteralSequenceExpression"}},"focusAlleleCount":1,"id":"gnomAD-3.1.4:chr1-55057475-TCA-T","label":"Overall Cohort Allele Frequency for chr1-55057475-TCA-T","locusAlleleCount":152198,"type":"CohortAlleleFrequency"},"gks_vrs_variant":{"_id":"ga4gh:VA.26-PIGRwFRiaNfLDKBSzGIRe6j0WdOWD","location":{"_id":"ga4gh:VSL.GPpNG9JRHtLgATLtw10GjjEnULxfu5J-","interval":{"end":55057479,"start":55057475,"type":"SimpleInterval"},"sequence_id":"ga4gh:SQ.Ya6Rs7DHhDeg7YaOSg1EoNi3U_nQ9SvO","type":"SequenceLocation"},"state":{"sequence":"CA","type":"LiteralSequenceExpression"},"type":"Allele"},"locus":{"contig":"chr1","position":55057475,"reference_genome":"GRCh38"}}
`
)

const resolveVAQuery = (obj: any, args: any, ctx: any) => {
  const va = [TEST_RESULT.gks_va_freq]
  const vrs = TEST_RESULT.gks_vrs_variant
  return { va, vrs }
}

const resolveTypeFromTypeFieldWithFallback = (obj: any, fallback: string | null = null) => {
  console.log(`RESOLVING WITH FALLBACK: ${JSON.stringify(obj)} ${fallback}`)
  if (obj.type) {
    return `VA${obj.type}`
  }
  return fallback
}

const resolveTypeFromTypeField = (obj: any) => {
  console.log(`RESOLVING ${JSON.stringify(obj)}`)
  return `VA${obj.type}`
}

const resolvers = {
  Query: {
    va: resolveVAQuery,
  },
  VANumberlike: { __resolveType: resolveTypeFromTypeField },
  VASingleSequenceExpression: { __resolveType: resolveTypeFromTypeField },
  VALocation: { __resolveType: resolveTypeFromTypeField },
  VAUncomposedSequenceExpression: { __resolveType: resolveTypeFromTypeField },
  VAAlleleLocation: {
    __resolveType: (obj: any) => resolveTypeFromTypeFieldWithFallback(obj, 'VACURIE'),
  },
  VAAlleleState: { __resolveType: resolveTypeFromTypeField },
  VACopyNumberSubject: {
    __resolveType: (obj: any) => resolveTypeFromTypeFieldWithFallback(obj, 'VACURIE'),
  },
  VAHaplotypeMember: {
    __resolveType: (obj: any) => resolveTypeFromTypeFieldWithFallback(obj, 'VACURIE'),
  },
  VAGenotypeMemberVariation: { __resolveType: resolveTypeFromTypeField },
  VAVariationSetMember: {
    __resolveType: (obj: any) => resolveTypeFromTypeFieldWithFallback(obj, 'VACURIE'),
  },
  VRSVariation: { __resolveType: resolveTypeFromTypeField },
  VAMolecularVariation: { __resolveType: resolveTypeFromTypeField },
  VAUtilityVariation: { __resolveType: resolveTypeFromTypeField },
  VASystematicVariation: { __resolveType: resolveTypeFromTypeField },
  VASequenceExpression: { __resolveType: resolveTypeFromTypeField },
  VAFeature: { __resolveType: resolveTypeFromTypeField },
  VAFocusAllele: {
    __resolveType: (obj: any) => resolveTypeFromTypeFieldWithFallback(obj, 'VAFocusAlleleURI'),
  },
  VACURIE: {
    value: (obj: any) => obj,
  },
  VAFocusAlleleURI: {
    value: (obj: any) => obj,
  },
}

export default resolvers
