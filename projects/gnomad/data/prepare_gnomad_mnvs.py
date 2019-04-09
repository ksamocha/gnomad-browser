import argparse

import hail as hl

from hail_scripts.v02.utils.computed_fields import (
    get_expr_for_contig,
    get_expr_for_xpos,
)

p = argparse.ArgumentParser()
p.add_argument("--input-url", help="URL of MNV TSV file", required=True)
p.add_argument("--output-url", help="URL to write output Hail table to", required=True)
args = p.parse_args()

hl.init(log="/tmp/hail.log")

ds = hl.import_table(
    args.input_url,
    missing="None",
    types=dict(
        locus=hl.tlocus(),
        snp1_locus=hl.tlocus(),
        snp2_locus=hl.tlocus(),
        AC_snp1=hl.tint,
        AC_snp2=hl.tint,
        AC_mnv=hl.tint,
        n_mnv_homozygous=hl.tint,
    ),
)

###########
# Prepare #
###########

ds = ds.annotate(chrom=get_expr_for_contig(ds.locus), pos=ds.locus.position, xpos=get_expr_for_xpos(ds.locus))

ds = ds.transmute(category=ds.categ, snp1_variant_id=ds.snp1, snp2_variant_id=ds.snp2, mnv_variant_id=ds.mnv)

ds = ds.order_by("xpos").drop("locus", "snp1_locus", "snp2_locus", "snp1_ref", "snp2_ref", "snp1_alt", "snp2_alt")

#########
# Write #
#########

ds.write(args.output_url)
