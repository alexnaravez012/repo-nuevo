import {CommonThirdDTO} from '../../tienda724/dashboard/business/commons/CommonThirdDTO';
import {MailDTO} from './mailDTO';
import {PhoneDTO} from './phoneDTO';

export class DirectoryDTO {

  address: string;
  country: string;
  city: string;
  webpage: string;
  state: CommonThirdDTO;
  mails: MailDTO[];
  phones: PhoneDTO[];

  constructor(address: string,
    country: string,
    city: string,
    webpage: string,
    state: CommonThirdDTO,
    mails: MailDTO[],
    phones: PhoneDTO[]
  ) { }

}
