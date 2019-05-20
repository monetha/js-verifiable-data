import { PassportGenerator } from './passport/PassportGenerator';
import { PassportOwnership } from './passport/PassportOwnership';
import { FactReader } from './passport/FactReader';
import { FactWriter } from './passport/FactWriter';
import { FactRemover } from './passport/FactRemover';
import { Permissions } from './passport/Permissions';
import { PassportReader } from './passport/PassportReader';
import { EventType, DataType, IHistoryEvent } from './models/IHistoryEvent';
declare const _default: {
    PassportGenerator: typeof PassportGenerator;
    PassportOwnership: typeof PassportOwnership;
    PassportReader: typeof PassportReader;
    FactReader: typeof FactReader;
    FactWriter: typeof FactWriter;
    FactRemover: typeof FactRemover;
    Permissions: typeof Permissions;
};
export default _default;
export { EventType, DataType, IHistoryEvent, };
