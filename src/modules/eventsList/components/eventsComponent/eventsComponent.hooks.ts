import { useCallback, useEffect, useMemo, useState } from "react";
import { eventsService } from "./../../services/events.service";
import { EventModel, EventTypes, UserEventModel } from "./../../models/event.models";
import { LogDescription } from "ethers/utils/interface";

interface EventsComponentState {
    isLoading: boolean;
    events: EventModel[];
}

export function useFacade(): [EventsComponentState] {
    const [state, setState] = useState({
        isLoading: true,
        events: [],
    } as EventsComponentState);

    const setUserAddress = (event: UserEventModel, log: any) => {
        if (event.hasOwnProperty('userAddress')) {
            eventsService.getUserAddress(log).subscribe(address => {
                event.id = address;
                event.userAddress = address;
                setState(state => ({...state}));
            });
        }
    }

    const setTime = (event: EventModel, log: LogDescription) => {
        eventsService.getTime(log).subscribe(time => {
            event.date = new Date(time);
            setState(state => ({...state}));
        });
    }

    const ColonyInitialized = useCallback((log: LogDescription) =>
        ({id: log.topic, type: EventTypes.ColonyInitialized})
    ,[]);

    const colonyRoleSet = useCallback((log: LogDescription) =>
        ({id: log.topic, type: EventTypes.ColonyRoleSet, userAddress: '', domainId: log.values.topic, role: ''})
    ,[]);

    const payoutClaimed = useCallback((log: LogDescription) =>
        ({id: log.topic, type: EventTypes.PayoutClaimed, userAddress: '', amount: log.values.amount.toString(), token: log.values.token, fundingPotId: log.values.fundingPotId.toString() })
    ,[]);

    const domainAdded = useCallback((log: LogDescription) =>
        ({id: log.topic, type: EventTypes.DomainAdded, domainId: log.values.topic})
    ,[]);

    const eventsTypes = useMemo(() => new Map<string, (log: LogDescription) => EventModel>([
        ['ColonyInitialized', ColonyInitialized],
        ['ColonyRoleSet', colonyRoleSet],
        ['PayoutClaimed', payoutClaimed],
        ['DomainAdded', domainAdded]
    ]), [ColonyInitialized, colonyRoleSet, payoutClaimed, domainAdded]);

    const toEvent = useCallback((log: LogDescription): EventModel => {
        const getEvent = eventsTypes.get(log.name);

        if (getEvent) {
            const event = getEvent(log);
            setTime(event, log);
            setUserAddress(event as UserEventModel, log);

            return event;
        }

        return {id: '', type: EventTypes.NotIdentified}
    }, [eventsTypes]);

    const toEvents = useCallback((logs: LogDescription[]) => {
        return logs.map(i => toEvent(i));
    }, [toEvent]);

    const useEffectCB = () => {
        const errorCB = (error: string) => {
            setState(state => ({...state, isLoading: false}))
            alert(error);
        }

        const initializeCB = () => {
            eventsService.getLogs().subscribe(
                logs => {
                    const converted = toEvents(logs);
                    setState(state => ({...state, events: [...converted], isLoading: false}))
                },
                errorCB
            );
        }

        eventsService.initialize().subscribe(initializeCB, errorCB);
    }

    useEffect(useEffectCB, [toEvents]);

    return [state]
}