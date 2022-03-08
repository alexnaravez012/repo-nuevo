import {CommonThird} from '../../tienda724/dashboard/business/commons/CommonThird';
import {CommonBasicInfo} from '../../tienda724/dashboard/business/commons/CommonBasicInfo';
import {Directory} from './directory';
import {Employee} from './employee';
import {UserThird} from './userThird';

export class Person {

    id_person:number;
    first_name:string;
    second_name:string;
    first_lastname:string;
    second_lastname:string;
    birthday:Date;
    info:CommonBasicInfo;

    common_thirdDTO:CommonThird;
    directoryDTO:Directory;
    employee:Employee;
    uuid:UserThird;

    constructor(
        id_person:number,
        first_name:string,
        second_name:string,
        first_lastname:string,
        second_lastname:string,
        birthday:Date,
        info:CommonBasicInfo,
        common_thirdDTO:CommonThird,
        directoryDTO:Directory,
        employee:Employee,
        uuid:UserThird

      ) { }

    }
