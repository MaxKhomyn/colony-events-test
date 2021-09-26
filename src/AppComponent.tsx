import React from 'react';
import './AppComponent.module.css';
import { EventsPage } from './modules/eventsList/pages/eventsPage/EventsPage';

export const AppComponent: React.FC = () => {

    return (
        <EventsPage />
    );
}
