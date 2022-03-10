import {CommonBasicInfo} from '../../../commons/CommonBasicInfo';
import {CommonThird} from '../../../commons/CommonThird';
import {TypeThirdComponent} from '../../type-third/type-third.component';
import {Directory} from '../../../../../../shared/models/directory';

export class Third {

    id_third: number;
    id_third_father: number;
    profile: any;
    type: TypeThirdComponent;
    state: CommonThird;
    info: CommonBasicInfo;
    directory: Directory;

    constructor(

        id_third: number,
        id_third_father: number,
        profile: any,
        type: TypeThirdComponent,
        state: CommonThird,
        info: CommonBasicInfo,
        directory: Directory

    ) { }

}
