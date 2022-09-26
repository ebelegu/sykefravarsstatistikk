import {tilIsoDatoMedUtcTimezoneUtenMillis} from '../utils/app-utils';
import {TjenestePerOrgnr} from './IaTjenesterMetrikkerContext';
import {BASE_PATH} from '../konstanter';

interface IaTjenesteMetrikk {
  orgnr: String;
  altinnRettighet: String;
  type: String;
  kilde: String;
  tjenesteMottakkelsesdato: String;
}

export enum IaTjenesteKilde {
  SYKEFRAVÆRSSTATISTIKK = 'SYKEFRAVÆRSSTATISTIKK',
  KALKULATOR = 'KALKULATOR',
}

const erMetrikkerSendtForKilde = (
    orgnr: string | undefined,
    sendteMetrikker: [TjenestePerOrgnr],
    kilde: IaTjenesteKilde
) => {
  return sendteMetrikker.some(
      (tjenestePerOrgnr) => tjenestePerOrgnr.orgnr === orgnr && tjenestePerOrgnr.kilde === kilde
  );
};

export const erIaTjenesterMetrikkerSendtForBedrift = (
    orgnr: string,
    sendteMetrikker: [TjenestePerOrgnr],
    kilde: IaTjenesteKilde = IaTjenesteKilde.SYKEFRAVÆRSSTATISTIKK
): boolean => {
  return erMetrikkerSendtForKilde(orgnr, sendteMetrikker, kilde);
};

export const iaTjenesterMetrikkerErSendtForBedrift = (
    orgnr: string | undefined,
    sendteMetrikker: [TjenestePerOrgnr],
    kilde: IaTjenesteKilde = IaTjenesteKilde.SYKEFRAVÆRSSTATISTIKK
): [TjenestePerOrgnr] => {
  if (orgnr !== undefined && !erMetrikkerSendtForKilde(orgnr, sendteMetrikker, kilde)) {
    sendteMetrikker.push({orgnr: orgnr, kilde: kilde});
  }
  return sendteMetrikker;
};

const getIaTjenesterMetrikkerUrl = () => {
  return `${BASE_PATH}/proxy/ia-tjenester-metrikker`;
};

const iaTjenesterMetrikkerAPI = `${getIaTjenesterMetrikkerUrl()}/innlogget/mottatt-iatjeneste`;

function byggIaTjenesteMottattMetrikk(
    nåværendeOrgnr: string | undefined,
    kilde: string = IaTjenesteKilde.SYKEFRAVÆRSSTATISTIKK
) {
  const iaTjenesteMetrikk: IaTjenesteMetrikk = {
    orgnr: nåværendeOrgnr ?? '',
    kilde: kilde,
    type: 'DIGITAL_IA_TJENESTE',
    tjenesteMottakkelsesdato: tilIsoDatoMedUtcTimezoneUtenMillis(new Date()),
    altinnRettighet: 'SYKEFRAVÆRSSTATISTIKK_FOR_VIRKSOMHETER',
  };
  return iaTjenesteMetrikk;
}

export const sendIaTjenesteMetrikk = async (iatjeneste: IaTjenesteMetrikk) => {
  const settings = {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(iatjeneste),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  try {
    // @ts-ignore
    const fetchResponse = await fetch(`${iaTjenesterMetrikkerAPI}`, settings);
    const data = await fetchResponse.json();
    return data.status === 'created';
  } catch (e) {
    return false;
  }
};

export const sendIaTjenesteMetrikkMottattEvent = (
    orgnr: string | undefined,
    context: any,
    kilde: IaTjenesteKilde = IaTjenesteKilde.SYKEFRAVÆRSSTATISTIKK
) => {
  const iaTjenesteMetrikk = byggIaTjenesteMottattMetrikk(orgnr, kilde);
  if (
      !erIaTjenesterMetrikkerSendtForBedrift(
          orgnr ?? '',
          context.bedrifterSomHarSendtMetrikker,
          kilde
      )
  ) {
    sendIaTjenesteMetrikk(iaTjenesteMetrikk).then((isSent) => {
      if (isSent) {
        context.setBedrifterSomHarSendtMetrikker(
            iaTjenesterMetrikkerErSendtForBedrift(
                orgnr,
                context.bedrifterSomHarSendtMetrikker,
                kilde
            )
        );
      }
    });
  }
};
