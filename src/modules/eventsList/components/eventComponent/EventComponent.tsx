import moment from 'moment';
import React from 'react';
import { ColonyRoleSetEventModel, DomainAddedEventModel, EventModel, EventTypes, PayoutClaimedEventModel } from '../../models/event.models';
import styles from './eventComponent.module.css';
import Identicon from 'react-blockies';

interface EventComponentProps {
    event: EventModel;
}

export const EventComponent: React.FC<EventComponentProps> = (props: EventComponentProps) => {
    const { event } = props;

    const getAvatar = (id: string) => {
        return (
            <Identicon
                seed={id}
                size={10}
                scale={3}
                color="#dfe"
                bgColor="#ffe"
                spotColor="#abc"
                className={styles.avatar}
            />
        )
    }

    const colonyInitialized = () => {
        const message = "Congratulations! It's a beautiful baby colony!";

        return (
            <div className={styles.primary} title={message}>
                {message}
            </div>
        )
    }

    const colonyRoleSet = (event: ColonyRoleSetEventModel) => {
        const message = `${event.role} role assigned to user ${event.userAddress} in domain ${event.domainId}`;

        return (
            <div className={styles.primary} title={message}>
                <><strong>{event.role}</strong> role assigned to user <strong>{event.userAddress}</strong> in domain <strong>{event.domainId}</strong></>
            </div>
        )
    }

    const payoutClaimed = (event: PayoutClaimedEventModel) => {
        const message= `${event.userAddress} claimed ${event.amount}${event.token} payout from pot ${event.fundingPotId}`;

        return (
            <div className={styles.primary} title={message}>
                <span><strong>{event.userAddress}</strong> claimed <strong>{event.amount}</strong><strong>{event.token}</strong> payout from pot <strong>{event.fundingPotId}</strong></span>
            </div>
        )
    }

    const domainAdded = (event: DomainAddedEventModel) => {
        const message = `Domain ${event.domainId} added`;

        return (
            <div className={styles.primary} data-title={message}>
                <>Domain <strong>{event.domainId}</strong> added</>
            </div>
        )
    }

    const messages = new Map<EventTypes, (event: any) => JSX.Element>([
        [EventTypes.ColonyInitialized, colonyInitialized],
        [EventTypes.ColonyRoleSet, colonyRoleSet],
        [EventTypes.PayoutClaimed, payoutClaimed],
        [EventTypes.DomainAdded, domainAdded]
    ])

    const getPrimary = () => {
        const primary = messages.get(event.type);

        if (primary) {
            return primary(event);
        }

        return <></>;
    }

    return (
        <div className={styles.event}>
            <div className={styles.content}>
                {getAvatar(event.id)}

                <div className={styles.data}>
                    {getPrimary()}

                    <div className={styles.time}>
                        {moment(event.date?.toJSON()).format('D MMM')}
                    </div>
                </div>
            </div>
        </div>
    )
}
