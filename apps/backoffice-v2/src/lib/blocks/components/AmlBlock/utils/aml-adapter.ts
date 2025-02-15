import { z } from 'zod';

const SourceInfoSchema = z.object({
  sourceName: z.string().optional().nullable(),
  sourceUrl: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
});

const HitSchema = z.object({
  matchedName: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  countries: z.array(z.string()).optional().nullable(),
  matchTypes: z.array(z.string()).optional().nullable(),
  aka: z.array(z.string()).optional().nullable(),
  warnings: z.array(SourceInfoSchema).optional().nullable(),
  sanctions: z.array(SourceInfoSchema).optional().nullable(),
  pep: z.array(SourceInfoSchema).optional().nullable(),
  adverseMedia: z.array(SourceInfoSchema).optional().nullable(),
});

export const AmlSchema = z.object({
  hits: z.array(HitSchema).optional().nullable(),
  createdAt: z.string().optional().nullable(),
});

export type TAml = z.output<typeof AmlSchema>;

export const amlAdapter = (aml: TAml) => {
  const { hits, createdAt, ...rest } = aml;

  return {
    totalMatches: hits?.length ?? 0,
    fullReport: rest,
    dateOfCheck: createdAt,
    matches:
      hits?.map(
        ({
          matchedName,
          dateOfBirth,
          countries,
          matchTypes,
          aka,
          sanctions,
          warnings,
          pep,
          adverseMedia,
        }) => ({
          matchedName,
          dateOfBirth,
          countries: countries?.join(', ') ?? '',
          matchTypes: matchTypes?.join(', ') ?? '',
          aka: aka?.join(', ') ?? '',
          sanctions:
            sanctions?.map(sanction => ({
              sanction: sanction?.sourceName,
              date: sanction?.date,
              source: sanction?.sourceUrl,
            })) ?? [],
          warnings:
            warnings?.map(warning => ({
              warning: warning?.sourceName,
              date: warning?.date,
              source: warning?.sourceUrl,
            })) ?? [],
          pep:
            pep?.map(pepItem => ({
              person: pepItem?.sourceName,
              date: pepItem?.date,
              source: pepItem?.sourceUrl,
            })) ?? [],
          adverseMedia:
            adverseMedia?.map(adverseMediaItem => ({
              entry: adverseMediaItem?.sourceName,
              date: adverseMediaItem?.date,
              source: adverseMediaItem?.sourceUrl,
            })) ?? [],
        }),
      ) ?? [],
  };
};
