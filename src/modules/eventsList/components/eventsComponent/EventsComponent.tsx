import React from 'react';
import { Container } from '../../../common/components/container/Container';
import { EventComponent } from '../eventComponent/EventComponent';
import { useFacade } from './eventsComponent.hooks';
import styles from './eventsComponent.module.css';

export const EventsComponent: React.FC = () => {
    const [
        {
            isLoading,
            events,
        },
    ] = useFacade();

    const renderItems = () => {
        const items: any[] = [];

        events.forEach((event, index) => {
            items.push(<div key={`event-${index}`}><EventComponent event={event}/></div>);
            items.push(<div key={`divider-${index}`} className={styles.divider} />);
        })

        items.pop();

        return items;
    }

    return (
        <Container>
            {isLoading ? <div>Loading . . .</div> : renderItems()}
        </Container>
    )
}
