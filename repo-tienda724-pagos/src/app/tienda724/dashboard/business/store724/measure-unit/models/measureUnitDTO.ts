import { CommonStateStoreDTO } from '../../commons/CommonStateStoreDTO'
import { CommonStoreDTO } from '../../commons/CommonStoreDTO'

export class MeasureUnitDTO{
    id_measure_unit_father:number;
    common:CommonStoreDTO;
    state:CommonStateStoreDTO;

    constructor( id_measure_unit_father:number,
        common:CommonStoreDTO,
        state:CommonStateStoreDTO) { }
}