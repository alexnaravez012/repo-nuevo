import {CommonBasicInfoDTO} from '../../../commons/CommonBasicInfoDTO';
import {CommonThirdDTO} from '../../../commons/CommonThirdDTO';
import {DirectoryDTO} from '../../../../../../shared/models/directoryDTO';
import {PersonDTO} from '../../../../../../shared/models/personDTO';

export class ThirdDTO {

      id_third_type: number;
      id_third_father: number;
      info: CommonBasicInfoDTO;
      state: CommonThirdDTO;
      profile: PersonDTO;
      directory: DirectoryDTO;

    constructor(id_third_type: number,
        id_third_father: number,
        info: CommonBasicInfoDTO,
        state: CommonThirdDTO,
        profile: PersonDTO,
        directory: DirectoryDTO) { }

}
