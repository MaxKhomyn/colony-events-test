
export enum EventTypes {
    NotIdentified,
    ColonyInitialized,
    ColonyRoleSet,
    PayoutClaimed,
    DomainAdded,
}

export interface EventModel {
    id: string;
    date?: Date;
    type: EventTypes;
}

export interface UserEventModel extends EventModel {
    userAddress: string;
}

export interface ColonyInitializedEventModel extends EventModel {
}

export interface ColonyRoleSetEventModel extends UserEventModel {
    domainId: string;
    role: string;
}

export interface PayoutClaimedEventModel extends UserEventModel {
    amount: string;
    token: string;
    fundingPotId: string;
}

export interface DomainAddedEventModel extends EventModel {
    domainId: string;
}
