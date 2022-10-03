import React, { FunctionComponent } from 'react';
import { Statistikkategori } from '../../api/summert-sykefraværshistorikk-api';
import {
    EkspanderbartSammenligningspanel,
    getVurdering,
} from '../SammenligningMedBransje/EkspanderbartSammenligningspanel';
import { RestStatus } from '../../api/api-utils';
import Skeleton from 'react-loading-skeleton';
import { SammenligningsType } from '../vurderingstekster';
import { SammenligningIngress } from '../SammenligningIngress/SammenligningIngress';
import { SlikHarViKommetFramTilDittResultat } from '../SlikHarViKommetFramTilDittResultat/SlikHarViKommetFramTilDittResultat';
import './EkspanderbarSammenligning.less';
import { DinNæringEllerBransje } from './DinNæringEllerBransje/DinNæringEllerBransje';
import { Element } from 'nav-frontend-typografi';
import { AggregertStatistikkResponse } from '../../hooks/useAggregertStatistikk';

interface Props {
    aggregertStatistikk: AggregertStatistikkResponse;
}

const getBransjeEllerNæringKategori = (aggregertStatistikk: AggregertStatistikkResponse) => {
    const bransjedata = aggregertStatistikk.aggregertData?.get(Statistikkategori.BRANSJE)
        ?.prosentSiste4KvartalerTotalt?.verdi;
    if (bransjedata !== undefined) return Statistikkategori.BRANSJE;
    return Statistikkategori.NÆRING;
};


export const EkspanderbarSammenligning: FunctionComponent<Props> = ({ aggregertStatistikk }) => {
    if (
        aggregertStatistikk.restStatus === RestStatus.,IngenTilgang ||
        aggregertStatistikk.restStatus === RestStatus.IkkeInnlogget
    ) {
        return null;
    }

    if (
        aggregertStatistikk.restStatus === RestStatus.LasterInn ||
        aggregertStatistikk.restStatus === RestStatus.IkkeLastet
    ) {
        return (
            <Skeleton
                className="ekspanderbart-sammenligningspanel__loading-skeleton"
                height={355}
            />
        );
    }

    const statistikKategori = getBransjeEllerNæringKategori(aggregertStatistikk);
    const harBransje = statistikKategori === Statistikkategori.BRANSJE;

    const [virksomhet, BransjeEllerNæring] = [
        aggregertStatistikk.aggregertData?.get(Statistikkategori.VIRKSOMHET),
        aggregertStatistikk.aggregertData?.get(
            harBransje ? Statistikkategori.BRANSJE : Statistikkategori.NÆRING
        ),
    ];

    return (
        <div className="ekspanderbar-sammenligning">
            <SammenligningIngress harBransje={harBransje} />
            <SlikHarViKommetFramTilDittResultat
                resultat={getVurdering(
                    virksomhet?.prosentSiste4KvartalerTotalt,
                    BransjeEllerNæring?.prosentSiste4KvartalerTotalt
                )}
                kvartaler={virksomhet?.prosentSiste4KvartalerTotalt?.kvartalerIBeregningen}
            />
            <DinNæringEllerBransje
                restStatus={aggregertStatistikk.restStatus}
                statistikKategori={statistikKategori}
                label={BransjeEllerNæring?.prosentSiste4KvartalerTotalt?.label || ''}
            />
            <Element className="ekspanderbar-sammenligning__undertittel">
                Overordnet sammenligning:
            </Element>
            <EkspanderbartSammenligningspanel
                className="ekspanderbar-sammenligning__sammenligning-totalt"
                virksomhetStatistikk={virksomhet?.prosentSiste4KvartalerTotalt}
                bransjeEllerNæringStatistikk={BransjeEllerNæring?.prosentSiste4KvartalerTotalt}
                sammenligningsType={SammenligningsType.TOTALT}
                harBransje={harBransje}
            />
            <Element className="ekspanderbar-sammenligning__undertittel">
                Detaljert sammenligning:
            </Element>
            <EkspanderbartSammenligningspanel
                virksomhetStatistikk={virksomhet?.prosentSiste4KvartalerGradert}
                bransjeEllerNæringStatistikk={BransjeEllerNæring?.prosentSiste4KvartalerGradert}
                sammenligningsType={SammenligningsType.GRADERT}
                harBransje={harBransje}
            />
            <EkspanderbartSammenligningspanel
                virksomhetStatistikk={virksomhet?.prosentSiste4KvartalerKorttid}
                bransjeEllerNæringStatistikk={BransjeEllerNæring?.prosentSiste4KvartalerKorttid}
                sammenligningsType={SammenligningsType.KORTTID}
                harBransje={harBransje}
            />
            <EkspanderbartSammenligningspanel
                virksomhetStatistikk={virksomhet?.prosentSiste4KvartalerLangtid}
                bransjeEllerNæringStatistikk={BransjeEllerNæring?.prosentSiste4KvartalerLangtid}
                sammenligningsType={SammenligningsType.LANGTID}
                harBransje={harBransje}
            />
        </div>
    );
};
