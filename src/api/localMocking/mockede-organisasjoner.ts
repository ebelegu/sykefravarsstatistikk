import { OverordnetEnhetDto } from '../../enhetsregisteret/api/enheter-api';
import { UnderenhetDto } from '../../enhetsregisteret/api/underenheter-api';
import {
    aggregertStatistikkMockGrønnBarnehage,
    aggregertStatistikkMockGulBarnehage,
    aggregertStatistikkMockMaskert,
    aggregertStatistikkMockMedBare2Kvartaler,
    aggregertStatistikkMockRødBarnehage,
    lagAggregertStatistikkMockGul,
} from '../mockedApiResponses/summert-sykefraværshistorikk-mock';
import { Statistikkategori } from '../../domene/statistikkategori';
import {
    lagHistorikkMedLandSektorOgNæringMenIngenDataForOverordnetEnhetEllerUnderenhet,
    lagMaskertHistorikk,
    lagMockHistorikkForBarnehage,
} from '../mockedApiResponses/sykefraværshistorikk-mock';
import { KvartalsvisSykefraværshistorikk } from '../kvartalsvis-sykefraværshistorikk-api';
import { AggregertStatistikkResponse } from '../../hooks/useAggregertStatistikk';
import { underenhetFiskOgFleskMock } from '../mockedApiResponses/underenhet-mock';

export interface OrganisasjonMock {
    orgnr: string;
    sykefraværshistorikkKvartalsvis?: KvartalsvisSykefraværshistorikk[] | number;
    aggregertStatistikk?: Partial<AggregertStatistikkResponse> | number;
    overordnetEnhet?: OverordnetEnhetDto | number;
    underenhet?: UnderenhetDto | number;
}

export const getMockOrganisasjon = (orgnr?: string): OrganisasjonMock =>
    mockedeOrganisasjoner.find((org) => org.orgnr === orgnr) ?? {
        orgnr: '101010101',
        sykefraværshistorikkKvartalsvis: 500,
        aggregertStatistikk: 500,
    };

export const OverordnetEnhetFiskOgFlesk: OverordnetEnhetDto = {
    organisasjonsnummer: '111111111',
    institusjonellSektorkode: { kode: '2100', beskrivelse: 'Private aksjeselskaper mv.' },
};

const mockedeOrganisasjoner: OrganisasjonMock[] = [
    {
        orgnr: '111111111',
        sykefraværshistorikkKvartalsvis: 500,
        aggregertStatistikk: 500,
        overordnetEnhet: OverordnetEnhetFiskOgFlesk,
    },
    {
        orgnr: '101010101',
        sykefraværshistorikkKvartalsvis: 500,
        aggregertStatistikk: 500,
    },
    {
        orgnr: '100100100',
        sykefraværshistorikkKvartalsvis: 403,
        aggregertStatistikk: 403,
    },
    {
        orgnr: '910969439',
        aggregertStatistikk: lagAggregertStatistikkMockGul(
            Statistikkategori.NÆRING,
            'Produksjon av nærings- og nytelsesmidler'
        ),
        overordnetEnhet: OverordnetEnhetFiskOgFlesk,
        underenhet: underenhetFiskOgFleskMock,
    },
    {
        orgnr: '888888881',
        sykefraværshistorikkKvartalsvis: lagMockHistorikkForBarnehage(),
        aggregertStatistikk: aggregertStatistikkMockRødBarnehage,
    },
    {
        orgnr: '888888882',
        sykefraværshistorikkKvartalsvis: lagMockHistorikkForBarnehage(),
        aggregertStatistikk: aggregertStatistikkMockGulBarnehage,
    },
    {
        orgnr: '888888883',
        sykefraværshistorikkKvartalsvis: lagMockHistorikkForBarnehage(),
        aggregertStatistikk: aggregertStatistikkMockGrønnBarnehage,
    },
    {
        orgnr: '888888884',
        sykefraværshistorikkKvartalsvis: lagMockHistorikkForBarnehage(),
        aggregertStatistikk: 500,
    },
    {
        orgnr: '888888885',
        sykefraværshistorikkKvartalsvis: undefined,
        aggregertStatistikk: undefined,
    },
    {
        orgnr: '888888886',
        sykefraværshistorikkKvartalsvis: lagMockHistorikkForBarnehage(),
        aggregertStatistikk: aggregertStatistikkMockMedBare2Kvartaler(),
    },
    {
        orgnr: '888888887',
        sykefraværshistorikkKvartalsvis: lagMockHistorikkForBarnehage(),
        aggregertStatistikk: aggregertStatistikkMockMaskert,
    },
    {
        orgnr: '333333333',
        sykefraværshistorikkKvartalsvis:
            lagHistorikkMedLandSektorOgNæringMenIngenDataForOverordnetEnhetEllerUnderenhet(),
        aggregertStatistikk: lagAggregertStatistikkMockGul(
            Statistikkategori.NÆRING,
            'Produksjon av nærings- og nytelsesmidler'
        ),
    },
    {
        orgnr: '444444444',
        sykefraværshistorikkKvartalsvis: lagMaskertHistorikk(),
        aggregertStatistikk: aggregertStatistikkMockMaskert,
    },
    {
        orgnr: '120000001',
        sykefraværshistorikkKvartalsvis: lagMockHistorikkForBarnehage(),
        aggregertStatistikk: lagAggregertStatistikkMockGul(Statistikkategori.BRANSJE, 'Barnehager'),
    },
    {
        orgnr: '120000002',
        aggregertStatistikk: lagAggregertStatistikkMockGul(Statistikkategori.BRANSJE, 'Sykehjem'),
    },
    {
        orgnr: '120000003',
        aggregertStatistikk: lagAggregertStatistikkMockGul(Statistikkategori.BRANSJE, 'Sykehus'),
    },
    {
        orgnr: '120000004',
        aggregertStatistikk: lagAggregertStatistikkMockGul(
            Statistikkategori.BRANSJE,
            'Næringsmiddelindustrien'
        ),
    },
    {
        orgnr: '120000005',
        aggregertStatistikk: lagAggregertStatistikkMockGul(Statistikkategori.BRANSJE, 'Transport'),
    },
    {
        orgnr: '120000006',
        aggregertStatistikk: lagAggregertStatistikkMockGul(
            Statistikkategori.BRANSJE,
            'Byggebransjen'
        ),
    },
    {
        orgnr: '120000007',
        aggregertStatistikk: lagAggregertStatistikkMockGul(
            Statistikkategori.BRANSJE,
            'Anleggsbransjen'
        ),
    },
    {
        orgnr: '120000009',
        aggregertStatistikk: lagAggregertStatistikkMockGul(
            Statistikkategori.NÆRING,
            'Flisespikkerinæringen'
        ),
    },
];
